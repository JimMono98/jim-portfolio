"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  ListOrdered,
  MessageSquareText,
  Monitor,
  ReceiptText,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CaseStudyNavigation from "@/components/case-studies/CaseStudyNavigation";
import {
  ExternalButton,
  Reveal,
  SectionHeading,
  TechPill,
} from "@/components/case-studies/CaseStudyPrimitives";
import RestaurantOrderWorkbench from "./RestaurantOrderWorkbench";
import { reportUrl } from "./restaurantEvidence.mjs";

const assets = "/assets/projects/restaurant-information-system";
const section = "py-16 sm:py-20 lg:py-24";
const card =
  "rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8";
const text = "text-sm leading-7 text-white/60 sm:text-base sm:leading-8";

function EvidenceImage({
  name,
  alt,
  caption,
  width = 675,
  height = 1215,
  priority = false,
  className = "",
}) {
  return (
    <figure className={`min-w-0 ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-2 sm:p-3">
        <Image
          src={`${assets}/${name}.webp`}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes={
            width < 500
              ? "(max-width: 640px) 90vw, 409px"
              : "(max-width: 640px) 85vw, (max-width: 960px) 40vw, 420px"
          }
          className="mx-auto h-auto max-w-full rounded-lg"
        />
      </div>
      <figcaption className="mt-4 text-xs leading-6 text-white/45">
        <span className="text-accent/80">Original coursework · </span>
        {caption}
      </figcaption>
    </figure>
  );
}

export default function RestaurantCaseStudy({ previousProject, nextProject }) {
  const reduceMotion = useReducedMotion();
  return (
    <main className="overflow-x-clip">
      <section className="relative pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-0 -z-10 h-[700px] w-full bg-[radial-gradient(ellipse_at_30%_40%,rgba(0,255,153,0.08),transparent_65%)]"
        />
        <div className="container mx-auto grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Case Study · Desktop Application
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl xl:text-6xl">
              Restaurant
              <br />
              <span className="text-accent">Information</span>
              <br />
              System
            </h1>
            <p className="mt-6 text-sm text-white/80 sm:text-lg">
              Desktop Application / Order Entry &amp; Service Coordination
            </p>
            <p className={`mt-6 max-w-xl ${text}`}>
              From a menu selection to a readable order. A Java Swing coursework
              project exploring how quantities, tables, totals, and local
              dialogs come together in one desktop interface.
            </p>
            <ul
              className="mt-7 flex flex-wrap gap-2"
              aria-label="Verified technologies"
            >
              {["Java", "Swing", "NetBeans"].map((label) => (
                <TechPill key={label} reduceMotion={reduceMotion}>
                  {label}
                </TechPill>
              ))}
            </ul>
            <div className="mt-9 flex flex-col items-start gap-3">
              <Button
                asChild
                size="lg"
                className="w-full whitespace-normal px-4 text-center text-xs tracking-widest focus-visible:ring-2 focus-visible:ring-white sm:w-auto sm:px-8 sm:text-sm"
              >
                <Link href="#order-workbench">
                  Explore the Order Workbench{" "}
                  <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <ExternalButton
                href={reportUrl}
                variant="outline"
                icon={BookOpen}
              >
                View Original Report
              </ExternalButton>
            </div>
          </Reveal>
          <Reveal
            delay={0.12}
            className="relative mx-auto w-full max-w-[370px]"
          >
            <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-widest text-white/45">
              <span>Preserved Swing interface</span>
              <span>2023</span>
            </div>
            <EvidenceImage
              name="order-summary"
              alt="Original Swing order summary showing Gyros, Potatoes, Diavasi salad and Wine, table 3 and a total of 25 euros"
              caption="Order summary · report p.6"
              priority
            />
            <div className="absolute -left-3 top-[37%] rounded-xl border border-accent/25 bg-primary/95 px-4 py-3 shadow-xl sm:-left-7">
              <p className="text-[10px] uppercase tracking-widest text-white/50">
                Four rows. One table.
              </p>
              <p className="mt-1 text-xl font-semibold text-accent">€25.00</p>
              <p className="mt-1 text-[10px] text-white/50">
                Documented example
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={`${section} border-t border-white/10`}>
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Project context"
            title="A desktop workflow, built around the person taking the order."
            description="A 2023 Human–Computer Interaction assignment, preserved in a 17-page Greek report titled ‘Πληροφοριακό σύστημα εστιατορίου’. The intended users are restaurant staff; the evidence is a desktop UI and selected implementation excerpts."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Context", "Human–Computer Interaction"],
              ["Interface", "Java Swing · NetBeans"],
              ["Menu", "22 items · four categories"],
              ["Preserved material", "Report, screens & code excerpts"],
            ].map(([label, value]) => (
              <Reveal key={label} className={card}>
                <p className="text-xs text-white/45">{label}</p>
                <p className="mt-4 text-sm leading-7">{value}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Reveal className={card}>
              <p className="text-xs uppercase tracking-widest text-accent">
                Original coursework
              </p>
              <p className={`mt-4 ${text}`}>
                The cover is dated November 2023; some screenshots show
                December. This page uses “2023 coursework”, not an inferred
                release date. The full catalogue title is “Design and
                Implementation of a Restaurant Information System Using Java
                Swing and NetBeans IDE”.
              </p>
            </Reveal>
            <Reveal className={card}>
              <p className="text-xs uppercase tracking-widest text-amber-100">
                Portfolio reconstruction
              </p>
              <p className={`mt-4 ${text}`}>
                The workbench below is new browser code, built from documented
                behavior. No complete Java project or executable was recovered.
                It does not reproduce a backend, database, payment system, or
                multi-device restaurant deployment.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={section}>
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="From selection to summary"
            title="Three screens. A legible order-taking path."
            description="The main menu leads to a tabbed order form. Category selectors and quantity spinners feed a table of product, quantity, and unit price; a summary brings the table number and total together."
          />
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              [
                "main-menu",
                "01 / Choose a task",
                "Original Swing main menu with New Order, Readiness, Exit, Help and About controls",
                "Main menu · report p.4",
              ],
              [
                "order-form",
                "02 / Select & quantify",
                "Original Swing form with mains, appetizers, salads, drinks, quantity spinners and table selection",
                "Order form · report p.5",
              ],
              [
                "order-summary",
                "03 / Review the order",
                "Original summary table with four line items and the 25 euro total",
                "Summary · report p.6",
              ],
            ].map(([name, title, alt, caption], index) => (
              <Reveal key={name} delay={index * 0.06}>
                <h3 className="mb-5 text-sm text-white/75">{title}</h3>
                <EvidenceImage name={name} alt={alt} caption={caption} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="order-workbench"
        className={`${section} scroll-mt-24 border-y border-white/10 bg-black/10`}
      >
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Interactive order workbench"
            title="Make an order. See exactly what changes."
            description="Explore the documented menu, load the report’s €25 example, or switch to Engineering View to inspect the real state transition behind an action. One order, two perspectives."
          />
          <RestaurantOrderWorkbench />
        </div>
      </section>

      <section className={section}>
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Trace an order"
            title="An event becomes a row. A row becomes a total."
            description="The report’s implementation path is concrete: read a selection and quantity, construct a row, append it to the table model, and update the visible total. It is not evidence of a separate service layer."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                Utensils,
                "Selection",
                "Arrays / selectors",
                "Names and integer prices share category indexes. Spinners supply quantities.",
              ],
              [
                Code2,
                "Action",
                "ActionPerformed",
                "A button handler builds [product, quantity, unit price].",
              ],
              [
                ListOrdered,
                "Data",
                "DefaultTableModel",
                "addRow appends the selection. Repeating an item creates another row.",
              ],
              [
                ReceiptText,
                "Output",
                "JTable / JLabel",
                "The row is rendered and the total label is updated.",
              ],
            ].map(([Icon, title, code, copy]) => (
              <Reveal key={title} className={card}>
                <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                <h3 className="mt-5 text-lg">{title}</h3>
                <p className="mt-3 break-words text-xs text-amber-100">
                  {code}
                </p>
                <p className="mt-4 text-sm leading-7 text-white/60">{copy}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <EvidenceImage
                name="add-row-code"
                width={1154}
                height={256}
                alt="Original Java ActionPerformed excerpt constructing a row, calling DefaultTableModel.addRow and updating the total label"
                caption="Handler excerpt · report p.11; the preserved capture clips the right end of one line"
              />
            </Reveal>
            <Reveal className={card}>
              <h3 className="text-lg">
                Same behavior. Explicit new safeguards.
              </h3>
              <p className={`mt-4 ${text}`}>
                The original updates an accumulator alongside table rows. The
                reconstruction derives every total from the current rows using
                integer cents, adds bounded input validation, and records
                inspectable snapshots. These are portfolio engineering choices,
                not recovered original features.
              </p>
              <a
                href="https://docs.oracle.com/javase/tutorial/uiswing/components/table.html"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded text-xs text-accent underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-accent"
              >
                Oracle: JTable and table models{" "}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={`${section} border-t border-white/10`}>
        <div className="container mx-auto grid items-center gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal className="mx-auto w-full max-w-[300px]">
            <EvidenceImage
              name="readiness-panel"
              alt="Original Swing readiness panel with table selector and appetizer, salad and mains message buttons"
              caption="Readiness controls · report p.8"
            />
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Service communication"
              title="A message on screen is not proof of delivery."
              description="The report describes service coordination and shows dialogs for order submission and category readiness. The surviving excerpts establish JDialog/JTextArea outputs—not a transport mechanism, receiver process, or acknowledgement."
            />
            <Reveal className="mt-7 rounded-2xl border border-amber-200/20 bg-amber-200/[0.04] p-6">
              <MessageSquareText
                className="h-6 w-6 text-amber-100"
                aria-hidden="true"
              />
              <p className={`mt-4 ${text}`}>
                The workbench therefore previews messages locally. It never
                marks food as actually ready or an order as delivered to a
                kitchen.
              </p>
            </Reveal>
            <Reveal className="mt-7 max-w-[433px]">
              <EvidenceImage
                name="receipt-items"
                width={409}
                height={167}
                alt="Original receipt excerpt containing four items, total 25 euros and table 3, with business identifiers excluded"
                caption="Receipt line items · report p.7; identifying fields excluded"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className={section}>
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Interface decisions"
            title="Small controls carry the workflow."
            description="The report discusses usability through its interface choices. No participant protocol, timing study, error-rate dataset, or validated productivity result is available, so these remain design intentions."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              [
                "Group related choices",
                "Four category regions separate the menu into recognizable tasks. The original also uses product image previews; the reconstruction keeps a text-first catalogue.",
              ],
              [
                "Keep quantities explicit",
                "Spinners make quantity an input rather than an implied repeated click. The portfolio adds its own visible 1–20 validation boundary.",
              ],
              [
                "Bring the order together",
                "A summary exposes quantities, unit prices, table number, and total. The reconstruction adds derived line totals and an inspectable state trace.",
              ],
              [
                "Make navigation and reset visible",
                "Main, Help, About, and Clear support the original desktop flow. Confirmation before replacement is an additional portfolio safeguard.",
              ],
            ].map(([title, copy], i) => (
              <Reveal key={title} className={card}>
                <p className="text-xs text-accent">0{i + 1}</p>
                <h3 className="mt-4 text-xl">{title}</h3>
                <p className={`mt-4 ${text}`}>{copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`${section} border-t border-white/10`}>
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Engineering review"
            title="Useful fundamentals. Visible trade-offs."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              [
                "Index coupling",
                "Parallel arrays are compact, but names and prices must remain aligned. The portfolio uses explicit product records while preserving the documented values.",
              ],
              [
                "Event-driven UI",
                "Handlers directly update Swing widgets and table state in the available excerpts. That is the evidenced path; a broader MVC or service architecture cannot be inferred.",
              ],
              [
                "Evidence, not a production POS",
                "JavaFX is mentioned in the prose but not established by implementation evidence. Database integration, roles, inventory, payments, printing, and multi-device synchronization are not demonstrated.",
              ],
            ].map(([title, copy]) => (
              <Reveal key={title} className={card}>
                <Monitor className="h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="mt-5 text-lg">{title}</h3>
                <p className={`mt-4 ${text}`}>{copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent py-20 text-primary sm:py-24 lg:py-28">
        <div className="container mx-auto">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-primary/60">
              Original report
            </p>
            <h2 className="mt-5 text-3xl font-semibold sm:text-4xl lg:text-5xl">
              Explore the desktop project behind the workbench.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-primary/70">
              The preserved 17-page report remains the original evidence. The
              interactive workbench is a separately labelled browser
              reconstruction.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 w-full bg-primary text-white hover:bg-[#2a2a31] focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
            >
              <Link href={reportUrl} target="_blank" rel="noopener noreferrer">
                View Original Report{" "}
                <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <div className="mt-5">
              <Link
                href="#order-workbench"
                className="inline-flex min-h-11 items-center gap-2 rounded text-sm underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-primary"
              >
                Return to the workbench{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <CaseStudyNavigation
        previousProject={previousProject}
        nextProject={nextProject}
        showNextPlaceholder={!nextProject}
      />
    </main>
  );
}
