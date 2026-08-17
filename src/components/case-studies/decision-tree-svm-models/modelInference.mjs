const CLASSIFICATION_LABELS = [0, 1];

export function classificationTreeKey(depth) {
  return String(depth);
}

export function classificationSvcKey(C, gamma) {
  return `C=${C}|gamma=${gamma}`;
}

export function regressionTreeKey(depth) {
  return depth === null || depth === undefined || depth === "none"
    ? "none"
    : String(depth);
}

export function regressionSvrKey(C, gamma) {
  return `C=${C}|gamma=${gamma}`;
}

export function predictTree(model, sample) {
  let nodeIndex = 0;

  while (model.childrenLeft[nodeIndex] !== -1) {
    const featureIndex = model.feature[nodeIndex];
    nodeIndex =
      Math.fround(sample[featureIndex]) <= model.threshold[nodeIndex]
        ? model.childrenLeft[nodeIndex]
        : model.childrenRight[nodeIndex];
  }

  return model.output[nodeIndex];
}

function squaredDistance(left, right) {
  let distance = 0;

  for (let index = 0; index < left.length; index += 1) {
    const difference = left[index] - right[index];
    distance += difference * difference;
  }

  return distance;
}

function rbfDecision(model, sample) {
  let decision = model.intercept;

  for (let index = 0; index < model.supportVectors.length; index += 1) {
    const kernel = Math.exp(
      -model.resolvedGamma *
        squaredDistance(model.supportVectors[index], sample),
    );
    decision += model.dualCoefficients[index] * kernel;
  }

  return decision;
}

export function predictSvc(model, sample) {
  const decision = rbfDecision(model, sample);
  return decision >= 0 ? model.classes[1] : model.classes[0];
}

export function predictSvr(model, sample) {
  return rbfDecision(model, sample);
}

export function predictModel(model, sample) {
  switch (model.kind) {
    case "decision-tree-classifier":
    case "decision-tree-regressor":
      return predictTree(model, sample);
    case "rbf-svc":
      return predictSvc(model, sample);
    case "rbf-svr":
      return predictSvr(model, sample);
    default:
      throw new Error(`Unsupported reconstruction model kind: ${model.kind}`);
  }
}

export function accuracyScore(expected, predicted) {
  if (expected.length !== predicted.length || expected.length === 0) {
    throw new Error("Accuracy requires equally sized, non-empty arrays.");
  }

  let matches = 0;

  for (let index = 0; index < expected.length; index += 1) {
    if (expected[index] === predicted[index]) {
      matches += 1;
    }
  }

  return matches / expected.length;
}

export function confusionMatrix(
  expected,
  predicted,
  labels = CLASSIFICATION_LABELS,
) {
  if (expected.length !== predicted.length || expected.length === 0) {
    throw new Error("A confusion matrix requires equally sized, non-empty arrays.");
  }

  const labelIndices = new Map(labels.map((label, index) => [label, index]));
  const matrix = labels.map(() => labels.map(() => 0));

  for (let index = 0; index < expected.length; index += 1) {
    const actualIndex = labelIndices.get(expected[index]);
    const predictedIndex = labelIndices.get(predicted[index]);

    if (actualIndex === undefined || predictedIndex === undefined) {
      throw new Error("A value is not present in the confusion-matrix labels.");
    }

    matrix[actualIndex][predictedIndex] += 1;
  }

  return matrix;
}

export function meanSquaredError(expected, predicted) {
  if (expected.length !== predicted.length || expected.length === 0) {
    throw new Error("MSE requires equally sized, non-empty arrays.");
  }

  let squaredError = 0;

  for (let index = 0; index < expected.length; index += 1) {
    const difference = expected[index] - predicted[index];
    squaredError += difference * difference;
  }

  return squaredError / expected.length;
}

export function getSamplesByIndices(points, indices) {
  return indices.map((index) => points[index]);
}

export function evaluateClassificationModel(model, points, indices) {
  const samples = getSamplesByIndices(points, indices);
  const expected = samples.map((point) => point[2]);
  const predictions = samples.map((point) =>
    predictModel(model, point.slice(0, 2)),
  );

  return {
    accuracy: accuracyScore(expected, predictions),
    confusionMatrix: confusionMatrix(expected, predictions),
    sampleCount: samples.length,
    predictions,
  };
}

export function evaluateRegressionModel(model, points, indices) {
  const samples = getSamplesByIndices(points, indices);
  const expected = samples.map((point) => point[1]);
  const predictions = samples.map((point) => predictModel(model, [point[0]]));

  return {
    mse: meanSquaredError(expected, predictions),
    sampleCount: samples.length,
    predictions,
  };
}

export function regressionCurve(model, xValues) {
  return xValues.map((x) => [x, predictModel(model, [x])]);
}
