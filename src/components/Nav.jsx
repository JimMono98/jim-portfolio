"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "home",
    path: "/",
  },
  {
    name: "projects",
    path: "/projects",
  },
  {
    name: "resume",
    path: "/resume",
  },
  {
    name: "work",
    path: "/work",
  },
  {
    name: "contact",
    path: "/contact",
  },
];

const Nav = () => {
  const pathname = usePathname();
  return (
    <nav className="flex gap-8">
      {links.map((link) => {
        const isActive =
          pathname === link.path ||
          (link.path !== "/" && pathname.startsWith(`${link.path}/`));

        return (
          <Link
            href={link.path}
            key={link.path}
            aria-current={isActive ? "page" : undefined}
            className={`${isActive ? "text-accent border-b-2 border-accent" : ""} capitalize font-medium hover:text-accent transition-all`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default Nav;
