#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  evaluateClassificationModel,
  evaluateRegressionModel,
  predictModel,
  regressionCurve,
} from "../../src/components/case-studies/decision-tree-svm-models/modelInference.mjs";

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIRECTORY, "../..");
const FIXTURE_PATH = resolve(
  REPO_ROOT,
  "src/components/case-studies/decision-tree-svm-models/reconstructionFixture.json",
);
const REFERENCE_PATH = resolve(SCRIPT_DIRECTORY, "validationReference.json");
const FLOAT_TOLERANCE = 1e-9;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertExact(actual, expected, label) {
  assert(
    actual.length === expected.length,
    `${label}: expected ${expected.length} values, found ${actual.length}.`,
  );

  for (let index = 0; index < expected.length; index += 1) {
    assert(
      actual[index] === expected[index],
      `${label}: mismatch at index ${index}; expected ${expected[index]}, found ${actual[index]}.`,
    );
  }
}

function assertClose(actual, expected, label, tolerance = FLOAT_TOLERANCE) {
  assert(
    actual.length === expected.length,
    `${label}: expected ${expected.length} values, found ${actual.length}.`,
  );

  for (let index = 0; index < expected.length; index += 1) {
    const difference = Math.abs(actual[index] - expected[index]);
    const scale = Math.max(1, Math.abs(expected[index]));
    assert(
      difference <= tolerance * scale,
      `${label}: mismatch at index ${index}; expected ${expected[index]}, found ${actual[index]}.`,
    );
  }
}

function flatten(matrix) {
  return matrix.flatMap((row) => row);
}

function classificationGrid(grid) {
  return grid.yValues.flatMap((yValue) =>
    grid.xValues.map((xValue) => [xValue, yValue]),
  );
}

function verifyClassificationGroup(
  fixture,
  reference,
  groupName,
  gridSamples,
) {
  const points = fixture.dataset.points;
  const { trainIndices, testIndices } = fixture.dataset;
  let verified = 0;

  for (const [key, model] of Object.entries(fixture[groupName])) {
    const expected = reference[groupName][key];
    assert(expected, `Missing sklearn reference for ${groupName}/${key}.`);

    const train = evaluateClassificationModel(model, points, trainIndices);
    const test = evaluateClassificationModel(model, points, testIndices);
    const probePredictions = expected.probePoints.map((sample) =>
      predictModel(model, sample),
    );
    const mask = gridSamples.map((sample) => predictModel(model, sample));

    assertExact(
      train.predictions,
      expected.trainPredictions,
      `${groupName}/${key} training predictions`,
    );
    assertExact(
      test.predictions,
      expected.testPredictions,
      `${groupName}/${key} held-out predictions`,
    );
    assertExact(
      probePredictions,
      expected.probePredictions,
      `${groupName}/${key} boundary probes`,
    );
    assertExact(mask, model.decisionMask, `${groupName}/${key} decision mask`);
    assertClose(
      [train.accuracy, test.accuracy],
      [expected.trainAccuracy, expected.testAccuracy],
      `${groupName}/${key} accuracy`,
    );
    assertExact(
      flatten(test.confusionMatrix),
      flatten(expected.testConfusionMatrix),
      `${groupName}/${key} confusion matrix`,
    );
    assert(
      flatten(test.confusionMatrix).reduce((total, value) => total + value, 0) ===
        160,
      `${groupName}/${key} confusion matrix does not total 160.`,
    );
    verified += 1;
  }

  return verified;
}

function verifyRegressionGroup(fixture, reference, groupName) {
  const points = fixture.dataset.points;
  const { trainIndices, testIndices } = fixture.dataset;
  const curveX = reference.curveX;
  let verified = 0;

  for (const [key, model] of Object.entries(fixture[groupName])) {
    const expected = reference[groupName][key];
    assert(expected, `Missing sklearn reference for ${groupName}/${key}.`);

    const train = evaluateRegressionModel(model, points, trainIndices);
    const test = evaluateRegressionModel(model, points, testIndices);
    const curvePredictions = regressionCurve(model, curveX).map((point) => point[1]);

    assertClose(
      train.predictions,
      expected.trainPredictions,
      `${groupName}/${key} training predictions`,
    );
    assertClose(
      test.predictions,
      expected.testPredictions,
      `${groupName}/${key} held-out predictions`,
    );
    assertClose(
      curvePredictions,
      expected.curvePredictions,
      `${groupName}/${key} fitted curve`,
    );
    assertClose(
      [train.mse, test.mse],
      [expected.trainMse, expected.testMse],
      `${groupName}/${key} MSE`,
    );
    assert(
      test.sampleCount === 20,
      `${groupName}/${key} held-out MSE does not use 20 samples.`,
    );
    verified += 1;
  }

  return verified;
}

async function main() {
  const [fixtureText, referenceText] = await Promise.all([
    readFile(FIXTURE_PATH, "utf8"),
    readFile(REFERENCE_PATH, "utf8"),
  ]);
  const fixture = JSON.parse(fixtureText);
  const reference = JSON.parse(referenceText);
  assert(fixture.schemaVersion === 1, "Unsupported fixture schema version.");
  assert(
    reference.fixtureSchemaVersion === fixture.schemaVersion,
    "Fixture and validation-reference schema versions differ.",
  );
  assert(
    createHash("sha256").update(fixtureText).digest("hex") ===
      reference.fixtureSha256,
    "Fixture hash does not match the sklearn validation reference.",
  );

  const gridSamples = classificationGrid(fixture.classification.grid);
  assert(gridSamples.length === 96 * 96, "Classification grid must be 96x96.");

  const classificationCount =
    verifyClassificationGroup(
      fixture.classification,
      reference.classification,
      "trees",
      gridSamples,
    ) +
    verifyClassificationGroup(
      fixture.classification,
      reference.classification,
      "svcs",
      gridSamples,
    );
  const regressionCount =
    verifyRegressionGroup(
      fixture.regression,
      reference.regression,
      "trees",
    ) +
    verifyRegressionGroup(
      fixture.regression,
      reference.regression,
      "svrs",
    );

  assert(classificationCount === 12, "Expected 12 classification models.");
  assert(regressionCount === 11, "Expected 11 regression models.");
  console.log(
    `Parity verified for ${classificationCount + regressionCount} models ` +
      `(${classificationCount} classification, ${regressionCount} regression).`,
  );
  console.log(
    "Browser inference matches sklearn across training/held-out samples, " +
      "boundary probes, 96x96 masks, fitted curves, and live metrics.",
  );
}

await main();
