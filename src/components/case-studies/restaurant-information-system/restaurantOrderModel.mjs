import { menu, reportExample } from "./restaurantEvidence.mjs";

export const limits = Object.freeze({
  quantity: 20,
  rows: 40,
  tables: 6,
  trace: 30,
});
export const money = (cents) => `€${(cents / 100).toFixed(2)}`;
export const total = (rows) =>
  rows.reduce((sum, row) => sum + row.cents * row.quantity, 0);
export const initialState = () => ({
  rows: [],
  table: null,
  trace: [],
  sequence: 0,
  error: "",
  notice: "",
  preview: null,
});
export const snapshot = (state) => ({
  rows: state.rows.map((row) => ({ ...row })),
  table: state.table,
  total: total(state.rows),
});
const integer = (value) =>
  /^(0|[1-9]\d*)$/.test(String(value)) && Number.isSafeInteger(Number(value));
export function previewError(state, kind) {
  if (!["order", "receipt", "appetizers", "salads", "mains"].includes(kind))
    return "Choose a valid preview.";
  if (!state.rows.length || !state.table)
    return "Add an item and select a table before previewing.";
  if (
    !["order", "receipt"].includes(kind) &&
    !state.rows.some((row) => row.category === kind)
  )
    return `Add an item from ${kind} first.`;
  return "";
}
function commit(state, next, input, output) {
  const sequence = state.sequence + 1;
  const entry = {
    id: sequence,
    input,
    before: snapshot(state),
    after: snapshot(next),
    output,
  };
  return {
    ...next,
    sequence,
    error: "",
    notice: output,
    trace: [...state.trace, entry].slice(-limits.trace),
  };
}
export function orderReducer(state, action) {
  const reject = (error) => ({ ...state, error, notice: "" });
  switch (action.type) {
    case "add": {
      const item = menu.find((product) => product.id === action.product);
      if (!item) return reject("Choose a documented menu item.");
      if (
        !integer(action.quantity) ||
        Number(action.quantity) < 1 ||
        Number(action.quantity) > limits.quantity
      )
        return reject("Quantity must be a whole number from 1 to 20.");
      if (state.rows.length >= limits.rows)
        return reject(
          "The reconstruction allows up to 40 rows. Clear the order to start again.",
        );
      const row = {
        ...item,
        quantity: Number(action.quantity),
        rowId: state.sequence + 1,
      };
      const rows = [...state.rows, row];
      return commit(
        state,
        { ...state, rows, preview: null },
        `Add ${row.quantity} × ${item.name}`,
        `Appended a separate row. Total ${money(total(rows))}.`,
      );
    }
    case "table": {
      if (
        !integer(action.table) ||
        Number(action.table) < 1 ||
        Number(action.table) > limits.tables
      )
        return reject("Choose a demo table from 1 to 6.");
      return commit(
        state,
        { ...state, table: Number(action.table), preview: null },
        `Select table ${action.table}`,
        `The same order is assigned to table ${action.table}; rows and total are unchanged.`,
      );
    }
    case "example": {
      const rows = reportExample.map((id, i) => ({
        ...menu.find((item) => item.id === id),
        quantity: 1,
        rowId: state.sequence + i + 1,
      }));
      return commit(
        state,
        { ...state, rows, table: 3, preview: null },
        "Load report example",
        "Report example loaded: four rows, table 3, total €25.00.",
      );
    }
    case "clear":
    case "reset":
      return commit(
        state,
        { ...initialState() },
        action.type === "clear" ? "Clear order" : "Reset studio",
        "Rows and table cleared. Total €0.00.",
      );
    case "preview": {
      const error = previewError(state, action.kind);
      if (error) return reject(error);
      return commit(
        state,
        { ...state, preview: { kind: action.kind, ...snapshot(state) } },
        `Preview ${action.kind}`,
        `Local ${action.kind} preview created. No message or payment was sent.`,
      );
    }
    case "close-preview":
      return { ...state, preview: null };
    default:
      return state;
  }
}
