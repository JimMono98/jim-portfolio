import { Button } from "./ui/button";
import Nav from "./Nav";
import MobileNav from "./MobileNav";
import Link from "next/link";

const Header = () => {
  return (
    <header className="py-8 xl:py-12 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-4xl font-semibold">
            Jim<span className="text-accent">.</span>
          </h1>
        </Link>
        <div className="hidden xl:flex items-center gap-8">
          <Nav />
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <p className="text-sm font-medium text-white/60">
              Open to opportunities
            </p>
            <Button
              asChild
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              <Link href="/contact">Let&rsquo;s Talk</Link>
            </Button>
          </div>
        </div>
        <div className="xl:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
