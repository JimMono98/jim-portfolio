"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import fixture from "./reconstructionFixture.json";
import {
  accuracyScore,
  classificationSvcKey,
  classificationTreeKey,
  confusionMatrix,
  meanSquaredError,
  predictModel,
  regressionSvrKey,
  regressionTreeKey,
} from "./modelInference.mjs";

const CLASSIFICATION_TREE_DEPTHS = ["3", "5", "10"];
const SVC_C_VALUES = ["0.1", "1", "10"];
const SVC_GAMMA_VALUES = ["10", "1", "0.1"];
const REGRESSION_TREE_DEPTHS = ["none", "3", "5", "7", "9"];
const SVR_C_VALUES = ["0.1", "1", "10"];
const SVR_GAMMA_VALUES = ["scale", "auto"];

const MODEL_COLORS = {
  background: "#15151a",
  panel: "#1c1c22",
  grid: "rgba(255, 255, 255, 0.09)",
  text: "rgba(255, 255, 255, 0.56)",
  classZero: "#f4f4f5",
  classOne: "#00ff99",
  test: "#ffd166",
  probe: "#ff7ad9",
};

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundProbe(value) {
  return Math.round(value * 100) / 100;
}

function formatDecimal(value, digits = 3) {
  return Number(value).toFixed(digits);
}

function formatAccuracy(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatPercentagePoints(value) {
  const points = (value * 100).toFixed(1);
  return `${points} percentage ${points === "1.0" ? "point" : "points"}`;
}

function samplesFromIndices(points, indices) {
  return indices.map((index) => points[index]);
}

function evaluateClassifier(model, samples) {
  const expected = samples.map((sample) => sample[2]);
  const predicted = samples.map((sample) =>
    Number(predictModel(model, [sample[0], sample[1]]))
  );

  return {
    accuracy: accuracyScore(expected, predicted),
    confusion: confusionMatrix(expected, predicted, [0, 1]),
  };
}

function evaluateRegressor(model, samples) {
  const expected = samples.map((sample) => sample[1]);
  const predicted = samples.map((sample) =>
    Number(predictModel(model, [sample[0]]))
  );

  return {
    mse: meanSquaredError(expected, predicted),
  };
}

function ChoiceGroup({ legend, name, value, options, onChange }) {
  const groupId = useId();

  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const optionValue =
            typeof option === "string" ? option : option.value;
          const optionLabel =
            typeof option === "string" ? option : option.label;
          const id = `${groupId}-${String(optionValue).replaceAll(".", "-")}`;
          const selected = value === optionValue;

          return (
            <div key={optionValue}>
              <input
                id={id}
                type="radio"
                name={name}
                value={optionValue}
                checked={selected}
                onChange={(event) => onChange(event.target.value)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={cn(
                  "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors motion-reduce:transition-none",
                  "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#19191f]",
                  selected
                    ? "border-accent bg-accent text-primary"
                    : "border-white/15 bg-white/[0.035] text-white/65 hover:border-accent/50 hover:text-white"
                )}
              >
                {optionLabel}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

function RangeControl({ label, value, min, max, step, onChange }) {
  const id = useId();

  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-black/10 p-4">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-white/70">
          {label}
        </label>
        <output
          htmlFor={id}
          className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent"
        >
          {formatDecimal(value, 2)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 h-11 w-full cursor-pointer accent-[#00ff99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#19191f]"
      />
    </div>
  );
}

function drawDiamond(context, x, y, radius) {
  context.beginPath();
  context.moveTo(x, y - radius);
  context.lineTo(x + radius, y);
  context.lineTo(x, y + radius);
  context.lineTo(x - radius, y);
  context.closePath();
}

function ClassificationCanvas({
  title,
  settings,
  model,
  points,
  trainIndices,
  testIndices,
  bounds,
  gridSize,
  selectedPoint,
  prediction,
  heldOutAccuracy,
  onSelect,
}) {
  const canvasRef = useRef(null);
  const trainSet = useMemo(() => new Set(trainIndices), [trainIndices]);
  const testSet = useMemo(() => new Set(testIndices), [testIndices]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rectangle = canvas.getBoundingClientRect();
    if (!rectangle.width || !rectangle.height) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rectangle.width * ratio);
    canvas.height = Math.round(rectangle.height * ratio);

    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const width = rectangle.width;
    const height = rectangle.height;
    const margin = { left: 42, right: 14, top: 18, bottom: 38 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const toX = (value) =>
      margin.left +
      ((value - bounds.xMin) / (bounds.xMax - bounds.xMin)) * plotWidth;
    const toY = (value) =>
      margin.top +
      (1 - (value - bounds.yMin) / (bounds.yMax - bounds.yMin)) *
        plotHeight;

    context.fillStyle = MODEL_COLORS.background;
    context.fillRect(0, 0, width, height);

    const mask = model.decisionMask;
    const cellWidth = plotWidth / gridSize;
    const cellHeight = plotHeight / gridSize;

    for (let row = 0; row < gridSize; row += 1) {
      for (let column = 0; column < gridSize; column += 1) {
        const predictedClass = mask[row * gridSize + column];
        context.fillStyle =
          predictedClass === 1
            ? "rgba(0, 255, 153, 0.13)"
            : "rgba(255, 255, 255, 0.045)";
        context.fillRect(
          margin.left + column * cellWidth,
          margin.top + row * cellHeight,
          cellWidth + 0.7,
          cellHeight + 0.7
        );
      }
    }

    context.strokeStyle = MODEL_COLORS.grid;
    context.lineWidth = 1;
    context.font = "11px JetBrains Mono, monospace";
    context.fillStyle = MODEL_COLORS.text;

    for (let index = 0; index <= 4; index += 1) {
      const fraction = index / 4;
      const x = margin.left + fraction * plotWidth;
      const y = margin.top + fraction * plotHeight;

      context.beginPath();
      context.moveTo(x, margin.top);
      context.lineTo(x, margin.top + plotHeight);
      context.stroke();

      context.beginPath();
      context.moveTo(margin.left, y);
      context.lineTo(margin.left + plotWidth, y);
      context.stroke();

      const xValue = bounds.xMin + fraction * (bounds.xMax - bounds.xMin);
      const yValue = bounds.yMax - fraction * (bounds.yMax - bounds.yMin);
      context.fillText(formatDecimal(xValue, 1), x - 12, height - 15);
      context.fillText(formatDecimal(yValue, 1), 4, y + 4);
    }

    points.forEach((point, index) => {
      const x = toX(point[0]);
      const y = toY(point[1]);
      const isTest = testSet.has(index);
      const isTrain = trainSet.has(index);
      if (!isTest && !isTrain) return;

      const color = point[2] === 1 ? MODEL_COLORS.classOne : MODEL_COLORS.classZero;
      const radius = isTest ? 3.1 : 2.25;
      context.lineWidth = isTest ? 1.4 : 0.7;
      context.strokeStyle = isTest ? MODEL_COLORS.test : color;
      context.fillStyle = isTest ? MODEL_COLORS.background : color;

      if (point[2] === 1) {
        drawDiamond(context, x, y, radius + 0.7);
      } else {
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
      }
      context.fill();
      context.stroke();
    });

    const probeX = toX(selectedPoint[0]);
    const probeY = toY(selectedPoint[1]);
    context.strokeStyle = MODEL_COLORS.probe;
    context.lineWidth = 2;
    context.beginPath();
    context.arc(probeX, probeY, 7, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.moveTo(probeX - 10, probeY);
    context.lineTo(probeX + 10, probeY);
    context.moveTo(probeX, probeY - 10);
    context.lineTo(probeX, probeY + 10);
    context.stroke();

    context.fillStyle = MODEL_COLORS.text;
    context.font = "12px JetBrains Mono, monospace";
    context.textAlign = "center";
    context.fillText("x₁", margin.left + plotWidth / 2, height - 3);
    context.fillText("x₂", margin.left, 12);
  }, [
    bounds,
    gridSize,
    model,
    points,
    selectedPoint,
    testSet,
    trainSet,
  ]);

  useEffect(() => {
    draw();
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  const handlePointerUp = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rectangle = canvas.getBoundingClientRect();
    const margin = { left: 42, right: 14, top: 18, bottom: 38 };
    const plotWidth = rectangle.width - margin.left - margin.right;
    const plotHeight = rectangle.height - margin.top - margin.bottom;
    const localX = clamp(event.clientX - rectangle.left, margin.left, margin.left + plotWidth);
    const localY = clamp(event.clientY - rectangle.top, margin.top, margin.top + plotHeight);
    const x =
      bounds.xMin +
      ((localX - margin.left) / plotWidth) * (bounds.xMax - bounds.xMin);
    const y =
      bounds.yMax -
      ((localY - margin.top) / plotHeight) * (bounds.yMax - bounds.yMin);

    onSelect([roundProbe(x), roundProbe(y)]);
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#15151a]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 px-5 py-4 md:min-h-[9.75rem] xl:min-h-0">
        <div>
          <h4 className="font-semibold text-white">{title}</h4>
          <p className="mt-1 text-xs text-white/40">{settings}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
          Predicts class {prediction}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`${title}, ${settings}. The selected point is x one ${formatDecimal(
          selectedPoint[0],
          2
        )}, x two ${formatDecimal(selectedPoint[1], 2)}. The model predicts class ${prediction} and has ${formatAccuracy(
          heldOutAccuracy
        )} held-out accuracy.`}
        onPointerUp={handlePointerUp}
        className="aspect-[4/3] w-full touch-pan-y cursor-crosshair"
      />
    </div>
  );
}

function pathFromPoints(points, toX, toY) {
  return points
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command}${toX(point[0]).toFixed(2)},${toY(point[1]).toFixed(2)}`;
    })
    .join(" ");
}

function RegressionPlot({
  title,
  settings,
  model,
  points,
  trainIndices,
  testIndices,
  bounds,
  selectedX,
  prediction,
  heldOutMse,
  onSelect,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const svgRef = useRef(null);
  const trainSet = useMemo(() => new Set(trainIndices), [trainIndices]);
  const testSet = useMemo(() => new Set(testIndices), [testIndices]);
  const width = 640;
  const height = 420;
  const margin = { left: 58, right: 22, top: 24, bottom: 48 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const toX = (value) =>
    margin.left +
    ((value - bounds.xMin) / (bounds.xMax - bounds.xMin)) * plotWidth;
  const toY = (value) =>
    margin.top +
    (1 - (value - bounds.yMin) / (bounds.yMax - bounds.yMin)) * plotHeight;

  const curve = useMemo(() => {
    return Array.from({ length: 241 }, (_, index) => {
      const x = bounds.xMin + (index / 240) * (bounds.xMax - bounds.xMin);
      return [x, Number(predictModel(model, [x]))];
    });
  }, [bounds.xMax, bounds.xMin, model]);

  const referenceCurve = useMemo(() => {
    return Array.from({ length: 241 }, (_, index) => {
      const x = bounds.xMin + (index / 240) * (bounds.xMax - bounds.xMin);
      return [x, x * Math.cos(x)];
    });
  }, [bounds.xMax, bounds.xMin]);

  const handlePointerUp = (event) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rectangle = svg.getBoundingClientRect();
    const localX = ((event.clientX - rectangle.left) / rectangle.width) * width;
    const boundedX = clamp(localX, margin.left, margin.left + plotWidth);
    const x =
      bounds.xMin +
      ((boundedX - margin.left) / plotWidth) * (bounds.xMax - bounds.xMin);
    onSelect(roundProbe(x));
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#15151a]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 px-5 py-4 md:min-h-[9.75rem] xl:min-h-0">
        <div>
          <h4 className="font-semibold text-white">{title}</h4>
          <p className="mt-1 text-xs text-white/40">{settings}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
          Predicts {formatDecimal(prediction, 3)}
        </div>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby={`${titleId} ${descriptionId}`}
        onPointerUp={handlePointerUp}
        className="aspect-[4/3] w-full touch-pan-y cursor-crosshair"
      >
        <title id={titleId}>{title} reconstructed regression plot</title>
        <desc id={descriptionId}>
          {settings}. At x {formatDecimal(selectedX, 2)}, the model predicts{" "}
          {formatDecimal(prediction, 3)} and has held-out mean squared error{" "}
          {formatDecimal(heldOutMse, 3)}.
        </desc>
        <rect width={width} height={height} fill={MODEL_COLORS.background} />

        {Array.from({ length: 5 }, (_, index) => {
          const fraction = index / 4;
          const x = margin.left + fraction * plotWidth;
          const y = margin.top + fraction * plotHeight;
          const xLabel = bounds.xMin + fraction * (bounds.xMax - bounds.xMin);
          const yLabel = bounds.yMax - fraction * (bounds.yMax - bounds.yMin);
          return (
            <g key={fraction} aria-hidden="true">
              <line x1={x} x2={x} y1={margin.top} y2={margin.top + plotHeight} stroke={MODEL_COLORS.grid} />
              <line x1={margin.left} x2={margin.left + plotWidth} y1={y} y2={y} stroke={MODEL_COLORS.grid} />
              <text x={x} y={height - 18} textAnchor="middle" fill={MODEL_COLORS.text} fontSize="12">
                {formatDecimal(xLabel, 1)}
              </text>
              <text x={margin.left - 10} y={y + 4} textAnchor="end" fill={MODEL_COLORS.text} fontSize="12">
                {formatDecimal(yLabel, 1)}
              </text>
            </g>
          );
        })}

        <path
          d={pathFromPoints(referenceCurve, toX, toY)}
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2"
          strokeDasharray="7 7"
          aria-hidden="true"
        />
        <path
          d={pathFromPoints(curve, toX, toY)}
          fill="none"
          stroke={MODEL_COLORS.classOne}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        />

        {points.map((point, index) => {
          const isTest = testSet.has(index);
          if (!isTest && !trainSet.has(index)) return null;
          return (
            <circle
              key={index}
              cx={toX(point[0])}
              cy={toY(point[1])}
              r={isTest ? 4 : 3}
              fill={isTest ? MODEL_COLORS.background : MODEL_COLORS.classZero}
              stroke={isTest ? MODEL_COLORS.test : MODEL_COLORS.classZero}
              strokeWidth={isTest ? 2 : 1}
              aria-hidden="true"
            />
          );
        })}

        <line
          x1={toX(selectedX)}
          x2={toX(selectedX)}
          y1={margin.top}
          y2={margin.top + plotHeight}
          stroke={MODEL_COLORS.probe}
          strokeWidth="2"
          strokeDasharray="5 5"
          aria-hidden="true"
        />
        <circle
          cx={toX(selectedX)}
          cy={toY(prediction)}
          r="7"
          fill={MODEL_COLORS.background}
          stroke={MODEL_COLORS.probe}
          strokeWidth="3"
          aria-hidden="true"
        />
        <text
          x={margin.left + plotWidth / 2}
          y={height - 4}
          textAnchor="middle"
          fill={MODEL_COLORS.text}
          fontSize="13"
        >
          x
        </text>
        <text
          x={margin.left}
          y="14"
          textAnchor="middle"
          fill={MODEL_COLORS.text}
          fontSize="13"
        >
          y
        </text>
      </svg>
    </div>
  );
}

function ResultCard({ title, modelSummary, trainLabel, trainValue, testLabel, testValue, children }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
        Interactive Reconstruction Results
      </p>
      <h4 className="mt-3 text-lg font-semibold text-white">{title}</h4>
      <p className="mt-2 text-xs leading-6 text-white/45">{modelSummary}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <dt className="text-xs text-white/40">{trainLabel}</dt>
          <dd className="mt-2 text-xl font-semibold text-white">{trainValue}</dd>
        </div>
        <div className="rounded-xl border border-accent/20 bg-accent/[0.04] p-4">
          <dt className="text-xs text-white/40">{testLabel}</dt>
          <dd className="mt-2 text-xl font-semibold text-accent">{testValue}</dd>
        </div>
      </dl>
      {children}
    </article>
  );
}

function ConfusionMatrixDetails({ title, matrix }) {
  return (
    <details className="mt-5 rounded-xl border border-white/10 bg-black/10 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        View held-out confusion matrix
      </summary>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[300px] border-collapse text-center text-sm">
          <caption className="mb-3 text-left text-xs leading-5 text-white/45">
            {title}. Rows are actual classes; columns are predicted classes.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="border border-white/10 p-2 text-white/40">
                Actual
              </th>
              <th scope="col" className="border border-white/10 p-2 text-white/60">
                Predicted 0
              </th>
              <th scope="col" className="border border-white/10 p-2 text-white/60">
                Predicted 1
              </th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th scope="row" className="border border-white/10 p-2 text-white/60">
                  Class {rowIndex}
                </th>
                {row.map((value, columnIndex) => (
                  <td
                    key={columnIndex}
                    className={cn(
                      "border border-white/10 p-3 font-semibold",
                      rowIndex === columnIndex ? "text-accent" : "text-white/60"
                    )}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function Legend({ task }) {
  if (task === "classification") {
    return (
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50" aria-label="Classification chart legend">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white" aria-hidden="true" />
          Class 0 · circle
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rotate-45 bg-accent" aria-hidden="true" />
          Class 1 · diamond
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-[#ffd166]" aria-hidden="true" />
          Held-out sample
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-[#ff7ad9]" aria-hidden="true" />
          Selected probe
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50" aria-label="Regression chart legend">
      <span className="inline-flex items-center gap-2">
        <span className="h-0.5 w-6 bg-accent" aria-hidden="true" />
        Fitted model
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-0 w-6 border-t border-dashed border-white/60" aria-hidden="true" />
        Noise-free reference
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-3 w-3 rounded-full border-2 border-[#ffd166]" aria-hidden="true" />
        Held-out sample
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-3 w-3 rounded-full border-2 border-[#ff7ad9]" aria-hidden="true" />
        Selected prediction
      </span>
    </div>
  );
}

function WhatChanged({ children }) {
  return (
    <aside className="rounded-[1.75rem] border border-accent/20 bg-accent/[0.035] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        What changed?
      </p>
      <div className="mt-4 space-y-3 text-sm leading-7 text-white/65 sm:text-base">
        {children}
      </div>
    </aside>
  );
}

export default function MLPlayground() {
  const [task, setTask] = useState("classification");
  const [treeDepth, setTreeDepth] = useState("5");
  const [svcC, setSvcC] = useState("1");
  const [svcGamma, setSvcGamma] = useState("1");
  const [classificationProbe, setClassificationProbe] = useState([2, 2]);
  const [regressionTreeDepth, setRegressionTreeDepth] = useState("5");
  const [svrC, setSvrC] = useState("1");
  const [svrGamma, setSvrGamma] = useState("scale");
  const [selectedX, setSelectedX] = useState(5);
  const [liveMessage, setLiveMessage] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const classification = fixture.classification;
  const regression = fixture.regression;
  const classificationTrain = useMemo(
    () => samplesFromIndices(classification.dataset.points, classification.dataset.trainIndices),
    [classification.dataset.points, classification.dataset.trainIndices]
  );
  const classificationTest = useMemo(
    () => samplesFromIndices(classification.dataset.points, classification.dataset.testIndices),
    [classification.dataset.points, classification.dataset.testIndices]
  );
  const regressionTrain = useMemo(
    () => samplesFromIndices(regression.dataset.points, regression.dataset.trainIndices),
    [regression.dataset.points, regression.dataset.trainIndices]
  );
  const regressionTest = useMemo(
    () => samplesFromIndices(regression.dataset.points, regression.dataset.testIndices),
    [regression.dataset.points, regression.dataset.testIndices]
  );

  const classificationTree =
    classification.trees[classificationTreeKey(treeDepth)];
  const classificationSvc =
    classification.svcs[classificationSvcKey(svcC, svcGamma)];
  const regressionTree =
    regression.trees[regressionTreeKey(regressionTreeDepth)];
  const regressionSvr = regression.svrs[regressionSvrKey(svrC, svrGamma)];

  const classificationTreeTrain = useMemo(
    () => evaluateClassifier(classificationTree, classificationTrain),
    [classificationTrain, classificationTree]
  );
  const classificationTreeTest = useMemo(
    () => evaluateClassifier(classificationTree, classificationTest),
    [classificationTest, classificationTree]
  );
  const classificationSvcTrain = useMemo(
    () => evaluateClassifier(classificationSvc, classificationTrain),
    [classificationSvc, classificationTrain]
  );
  const classificationSvcTest = useMemo(
    () => evaluateClassifier(classificationSvc, classificationTest),
    [classificationSvc, classificationTest]
  );
  const classificationTreePrediction = Number(
    predictModel(classificationTree, classificationProbe)
  );
  const classificationSvcPrediction = Number(
    predictModel(classificationSvc, classificationProbe)
  );

  const regressionTreeTrain = useMemo(
    () => evaluateRegressor(regressionTree, regressionTrain),
    [regressionTrain, regressionTree]
  );
  const regressionTreeTest = useMemo(
    () => evaluateRegressor(regressionTree, regressionTest),
    [regressionTest, regressionTree]
  );
  const regressionSvrTrain = useMemo(
    () => evaluateRegressor(regressionSvr, regressionTrain),
    [regressionSvr, regressionTrain]
  );
  const regressionSvrTest = useMemo(
    () => evaluateRegressor(regressionSvr, regressionTest),
    [regressionSvr, regressionTest]
  );
  const regressionTreePrediction = Number(
    predictModel(regressionTree, [selectedX])
  );
  const regressionSvrPrediction = Number(
    predictModel(regressionSvr, [selectedX])
  );

  const classificationComparison = useMemo(() => {
    const difference =
      classificationTreeTest.accuracy - classificationSvcTest.accuracy;
    if (Math.abs(difference) < 1e-12) {
      return "Both current models have the same held-out accuracy on this deterministic split.";
    }
    const winner = difference > 0 ? "Decision Tree" : "SVC";
    return `For this deterministic reconstruction and these settings, ${winner} currently has higher held-out accuracy by ${formatPercentagePoints(
      Math.abs(difference)
    )}.`;
  }, [classificationSvcTest.accuracy, classificationTreeTest.accuracy]);

  const regressionComparison = useMemo(() => {
    const difference = regressionTreeTest.mse - regressionSvrTest.mse;
    if (Math.abs(difference) < 1e-10) {
      return "Both current models have the same held-out MSE on this deterministic split.";
    }
    const winner = difference < 0 ? "Decision Tree" : "SVR";
    return `For this deterministic reconstruction and these settings, ${winner} currently has lower held-out MSE by ${formatDecimal(
      Math.abs(difference),
      3
    )}.`;
  }, [regressionSvrTest.mse, regressionTreeTest.mse]);

  const classificationTreeExplanation =
    treeDepth === "3"
      ? "Depth 3 restricts the Tree to fewer partitions. That lower capacity can miss parts of the four-cluster pattern."
      : treeDepth === "10"
        ? "Depth 10 permits many smaller partitions. It can follow local samples more aggressively and may also follow noise."
        : "Depth 5 gives the Tree more capacity than the shallow preset while keeping fewer partitions than depth 10.";
  const svcCExplanation =
    svcC === "0.1"
      ? "C=0.1 applies stronger regularization and tolerates more training errors in exchange for a simpler boundary."
      : svcC === "10"
        ? "C=10 penalizes training errors more strongly, allowing the boundary to respond more closely to the training samples."
        : "C=1 keeps the documented middle regularization setting.";
  const svcGammaExplanation =
    svcGamma === "10"
      ? "Gamma 10 gives each support vector highly localized influence, which can produce a more intricate boundary."
      : svcGamma === "0.1"
        ? "Gamma 0.1 spreads each support vector's influence more broadly, producing a smoother decision surface."
        : "Gamma 1 uses the documented middle influence radius.";

  const regressionTreeExplanation =
    regressionTreeDepth === "none"
      ? "The unrestricted Tree can create a very detailed step function and follow noisy observations aggressively."
      : Number(regressionTreeDepth) <= 3
        ? `Depth ${regressionTreeDepth} limits the number of steps and may underfit the oscillating target.`
        : Number(regressionTreeDepth) >= 7
          ? `Depth ${regressionTreeDepth} adds smaller steps and more capacity, with a greater chance of following noise.`
          : "Depth 5 is the documented middle plotted Tree configuration.";
  const svrCExplanation =
    svrC === "0.1"
      ? "C=0.1 tolerates larger errors and usually keeps the fitted response more regularized."
      : svrC === "10"
        ? "C=10 penalizes errors more strongly, allowing the fit to respond more closely to observations."
        : "C=1 is the documented middle SVR setting.";
  const svrGammaExplanation =
    svrGamma === "auto"
      ? `Gamma auto resolves to ${formatDecimal(
          regressionSvr.resolvedGamma,
          3
        )}, giving more localized RBF influence for this one-feature dataset.`
      : `Gamma scale resolves to ${formatDecimal(
          regressionSvr.resolvedGamma,
          3
        )} from the training variance, producing broader RBF influence here.`;

  const announcement =
    task === "classification"
      ? `At x one ${formatDecimal(classificationProbe[0], 2)} and x two ${formatDecimal(
          classificationProbe[1],
          2
        )}, the Tree predicts class ${classificationTreePrediction} and SVC predicts class ${classificationSvcPrediction}. ${classificationComparison}`
      : `At x ${formatDecimal(selectedX, 2)}, the Tree predicts ${formatDecimal(
          regressionTreePrediction,
          3
        )} and SVR predicts ${formatDecimal(regressionSvrPrediction, 3)}. ${regressionComparison}`;

  useEffect(() => {
    if (!hasInteracted) return undefined;

    const timeout = window.setTimeout(() => setLiveMessage(announcement), 250);
    return () => window.clearTimeout(timeout);
  }, [announcement, hasInteracted]);

  const handleKeyboardInteraction = (event) => {
    if (
      [
        "Enter",
        " ",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "PageUp",
        "PageDown",
      ].includes(event.key)
    ) {
      setHasInteracted(true);
    }
  };

  return (
    <div
      onChangeCapture={() => setHasInteracted(true)}
      onPointerUpCapture={() => setHasInteracted(true)}
      onKeyDownCapture={handleKeyboardInteraction}
      className="rounded-[2rem] border border-accent/20 bg-[#19191f] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-6 lg:p-8"
    >
      <div className="rounded-[1.5rem] border border-accent/20 bg-accent/[0.035] p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Deterministic reconstruction
        </p>
        <p className="mt-3 text-sm leading-7 text-white/65">
          Interactive reconstruction based on the documented experiment. The dataset is deterministically regenerated for this portfolio experience and does not reproduce the exact original 2024 run.
        </p>
        <p className="mt-2 text-xs leading-6 text-white/40">
          Models were trained offline with scikit-learn. Decision-surface tiles
          are precomputed from those fitted models for rendering; selected-point
          predictions, fitted regression curves, and displayed metrics are
          calculated locally from exported parameters.
        </p>
      </div>

      <Tabs value={task} onValueChange={setTask} className="mt-6">
        <TabsList className="grid w-full grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/10 p-2">
          <TabsTrigger
            value="classification"
            className="min-h-11 rounded-xl bg-transparent text-sm focus-visible:ring-2 focus-visible:ring-accent data-[state=active]:bg-accent data-[state=active]:text-primary sm:text-base"
          >
            Classification
          </TabsTrigger>
          <TabsTrigger
            value="regression"
            className="min-h-11 rounded-xl bg-transparent text-sm focus-visible:ring-2 focus-visible:ring-accent data-[state=active]:bg-accent data-[state=active]:text-primary sm:text-base"
          >
            Regression
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classification" className="mt-8 min-h-0 focus-visible:ring-accent">
          <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                  Four clusters · two classes · 800 samples
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  Compare two learned decision surfaces.
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  Both panels share the same deterministic training and held-out split. Tap either feature space or move the coordinate controls to evaluate the same point with both models.
                </p>
              </div>
              <Legend task="classification" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <RangeControl
                label="Probe x₁"
                value={classificationProbe[0]}
                min={classification.bounds.xMin}
                max={classification.bounds.xMax}
                step={0.05}
                onChange={(value) => setClassificationProbe(([_, y]) => [value, y])}
              />
              <RangeControl
                label="Probe x₂"
                value={classificationProbe[1]}
                min={classification.bounds.yMin}
                max={classification.bounds.yMax}
                step={0.05}
                onChange={(value) => setClassificationProbe(([x]) => [x, value])}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="min-w-0 space-y-5 rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                <div className="md:min-h-[8.75rem] xl:min-h-0">
                  <ChoiceGroup
                    legend="Decision Tree max_depth"
                    name="classification-tree-depth"
                    value={treeDepth}
                    options={CLASSIFICATION_TREE_DEPTHS}
                    onChange={setTreeDepth}
                  />
                </div>
                <ClassificationCanvas
                  title="Decision Tree"
                  settings={`max_depth=${treeDepth}`}
                  model={classificationTree}
                  points={classification.dataset.points}
                  trainIndices={classification.dataset.trainIndices}
                  testIndices={classification.dataset.testIndices}
                  bounds={classification.bounds}
                  gridSize={classification.grid.size}
                  selectedPoint={classificationProbe}
                  prediction={classificationTreePrediction}
                  heldOutAccuracy={classificationTreeTest.accuracy}
                  onSelect={setClassificationProbe}
                />
              </div>

              <div className="min-w-0 space-y-5 rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                <div className="grid gap-5 sm:grid-cols-2 md:min-h-[8.75rem] xl:min-h-0">
                  <ChoiceGroup
                    legend="RBF SVC · C"
                    name="classification-svc-c"
                    value={svcC}
                    options={SVC_C_VALUES}
                    onChange={setSvcC}
                  />
                  <ChoiceGroup
                    legend="RBF SVC · gamma"
                    name="classification-svc-gamma"
                    value={svcGamma}
                    options={SVC_GAMMA_VALUES}
                    onChange={setSvcGamma}
                  />
                </div>
                <ClassificationCanvas
                  title="RBF Support Vector Classifier"
                  settings={`C=${svcC} · gamma=${svcGamma}`}
                  model={classificationSvc}
                  points={classification.dataset.points}
                  trainIndices={classification.dataset.trainIndices}
                  testIndices={classification.dataset.testIndices}
                  bounds={classification.bounds}
                  gridSize={classification.grid.size}
                  selectedPoint={classificationProbe}
                  prediction={classificationSvcPrediction}
                  heldOutAccuracy={classificationSvcTest.accuracy}
                  onSelect={setClassificationProbe}
                />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <ResultCard
                title="Decision Tree"
                modelSummary={`${classificationTree.childrenLeft.length} exported nodes · max_depth ${treeDepth}`}
                trainLabel="Training accuracy"
                trainValue={formatAccuracy(classificationTreeTrain.accuracy)}
                testLabel="Held-out accuracy"
                testValue={formatAccuracy(classificationTreeTest.accuracy)}
              >
                <ConfusionMatrixDetails
                  title="Decision Tree held-out results"
                  matrix={classificationTreeTest.confusion}
                />
              </ResultCard>
              <ResultCard
                title="RBF SVC"
                modelSummary={`${classificationSvc.supportVectors.length} support vectors · resolved gamma ${formatDecimal(
                  classificationSvc.resolvedGamma,
                  3
                )}`}
                trainLabel="Training accuracy"
                trainValue={formatAccuracy(classificationSvcTrain.accuracy)}
                testLabel="Held-out accuracy"
                testValue={formatAccuracy(classificationSvcTest.accuracy)}
              >
                <ConfusionMatrixDetails
                  title="SVC held-out results"
                  matrix={classificationSvcTest.confusion}
                />
              </ResultCard>
            </div>

            <WhatChanged>
              <p>{classificationTreeExplanation}</p>
              <p>{svcCExplanation} {svcGammaExplanation}</p>
              <p className="font-semibold text-white/80">{classificationComparison}</p>
            </WhatChanged>
          </div>
        </TabsContent>

        <TabsContent value="regression" className="mt-8 min-h-0 focus-visible:ring-accent">
          <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                  Noisy x·cos(x) · 100 observations
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  Compare a stepwise Tree with a smooth RBF fit.
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  Both models use the same deterministic observations and held-out split. Select an x value to calculate both reconstructed predictions locally.
                </p>
              </div>
              <Legend task="regression" />
            </div>

            <RangeControl
              label="Selected x"
              value={selectedX}
              min={regression.bounds.xMin}
              max={regression.bounds.xMax}
              step={0.05}
              onChange={setSelectedX}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="min-w-0 space-y-5 rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                <div className="md:min-h-[8.75rem] xl:min-h-0">
                  <ChoiceGroup
                    legend="Decision Tree max_depth"
                    name="regression-tree-depth"
                    value={regressionTreeDepth}
                    options={REGRESSION_TREE_DEPTHS.map((value) => ({
                      value,
                      label: value === "none" ? "None" : value,
                    }))}
                    onChange={setRegressionTreeDepth}
                  />
                </div>
                <RegressionPlot
                  title="Decision Tree Regressor"
                  settings={`max_depth=${regressionTreeDepth === "none" ? "None" : regressionTreeDepth}`}
                  model={regressionTree}
                  points={regression.dataset.points}
                  trainIndices={regression.dataset.trainIndices}
                  testIndices={regression.dataset.testIndices}
                  bounds={regression.bounds}
                  selectedX={selectedX}
                  prediction={regressionTreePrediction}
                  heldOutMse={regressionTreeTest.mse}
                  onSelect={setSelectedX}
                />
              </div>

              <div className="min-w-0 space-y-5 rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                <div className="grid gap-5 sm:grid-cols-2 md:min-h-[8.75rem] xl:min-h-0">
                  <ChoiceGroup
                    legend="RBF SVR · C"
                    name="regression-svr-c"
                    value={svrC}
                    options={SVR_C_VALUES}
                    onChange={setSvrC}
                  />
                  <ChoiceGroup
                    legend="RBF SVR · gamma"
                    name="regression-svr-gamma"
                    value={svrGamma}
                    options={SVR_GAMMA_VALUES}
                    onChange={setSvrGamma}
                  />
                </div>
                <RegressionPlot
                  title="RBF Support Vector Regressor"
                  settings={`C=${svrC} · gamma=${svrGamma}`}
                  model={regressionSvr}
                  points={regression.dataset.points}
                  trainIndices={regression.dataset.trainIndices}
                  testIndices={regression.dataset.testIndices}
                  bounds={regression.bounds}
                  selectedX={selectedX}
                  prediction={regressionSvrPrediction}
                  heldOutMse={regressionSvrTest.mse}
                  onSelect={setSelectedX}
                />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <ResultCard
                title="Decision Tree Regressor"
                modelSummary={`${regressionTree.childrenLeft.length} exported nodes · max_depth ${regressionTreeDepth === "none" ? "None" : regressionTreeDepth}`}
                trainLabel="Training MSE"
                trainValue={formatDecimal(regressionTreeTrain.mse, 3)}
                testLabel="Held-out MSE"
                testValue={formatDecimal(regressionTreeTest.mse, 3)}
              />
              <ResultCard
                title="RBF SVR"
                modelSummary={`${regressionSvr.supportVectors.length} support vectors · resolved gamma ${formatDecimal(
                  regressionSvr.resolvedGamma,
                  3
                )}`}
                trainLabel="Training MSE"
                trainValue={formatDecimal(regressionSvrTrain.mse, 3)}
                testLabel="Held-out MSE"
                testValue={formatDecimal(regressionSvrTest.mse, 3)}
              />
            </div>

            <WhatChanged>
              <p>{regressionTreeExplanation}</p>
              <p>{svrCExplanation} {svrGammaExplanation}</p>
              <p className="font-semibold text-white/80">{regressionComparison}</p>
            </WhatChanged>
          </div>
        </TabsContent>
      </Tabs>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </p>
    </div>
  );
}
