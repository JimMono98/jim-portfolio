"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Reveal({ children, className = "", delay = 0, amount = 0.18 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduceMotion ? 0.2 : 0.5, delay, ease: "easeOut" }}
      className={`motion-reduce:!transform-none ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  headingId,
}) {
  return (
    <Reveal className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-accent sm:text-sm">
        {eyebrow}
      </p>
      <h2
        id={headingId}
        className="text-3xl font-semibold leading-tight text-white sm:text-4xl xl:text-5xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

export function TechPill({ children, reduceMotion }) {
  return (
    <motion.li
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/75 backdrop-blur-sm motion-reduce:!transform-none sm:text-sm"
    >
      {children}
    </motion.li>
  );
}

export function ExternalButton({
  href,
  children,
  variant = "default",
  icon: Icon,
}) {
  return (
    <Button
      asChild
      size="lg"
      variant={variant}
      className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:w-auto"
    >
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {Icon ? <Icon className="mr-2 h-4 w-4" aria-hidden="true" /> : null}
        {children}
        <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
      </Link>
    </Button>
  );
}
