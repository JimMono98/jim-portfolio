"use client";

import { useReducer, useRef, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Code2, ReceiptText, Utensils, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, menu } from "./restaurantEvidence.mjs";
import {
  initialState,
  money,
  orderReducer,
  previewError,
  total,
} from "./restaurantOrderModel.mjs";

const control =
  "min-h-11 rounded-xl border border-white/20 bg-primary px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const smallButton =
  "h-auto min-h-11 whitespace-normal rounded-xl px-4 py-3 text-xs leading-5 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary";

function OrderSlip({ order, receipt = false }) {
  return (
    <div className="min-w-0 rounded-2xl bg-[#eeeae0] p-5 text-[#262621] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dashed border-black/30 pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em]">
            {receipt ? "Receipt preview" : "Order summary"}
          </p>
          <p className="mt-2 text-xl font-semibold">
            Table {order.table ?? "—"}
          </p>
        </div>
        <ReceiptText className="h-6 w-6" aria-hidden="true" />
      </div>
      {!order.rows.length ? (
        <p className="py-10 text-sm leading-7 text-black/60">
          Your order starts here. Choose a product and add a quantity.
        </p>
      ) : (
        <ol className="divide-y divide-black/15" aria-label="Order items">
          {order.rows.map((row, i) => (
            <li key={`${i}-${row.rowId}`} className="py-3">
              <div className="flex justify-between gap-3 text-sm">
                <span className="break-words">{row.name}</span>
                <span className="shrink-0 font-semibold">
                  {money(row.quantity * row.cents)}
                </span>
              </div>
              <p className="mt-1 text-xs text-black/60">
                {row.quantity} × {money(row.cents)} / unit
              </p>
            </li>
          ))}
        </ol>
      )}
      <div className="flex justify-between gap-3 border-t border-dashed border-black/30 pt-4 text-lg font-semibold">
        <span>Total</span>
        <span data-testid="order-total">{money(total(order.rows))}</span>
      </div>
      <p className="mt-4 text-[11px] leading-5 text-black/60">
        {receipt
          ? "Portfolio demo · not a fiscal receipt"
          : "One active order · no payment or transmission"}
      </p>
    </div>
  );
}

function TraceInspector({ state }) {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(0);
  const entry =
    state.trace.find((item) => item.id === selected) || state.trace.at(-1);
  const steps = ["Input", "Action", "State change", "Result"];
  return (
    <div className="rounded-2xl border border-amber-200/20 bg-amber-100/[0.025] p-5 sm:p-6">
      <p className="text-xs uppercase tracking-widest text-amber-100">
        Trace an order
      </p>
      <h3 className="mt-3 text-xl">The state behind the screen.</h3>
      <p className="mt-3 text-sm leading-7 text-white/60">
        Inspect an actual committed action. History is read-only; your current
        order does not change.
      </p>
      {!entry ? (
        <p className="mt-6 rounded-xl border border-dashed border-white/20 p-6 text-sm text-white/60">
          Add an item, assign a table, or load the report example to create the
          first trace.
        </p>
      ) : (
        <>
          <label
            htmlFor="restaurant-trace"
            className="mb-2 mt-6 block text-xs text-white/70"
          >
            Committed action · latest 30 retained
          </label>
          <select
            id="restaurant-trace"
            className={`${control} w-full`}
            value={entry.id}
            onChange={(event) => {
              setSelected(Number(event.target.value));
              setStep(0);
            }}
          >
            {[...state.trace].reverse().map((item) => (
              <option value={item.id} key={item.id}>
                #{item.id} · {item.input}
              </option>
            ))}
          </select>
          <div
            className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"
            aria-label="Trace steps"
          >
            {steps.map((label, index) => (
              <button
                key={label}
                type="button"
                aria-pressed={step === index}
                onClick={() => setStep(index)}
                className={`${control} ${step === index ? "border-accent text-accent" : ""}`}
              >
                {index + 1}. {label}
              </button>
            ))}
          </div>
          <div className="mt-5 min-h-40 rounded-xl border border-white/10 bg-black/20 p-5">
            <p className="text-xs text-accent">
              {steps[step]} · action #{entry.id}
            </p>
            {step === 0 && (
              <p className="mt-3 text-sm leading-7">{entry.input}</p>
            )}
            {step === 1 && (
              <p className="mt-3 text-sm leading-7">
                Validated by the portfolio reducer, then committed atomically.
                The original uses Swing ActionPerformed handlers; this is a new
                browser implementation, not recovered Java execution.
              </p>
            )}
            {step === 2 && (
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-white/50">Rows</dt>
                  <dd>
                    {entry.before.rows.length} → {entry.after.rows.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-white/50">Table</dt>
                  <dd>
                    {entry.before.table ?? "None"} →{" "}
                    {entry.after.table ?? "None"}
                  </dd>
                </div>
                <div>
                  <dt className="text-white/50">Total</dt>
                  <dd>
                    {money(entry.before.total)} → {money(entry.after.total)}
                  </dd>
                </div>
              </dl>
            )}
            {step === 3 && (
              <p className="mt-3 text-sm leading-7">{entry.output}</p>
            )}
          </div>
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer rounded py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              Inspect before / after rows
            </summary>
            <pre
              className="mt-2 max-h-64 overflow-auto rounded-xl bg-black/20 p-4 text-xs leading-6"
              tabIndex={0}
            >
              {JSON.stringify(
                { before: entry.before, after: entry.after },
                null,
                2,
              )}
            </pre>
          </details>
        </>
      )}
    </div>
  );
}

export default function RestaurantOrderWorkbench() {
  const [state, dispatch] = useReducer(orderReducer, undefined, initialState);
  const [category, setCategory] = useState("mains");
  const [product, setProduct] = useState("gyros");
  const [quantity, setQuantity] = useState("1");
  const [confirmation, setConfirmation] = useState(null);
  const [view, setView] = useState("restaurant");
  const opener = useRef(null);
  const quantityRef = useRef(null);
  const selectedItem = menu.find((item) => item.id === product);
  const hasOrder = state.rows.length > 0 || state.table !== null;
  const open = Boolean(confirmation || state.preview);
  function close() {
    setConfirmation(null);
    dispatch({ type: "close-preview" });
  }
  function request(type, event) {
    opener.current = event.currentTarget;
    if (hasOrder) setConfirmation(type);
    else execute(type);
  }
  function execute(type) {
    dispatch({ type });
    if (type === "reset") {
      setCategory("mains");
      setProduct("gyros");
      setQuantity("1");
      setView("restaurant");
    }
    setConfirmation(null);
  }
  const previewButtons = [
    ["order", "Preview order notification"],
    ["appetizers", "Appetizers readiness"],
    ["salads", "Salads readiness"],
    ["mains", "Mains readiness"],
    ["receipt", "Preview receipt"],
  ];

  return (
    <div className="mt-10 rounded-3xl border border-white/15 bg-white/[0.025] p-4 sm:p-7">
      <div className="mb-7 border-b border-white/10 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">
          Interactive portfolio reconstruction
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
          Based on the documented Swing application. Orders and calculations
          stay in this browser session; nothing is sent to a restaurant or
          payment system.
        </p>
      </div>
      <Tabs.Root value={view} onValueChange={setView}>
        <Tabs.List
          aria-label="Workbench perspective"
          className="grid gap-2 sm:grid-cols-2"
        >
          {[
            ["restaurant", Utensils, "Restaurant View"],
            ["engineering", Code2, "Engineering View"],
          ].map(([value, Icon, label]) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className={`${control} flex items-center justify-center gap-3 data-[state=active]:border-accent data-[state=active]:bg-accent/10 data-[state=active]:text-accent`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div className="my-5 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className={smallButton}
            onClick={(event) => request("example", event)}
          >
            Load report example · €25
          </Button>
          <Button
            type="button"
            variant="outline"
            className={smallButton}
            onClick={(event) => request("reset", event)}
          >
            Reset studio
          </Button>
        </div>
        <Tabs.Content
          value="restaurant"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr]">
            <div className="min-w-0">
              <h3 className="mb-4 text-lg">01 / Build the order</h3>
              <div
                className="grid grid-cols-2 gap-2"
                aria-label="Menu categories"
              >
                {categories.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={category === item.id}
                    className={`${control} ${category === item.id ? "border-accent bg-accent/10 text-accent" : ""}`}
                    onClick={() => {
                      setCategory(item.id);
                      setProduct(item.items[0][0]);
                    }}
                  >
                    {item.name}{" "}
                    <span className="text-white/45">/{item.items.length}</span>
                  </button>
                ))}
              </div>
              <form
                noValidate
                className="mt-5 space-y-4 rounded-2xl border border-white/10 p-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  dispatch({ type: "add", product, quantity });
                  if (!/^(?:[1-9]|1\d|20)$/.test(quantity))
                    quantityRef.current?.focus();
                }}
              >
                <div>
                  <label
                    htmlFor="restaurant-product"
                    className="mb-2 block text-xs text-white/65"
                  >
                    Documented menu item
                  </label>
                  <select
                    id="restaurant-product"
                    className={`${control} w-full`}
                    value={product}
                    onChange={(event) => setProduct(event.target.value)}
                  >
                    {menu
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} · {money(item.cents)}
                        </option>
                      ))}
                  </select>
                </div>
                <p className="text-xs text-white/50" lang="el">
                  Original label: {selectedItem.originalLabel}
                </p>
                <div>
                  <label
                    htmlFor="restaurant-quantity"
                    className="mb-2 block text-xs text-white/65"
                  >
                    Quantity
                  </label>
                  <Input
                    ref={quantityRef}
                    id="restaurant-quantity"
                    type="text"
                    inputMode="numeric"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    aria-describedby="restaurant-limits restaurant-error"
                    aria-invalid={Boolean(
                      state.error && state.error.startsWith("Quantity"),
                    )}
                    className="min-h-11 w-full"
                    maxLength={4}
                  />
                </div>
                <Button type="submit" className={`${smallButton} w-full`}>
                  Add item{" "}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
                <p
                  id="restaurant-limits"
                  className="text-xs leading-6 text-white/50"
                >
                  Reconstruction limits: quantity 1–20, up to 40 rows. Repeated
                  items append separate rows.
                </p>
              </form>
              <div className="mt-5">
                <label
                  htmlFor="restaurant-table"
                  className="mb-2 block text-xs text-white/65"
                >
                  02 / Assign this order to a table
                </label>
                <select
                  id="restaurant-table"
                  value={state.table ?? ""}
                  onChange={(event) =>
                    dispatch({ type: "table", table: event.target.value })
                  }
                  className={`${control} w-full`}
                >
                  <option value="" disabled>
                    Select a table
                  </option>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option value={n} key={n}>
                      Table {n}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs leading-6 text-white/50">
                  Tables 1–6 are a demo range. Changing table reassigns this
                  same order.
                </p>
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="mb-4 text-lg">03 / Review the result</h3>
              <OrderSlip order={state} />
              <Button
                type="button"
                variant="outline"
                className={`${smallButton} mt-4 w-full`}
                onClick={(event) => request("clear", event)}
              >
                Clear order
              </Button>
            </div>
          </div>
        </Tabs.Content>
        <Tabs.Content
          value="engineering"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
            <TraceInspector state={state} />
            <div>
              <p className="mb-4 text-xs text-white/60">
                Live order · not the selected history snapshot
              </p>
              <OrderSlip order={state} />
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
      <div
        id="restaurant-error"
        role="alert"
        className="mt-4 text-sm text-rose-200"
      >
        {state.error}
      </div>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="mt-3 min-h-12 text-sm leading-6 text-accent"
      >
        {state.notice}
      </p>
      <div className="mt-5 border-t border-white/10 pt-6">
        <h3 className="text-lg">04 / Inspect a local preview</h3>
        <p id="preview-help" className="my-3 text-xs leading-6 text-white/55">
          Add an item and select a table. Readiness also requires an item from
          that category. These are message previews, not delivery or kitchen
          status.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {previewButtons.map(([kind, label]) => (
            <Button
              key={kind}
              type="button"
              variant="outline"
              className={smallButton}
              disabled={Boolean(previewError(state, kind))}
              aria-describedby="preview-help"
              onClick={(event) => {
                opener.current = event.currentTarget;
                dispatch({ type: "preview", kind });
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      <Dialog.Root
        open={open}
        onOpenChange={(value) => {
          if (!value) close();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75" />
          <Dialog.Content
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              opener.current?.focus();
            }}
            className="fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[calc(100%_-_2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/20 bg-primary p-6 shadow-2xl"
          >
            <Dialog.Title className="pr-10 text-xl font-semibold">
              {confirmation
                ? "Replace the current order?"
                : state.preview?.kind === "receipt"
                  ? "Receipt preview"
                  : "Local message preview"}
            </Dialog.Title>
            <Dialog.Description className="mb-5 mt-3 text-sm leading-7 text-white/60">
              {confirmation
                ? "This replaces the active rows and table. Cancel keeps your current order."
                : "Portfolio reconstruction. Nothing is transmitted, acknowledged by a kitchen, or processed as a payment."}
            </Dialog.Description>
            <Dialog.Close
              aria-label="Close dialog"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
            {confirmation ? (
              <div className="flex flex-wrap gap-3">
                <Dialog.Close asChild>
                  <Button variant="outline" className={smallButton}>
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  className={smallButton}
                  onClick={() => execute(confirmation)}
                >
                  Confirm replacement
                </Button>
              </div>
            ) : state.preview ? (
              state.preview.kind === "receipt" ? (
                <OrderSlip order={state.preview} receipt />
              ) : (
                <div className="rounded-xl border border-amber-200/25 bg-amber-200/5 p-5">
                  <p className="text-xs uppercase text-amber-100">
                    Preview only · table {state.preview.table}
                  </p>
                  <p className="mt-3 text-sm leading-7">
                    {state.preview.kind === "order"
                      ? `${state.preview.rows.length} order rows prepared for table ${state.preview.table}. Total ${money(state.preview.total)}.`
                      : `${state.preview.kind[0].toUpperCase() + state.preview.kind.slice(1)} readiness message for table ${state.preview.table}.`}
                  </p>
                  <p className="mt-3 text-xs leading-6 text-white/55">
                    This text does not establish that food is ready or that
                    another person received a message.
                  </p>
                </div>
              )
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
