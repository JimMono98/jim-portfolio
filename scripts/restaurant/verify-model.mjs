import assert from "node:assert/strict";
import {
  menu,
  categories,
} from "../../src/components/case-studies/restaurant-information-system/restaurantEvidence.mjs";
import {
  initialState,
  orderReducer as reduce,
  total,
  previewError,
} from "../../src/components/case-studies/restaurant-information-system/restaurantOrderModel.mjs";

assert.equal(menu.length, 22);
assert.equal(new Set(menu.map((x) => x.id)).size, 22);
assert.deepEqual(
  categories.map((x) => x.items.map((y) => y[3])),
  [
    [8, 7, 8, 7, 7, 7],
    [4, 4, 3, 4],
    [8, 8, 5, 6, 6, 6, 7],
    [2, 5, 2, 1, 2],
  ],
);
for (const item of menu) {
  for (const quantity of [1, 2, 20]) {
    const state = reduce(initialState(), {
      type: "add",
      product: item.id,
      quantity,
    });
    assert.equal(total(state.rows), item.cents * quantity);
    assert.equal(state.rows[0].originalLabel, item.originalLabel);
  }
}
for (const quantity of [
  "",
  "0",
  "-1",
  "1.5",
  "1e1",
  "x",
  "21",
  Infinity,
  NaN,
  "9007199254740992",
]) {
  const state = reduce(initialState(), {
    type: "add",
    product: "gyros",
    quantity,
  });
  assert.ok(state.error);
  assert.equal(state.rows.length, 0);
  assert.equal(state.trace.length, 0);
}
assert.ok(
  reduce(initialState(), { type: "add", product: "unknown", quantity: 1 })
    .error,
);
let state = initialState();
for (let i = 0; i < 40; i++)
  state = reduce(state, { type: "add", product: "gyros", quantity: 1 });
assert.equal(state.rows.length, 40);
assert.equal(total(state.rows), 32000);
assert.equal(state.trace.length, 30);
assert.ok(reduce(state, { type: "add", product: "water", quantity: 1 }).error);
state = reduce(initialState(), { type: "example" });
assert.equal(total(state.rows), 2500);
assert.equal(state.table, 3);
assert.equal(state.rows.length, 4);
const original = JSON.stringify(state);
const reassigned = reduce(state, { type: "table", table: "6" });
assert.equal(reassigned.table, 6);
assert.deepEqual(reassigned.rows, state.rows);
assert.equal(JSON.stringify(state), original);
for (const table of ["", 0, 7, 1.5, "1e0"])
  assert.ok(reduce(state, { type: "table", table }).error);
for (const kind of ["order", "receipt", "appetizers", "salads", "mains"]) {
  assert.equal(previewError(state, kind), "");
  const previewed = reduce(state, { type: "preview", kind });
  assert.deepEqual(previewed.preview.rows, state.rows);
  assert.equal(previewed.preview.total, 2500);
  const later = reduce(previewed, {
    type: "add",
    product: "water",
    quantity: 1,
  });
  assert.equal(previewed.preview.total, 2500);
  assert.equal(later.preview, null);
}
assert.ok(previewError(initialState(), "order"));
let drink = reduce(initialState(), {
  type: "add",
  product: "water",
  quantity: 1,
});
assert.ok(previewError(drink, "receipt"));
drink = reduce(drink, { type: "table", table: 1 });
assert.ok(previewError(drink, "mains"));
assert.ok(previewError(drink, "unknown"));
for (const type of ["clear", "reset"]) {
  const cleared = reduce(state, { type });
  assert.equal(cleared.rows.length, 0);
  assert.equal(cleared.table, null);
  assert.equal(total(cleared.rows), 0);
  assert.equal(cleared.preview, null);
  assert.equal(cleared.trace.at(-1).before.total, 2500);
  assert.equal(cleared.trace.at(-1).after.total, 0);
}
const traced = reduce(state, { type: "preview", kind: "receipt" });
assert.deepEqual(traced.trace.at(-1).before, traced.trace.at(-1).after);
assert.equal(reduce(state, { type: "unknown" }), state);
console.log(
  "PASS: 22 menu records, quantities, duplicate rows, 40-row/30-trace bounds, €25 example, tables, previews, immutable snapshots, clear/reset.",
);
