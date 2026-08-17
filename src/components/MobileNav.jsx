"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CiMenuFries } from "react-icons/ci";

const links = [
  {
    name: `home`,
    path: `/`,
  },
  {
    name: `projects`,
    path: `/projects`,
  },
  {
    name: `resume`,
    path: `/resume`,
  },
  {
    name: `work`,
    path: `/work`,
  },
  {
    name: `contact`,
    path: `/contact`,
  },
];

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        aria-label="Open navigation menu"
        className="flex justify-center items-center"
      >
        <CiMenuFries aria-hidden="true" className="text-[32px] text-accent" />
      </SheetTrigger>
      <SheetContent className="flex flex-col overflow-y-auto">
        <div className="mt-20 mb-12 text-center text-2xl">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <h1 className="text-4xl font-semibold">
              Jim<span className="text-accent">.</span>
            </h1>
          </Link>
        </div>
        <nav className="flex flex-col justify-center items-center gap-7">
          {links.map((link) => {
            const isActive =
              pathname === link.path ||
              (link.path !== "/" && pathname.startsWith(`${link.path}/`));

            return (
              <Link
                href={link.path}
                key={link.path}
                onClick={() => setIsOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`${isActive ? "text-accent border-b-2 border-accent" : ""} text-xl capitalize hover:text-accent transition-all`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="mt-10 border-t border-white/10 pt-8 text-center">
          <p className="text-sm font-medium text-white/60">
            Open to opportunities
          </p>
          <Button
            asChild
            className="mt-4 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <Link href="/contact" onClick={() => setIsOpen(false)}>
              Let&rsquo;s Talk
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
