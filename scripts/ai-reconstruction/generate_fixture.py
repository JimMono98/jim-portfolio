#!/usr/bin/env python3
"""Generate the deterministic browser-inference fixture for the AI case study."""

from __future__ import annotations

import argparse
import hashlib
import json
import platform
from pathlib import Path
from typing import Any

import numpy as np
import sklearn
import scipy
import joblib
import threadpoolctl
from sklearn.metrics import accuracy_score, confusion_matrix, mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC, SVR
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor


REPO_ROOT = Path(__file__).resolve().parents[2]
FIXTURE_PATH = (
    REPO_ROOT
    / "src/components/case-studies/decision-tree-svm-models/reconstructionFixture.json"
)
REFERENCE_PATH = Path(__file__).with_name("validationReference.json")

EXPECTED_PYTHON = (3, 12)
EXPECTED_NUMPY = "1.26.4"
EXPECTED_SCIPY = "1.13.1"
EXPECTED_SKLEARN = "1.5.2"
EXPECTED_JOBLIB = "1.4.2"
EXPECTED_THREADPOOLCTL = "3.5.0"
SEED = 42
CLASSIFICATION_TREE_DEPTHS = (3, 5, 10)
CLASSIFICATION_C_VALUES = (0.1, 1, 10)
CLASSIFICATION_GAMMA_VALUES = (10, 1, 0.1)
REGRESSION_TREE_DEPTHS = (None, 3, 5, 7, 9)
REGRESSION_C_VALUES = (0.1, 1, 10)
REGRESSION_GAMMA_VALUES = ("scale", "auto")
GRID_SIZE = 96
CLASSIFICATION_BOUNDS = {
    "xMin": -6.0,
    "xMax": 6.0,
    "yMin": -6.0,
    "yMax": 6.0,
}
NOTICE = (
    "Interactive reconstruction based on the documented experiment. The dataset "
    "is deterministically regenerated for this portfolio experience and does not "
    "reproduce the exact original 2024 run."
)


def assert_environment() -> None:
    version = tuple(map(int, platform.python_version_tuple()[:2]))
    if version != EXPECTED_PYTHON:
        raise RuntimeError(
            f"Expected Python {EXPECTED_PYTHON[0]}.{EXPECTED_PYTHON[1]}, "
            f"found {platform.python_version()}."
        )
    if np.__version__ != EXPECTED_NUMPY:
        raise RuntimeError(f"Expected NumPy {EXPECTED_NUMPY}, found {np.__version__}.")
    if sklearn.__version__ != EXPECTED_SKLEARN:
        raise RuntimeError(
            f"Expected scikit-learn {EXPECTED_SKLEARN}, found {sklearn.__version__}."
        )
    if scipy.__version__ != EXPECTED_SCIPY:
        raise RuntimeError(f"Expected SciPy {EXPECTED_SCIPY}, found {scipy.__version__}.")
    if joblib.__version__ != EXPECTED_JOBLIB:
        raise RuntimeError(f"Expected joblib {EXPECTED_JOBLIB}, found {joblib.__version__}.")
    if threadpoolctl.__version__ != EXPECTED_THREADPOOLCTL:
        raise RuntimeError(
            f"Expected threadpoolctl {EXPECTED_THREADPOOLCTL}, "
            f"found {threadpoolctl.__version__}."
        )


def number_key(value: float | int) -> str:
    return f"{value:g}"


def classification_svc_key(c_value: float, gamma: float) -> str:
    return f"C={number_key(c_value)}|gamma={number_key(gamma)}"


def regression_svr_key(c_value: float, gamma: str) -> str:
    return f"C={number_key(c_value)}|gamma={gamma}"


def regression_tree_key(depth: int | None) -> str:
    return "none" if depth is None else str(depth)


def json_text(value: Any) -> str:
    return json.dumps(
        value,
        ensure_ascii=False,
        allow_nan=False,
        separators=(",", ":"),
    ) + "\n"


def dataset_hash(points: list[list[float]], train: list[int], test: list[int]) -> str:
    encoded = json_text({"points": points, "train": train, "test": test}).encode()
    return hashlib.sha256(encoded).hexdigest()


def export_tree(model: Any, kind: str, params: dict[str, Any]) -> dict[str, Any]:
    tree = model.tree_
    if kind == "decision-tree-classifier":
        class_indices = np.argmax(tree.value[:, 0, :], axis=1)
        output = model.classes_[class_indices]
    else:
        output = tree.value[:, 0, 0]

    return {
        "kind": kind,
        "params": params,
        "childrenLeft": tree.children_left.astype(int).tolist(),
        "childrenRight": tree.children_right.astype(int).tolist(),
        "feature": tree.feature.astype(int).tolist(),
        "threshold": tree.threshold.astype(float).tolist(),
        "output": output.tolist(),
    }


def export_svm(model: SVC | SVR, kind: str, params: dict[str, Any]) -> dict[str, Any]:
    exported = {
        "kind": kind,
        "params": params,
        "supportVectors": model.support_vectors_.astype(float).tolist(),
        "dualCoefficients": model.dual_coef_[0].astype(float).tolist(),
        "intercept": float(model.intercept_[0]),
        "resolvedGamma": float(model._gamma),
    }
    if isinstance(model, SVC):
        exported["classes"] = model.classes_.astype(int).tolist()
    return exported


def exported_tree_predictions(model: dict[str, Any], samples: np.ndarray) -> np.ndarray:
    predictions: list[float] = []
    for sample in samples:
        node = 0
        while model["childrenLeft"][node] != -1:
            feature = model["feature"][node]
            if np.float32(sample[feature]) <= model["threshold"][node]:
                node = model["childrenLeft"][node]
            else:
                node = model["childrenRight"][node]
        predictions.append(model["output"][node])
    return np.asarray(predictions)


def exported_svm_decisions(model: dict[str, Any], samples: np.ndarray) -> np.ndarray:
    support_vectors = np.asarray(model["supportVectors"], dtype=float)
    dual_coefficients = np.asarray(model["dualCoefficients"], dtype=float)
    differences = samples[:, np.newaxis, :] - support_vectors[np.newaxis, :, :]
    squared_distances = np.sum(differences * differences, axis=2)
    kernel = np.exp(-model["resolvedGamma"] * squared_distances)
    return kernel @ dual_coefficients + model["intercept"]


def exported_svc_predictions(model: dict[str, Any], samples: np.ndarray) -> np.ndarray:
    decisions = exported_svm_decisions(model, samples)
    classes = model["classes"]
    return np.where(decisions >= 0, classes[1], classes[0])


def classification_grid() -> tuple[np.ndarray, dict[str, Any]]:
    x_values = np.linspace(
        CLASSIFICATION_BOUNDS["xMin"],
        CLASSIFICATION_BOUNDS["xMax"],
        GRID_SIZE,
    )
    y_values = np.linspace(
        CLASSIFICATION_BOUNDS["yMax"],
        CLASSIFICATION_BOUNDS["yMin"],
        GRID_SIZE,
    )
    grid_x, grid_y = np.meshgrid(x_values, y_values)
    samples = np.column_stack((grid_x.ravel(), grid_y.ravel()))
    metadata = {
        "size": GRID_SIZE,
        "pointCount": GRID_SIZE * GRID_SIZE,
        "rowOrder": "top-to-bottom",
        "columnOrder": "left-to-right",
        "xValues": x_values.astype(float).tolist(),
        "yValues": y_values.astype(float).tolist(),
    }
    return samples, metadata


def common_classification_probes() -> np.ndarray:
    values = (-5.0, -2.0, 0.0, 2.0, 5.0)
    probes = [[x_value, y_value] for y_value in values for x_value in values]
    probes.extend(
        [
            [-6.0, -6.0],
            [-6.0, 6.0],
            [6.0, -6.0],
            [6.0, 6.0],
            [2.0, 2.0],
        ]
    )
    return np.asarray(probes, dtype=float)


def tree_boundary_probes(model: DecisionTreeClassifier) -> np.ndarray:
    probes = common_classification_probes().tolist()
    epsilon = 1e-7
    for feature, threshold in zip(model.tree_.feature, model.tree_.threshold):
        if feature < 0:
            continue
        for delta in (-epsilon, 0.0, epsilon):
            point = [0.0, 0.0]
            point[int(feature)] = float(threshold + delta)
            probes.append(point)
    return np.asarray(probes, dtype=float)


def svc_boundary_probes(model: SVC, grid_samples: np.ndarray) -> np.ndarray:
    decisions = np.abs(model.decision_function(grid_samples))
    eligible = np.flatnonzero(decisions > 1e-7)
    closest = eligible[np.argsort(decisions[eligible])[:20]]
    return np.vstack((common_classification_probes(), grid_samples[closest]))


def classification_reference_entry(
    model: Any,
    train_x: np.ndarray,
    train_y: np.ndarray,
    test_x: np.ndarray,
    test_y: np.ndarray,
    probes: np.ndarray,
) -> dict[str, Any]:
    train_predictions = model.predict(train_x)
    test_predictions = model.predict(test_x)
    probe_predictions = model.predict(probes)
    return {
        "trainPredictions": train_predictions.astype(int).tolist(),
        "testPredictions": test_predictions.astype(int).tolist(),
        "trainAccuracy": float(accuracy_score(train_y, train_predictions)),
        "testAccuracy": float(accuracy_score(test_y, test_predictions)),
        "testConfusionMatrix": confusion_matrix(
            test_y, test_predictions, labels=[0, 1]
        ).astype(int).tolist(),
        "probePoints": probes.astype(float).tolist(),
        "probePredictions": probe_predictions.astype(int).tolist(),
    }


def build_classification() -> tuple[dict[str, Any], dict[str, Any]]:
    rng = np.random.RandomState(SEED)
    sample_count = 200
    blue = rng.normal(loc=[2, 2], scale=[1, 1], size=(sample_count, 2))
    red = rng.normal(loc=[-2, -2], scale=[1, 1], size=(sample_count, 2))
    blue_extra = rng.normal(loc=[2, -2], scale=[1, 1], size=(sample_count, 2))
    red_extra = rng.normal(loc=[-2, 2], scale=[1, 1], size=(sample_count, 2))
    features = np.vstack((blue, red, blue_extra, red_extra))
    targets = np.asarray([0] * (sample_count * 2) + [1] * (sample_count * 2))
    indices = np.arange(len(features))
    train_indices, test_indices = train_test_split(
        indices, test_size=0.2, random_state=SEED
    )
    train_x = features[train_indices]
    train_y = targets[train_indices]
    test_x = features[test_indices]
    test_y = targets[test_indices]
    grid_samples, grid_metadata = classification_grid()

    trees: dict[str, Any] = {}
    tree_references: dict[str, Any] = {}
    for depth in CLASSIFICATION_TREE_DEPTHS:
        sklearn_model = DecisionTreeClassifier(max_depth=depth, random_state=SEED)
        sklearn_model.fit(train_x, train_y)
        exported = export_tree(
            sklearn_model,
            "decision-tree-classifier",
            {"maxDepth": depth, "randomState": SEED},
        )
        sklearn_grid = sklearn_model.predict(grid_samples).astype(int)
        exported["decisionMask"] = sklearn_grid.tolist()
        reconstructed_grid = exported_tree_predictions(exported, grid_samples)
        if not np.array_equal(sklearn_grid, reconstructed_grid):
            raise AssertionError(f"Classification tree depth {depth} export diverged.")
        key = str(depth)
        trees[key] = exported
        tree_references[key] = classification_reference_entry(
            sklearn_model,
            train_x,
            train_y,
            test_x,
            test_y,
            tree_boundary_probes(sklearn_model),
        )

    svcs: dict[str, Any] = {}
    svc_references: dict[str, Any] = {}
    for c_value in CLASSIFICATION_C_VALUES:
        for gamma in CLASSIFICATION_GAMMA_VALUES:
            sklearn_model = SVC(C=c_value, gamma=gamma, kernel="rbf")
            sklearn_model.fit(train_x, train_y)
            exported = export_svm(
                sklearn_model,
                "rbf-svc",
                {"C": c_value, "gamma": gamma, "kernel": "rbf"},
            )
            sklearn_grid = sklearn_model.predict(grid_samples).astype(int)
            exported["decisionMask"] = sklearn_grid.tolist()
            reconstructed_grid = exported_svc_predictions(exported, grid_samples)
            if not np.array_equal(sklearn_grid, reconstructed_grid):
                raise AssertionError(f"Classification SVC C={c_value}, gamma={gamma} diverged.")
            key = classification_svc_key(c_value, gamma)
            svcs[key] = exported
            svc_references[key] = classification_reference_entry(
                sklearn_model,
                train_x,
                train_y,
                test_x,
                test_y,
                svc_boundary_probes(sklearn_model, grid_samples),
            )

    points = np.column_stack((features, targets)).tolist()
    train_list = train_indices.astype(int).tolist()
    test_list = test_indices.astype(int).tolist()
    fixture = {
        "dataset": {
            "seed": SEED,
            "description": "Four 2D Gaussian clusters with 200 samples per cluster.",
            "generation": {
                "samplesPerCluster": sample_count,
                "centers": [[2, 2], [-2, -2], [2, -2], [-2, 2]],
                "scales": [[1, 1], [1, 1], [1, 1], [1, 1]],
                "clusterLabels": [0, 0, 1, 1],
            },
            "split": {
                "testSize": 0.2,
                "randomState": SEED,
                "stratified": False,
            },
            "points": points,
            "trainIndices": train_list,
            "testIndices": test_list,
            "trainCount": len(train_list),
            "testCount": len(test_list),
            "sha256": dataset_hash(points, train_list, test_list),
        },
        "bounds": CLASSIFICATION_BOUNDS,
        "grid": grid_metadata,
        "trees": trees,
        "svcs": svcs,
    }
    reference = {"trees": tree_references, "svcs": svc_references}
    return fixture, reference


def regression_reference_entry(
    model: Any,
    train_x: np.ndarray,
    train_y: np.ndarray,
    test_x: np.ndarray,
    test_y: np.ndarray,
    curve_x: np.ndarray,
) -> dict[str, Any]:
    train_predictions = model.predict(train_x)
    test_predictions = model.predict(test_x)
    curve_predictions = model.predict(curve_x[:, np.newaxis])
    return {
        "trainPredictions": train_predictions.astype(float).tolist(),
        "testPredictions": test_predictions.astype(float).tolist(),
        "trainMse": float(mean_squared_error(train_y, train_predictions)),
        "testMse": float(mean_squared_error(test_y, test_predictions)),
        "curvePredictions": curve_predictions.astype(float).tolist(),
    }


def build_regression() -> tuple[dict[str, Any], dict[str, Any]]:
    rng = np.random.RandomState(SEED)
    x_values = rng.uniform(0, 10, 100)
    targets = x_values * np.cos(x_values) + rng.normal(scale=1, size=100)
    features = x_values[:, np.newaxis]
    indices = np.arange(len(features))
    train_indices, test_indices = train_test_split(
        indices, test_size=0.2, random_state=SEED
    )
    train_x = features[train_indices]
    train_y = targets[train_indices]
    test_x = features[test_indices]
    test_y = targets[test_indices]
    curve_x = np.linspace(0, 10, 201)

    trees: dict[str, Any] = {}
    tree_references: dict[str, Any] = {}
    for depth in REGRESSION_TREE_DEPTHS:
        sklearn_model = DecisionTreeRegressor(max_depth=depth, random_state=SEED)
        sklearn_model.fit(train_x, train_y)
        exported = export_tree(
            sklearn_model,
            "decision-tree-regressor",
            {"maxDepth": depth, "randomState": SEED},
        )
        reconstructed = exported_tree_predictions(exported, curve_x[:, np.newaxis])
        sklearn_curve = sklearn_model.predict(curve_x[:, np.newaxis])
        if not np.allclose(reconstructed, sklearn_curve, atol=0, rtol=0):
            raise AssertionError(f"Regression tree depth {depth} export diverged.")
        key = regression_tree_key(depth)
        trees[key] = exported
        tree_references[key] = regression_reference_entry(
            sklearn_model, train_x, train_y, test_x, test_y, curve_x
        )

    svrs: dict[str, Any] = {}
    svr_references: dict[str, Any] = {}
    for c_value in REGRESSION_C_VALUES:
        for gamma in REGRESSION_GAMMA_VALUES:
            sklearn_model = SVR(C=c_value, gamma=gamma, kernel="rbf")
            sklearn_model.fit(train_x, train_y)
            exported = export_svm(
                sklearn_model,
                "rbf-svr",
                {"C": c_value, "gamma": gamma, "kernel": "rbf"},
            )
            reconstructed = exported_svm_decisions(exported, curve_x[:, np.newaxis])
            sklearn_curve = sklearn_model.predict(curve_x[:, np.newaxis])
            if not np.allclose(reconstructed, sklearn_curve, atol=1e-10, rtol=1e-10):
                raise AssertionError(f"Regression SVR C={c_value}, gamma={gamma} diverged.")
            key = regression_svr_key(c_value, gamma)
            svrs[key] = exported
            svr_references[key] = regression_reference_entry(
                sklearn_model, train_x, train_y, test_x, test_y, curve_x
            )

    points = np.column_stack((x_values, targets)).tolist()
    train_list = train_indices.astype(int).tolist()
    test_list = test_indices.astype(int).tolist()
    y_padding = 1.0
    fixture = {
        "dataset": {
            "seed": SEED,
            "description": "100 samples from y = x * cos(x) with Gaussian noise (scale 1).",
            "generation": {
                "sampleCount": 100,
                "xDistribution": "uniform [0, 10)",
                "targetFunction": "y = x * cos(x)",
                "noiseDistribution": "Gaussian, scale 1",
            },
            "split": {
                "testSize": 0.2,
                "randomState": SEED,
                "stratified": False,
            },
            "points": points,
            "trainIndices": train_list,
            "testIndices": test_list,
            "trainCount": len(train_list),
            "testCount": len(test_list),
            "sha256": dataset_hash(points, train_list, test_list),
        },
        "bounds": {
            "xMin": 0.0,
            "xMax": 10.0,
            "yMin": float(np.floor(targets.min()) - y_padding),
            "yMax": float(np.ceil(targets.max()) + y_padding),
        },
        "curveX": curve_x.astype(float).tolist(),
        "trees": trees,
        "svrs": svrs,
    }
    reference = {
        "curveX": curve_x.astype(float).tolist(),
        "trees": tree_references,
        "svrs": svr_references,
    }
    return fixture, reference


def build_outputs() -> tuple[dict[str, Any], dict[str, Any]]:
    classification, classification_reference = build_classification()
    regression, regression_reference = build_regression()
    fixture = {
        "schemaVersion": 1,
        "notice": NOTICE,
        "provenance": {
            "kind": "deterministic-portfolio-reconstruction",
            "source": "Documented April 2024 classification and regression appendices",
            "seed": SEED,
            "python": "3.12",
            "numpy": EXPECTED_NUMPY,
            "scipy": EXPECTED_SCIPY,
            "scikitLearn": EXPECTED_SKLEARN,
            "joblib": EXPECTED_JOBLIB,
            "threadpoolctl": EXPECTED_THREADPOOLCTL,
            "methodology": {
                "featureScaling": False,
                "stratifiedSplit": False,
                "crossValidation": False,
                "gridSearchCv": False,
            },
        },
        "classification": classification,
        "regression": regression,
    }
    reference = {
        "schemaVersion": 1,
        "fixtureSchemaVersion": fixture["schemaVersion"],
        "fixtureSha256": hashlib.sha256(json_text(fixture).encode()).hexdigest(),
        "classification": classification_reference,
        "regression": regression_reference,
    }
    validate_outputs(fixture, reference)
    return fixture, reference


def validate_outputs(fixture: dict[str, Any], reference: dict[str, Any]) -> None:
    classification = fixture["classification"]
    regression = fixture["regression"]
    if len(classification["trees"]) != 3 or len(classification["svcs"]) != 9:
        raise AssertionError("Expected 12 classification models.")
    if len(regression["trees"]) != 5 or len(regression["svrs"]) != 6:
        raise AssertionError("Expected 11 regression models.")
    if classification["dataset"]["trainCount"] != 640:
        raise AssertionError("Classification training split must contain 640 samples.")
    if classification["dataset"]["testCount"] != 160:
        raise AssertionError("Classification held-out split must contain 160 samples.")
    if regression["dataset"]["trainCount"] != 80:
        raise AssertionError("Regression training split must contain 80 samples.")
    if regression["dataset"]["testCount"] != 20:
        raise AssertionError("Regression held-out split must contain 20 samples.")

    for group_name in ("trees", "svcs"):
        for key, model in classification[group_name].items():
            if len(model["decisionMask"]) != GRID_SIZE * GRID_SIZE:
                raise AssertionError(f"Decision mask {group_name}/{key} has wrong size.")
            matrix = reference["classification"][group_name][key][
                "testConfusionMatrix"
            ]
            if sum(sum(row) for row in matrix) != 160:
                raise AssertionError(f"Confusion matrix {group_name}/{key} must total 160.")

    for group_name in ("trees", "svrs"):
        for key, model_reference in reference["regression"][group_name].items():
            if len(model_reference["testPredictions"]) != 20:
                raise AssertionError(f"Regression result {group_name}/{key} must use 20 samples.")


def write_or_check(path: Path, value: dict[str, Any], check: bool) -> None:
    expected = json_text(value)
    if check:
        if not path.exists():
            raise RuntimeError(f"Missing generated file: {path.relative_to(REPO_ROOT)}")
        if path.read_text(encoding="utf-8") != expected:
            raise RuntimeError(
                f"Generated output is stale: {path.relative_to(REPO_ROOT)}"
            )
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(expected, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--check",
        action="store_true",
        help="Verify committed generated files without rewriting them.",
    )
    args = parser.parse_args()
    assert_environment()
    fixture, reference = build_outputs()
    write_or_check(FIXTURE_PATH, fixture, args.check)
    write_or_check(REFERENCE_PATH, reference, args.check)
    action = "Verified" if args.check else "Generated"
    print(
        f"{action} 23 models: 12 classification, 11 regression; "
        f"{GRID_SIZE}x{GRID_SIZE} masks for 12 classifiers."
    )


if __name__ == "__main__":
    main()
