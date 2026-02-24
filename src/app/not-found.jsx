import Link from "next/link";
import { Button } from "@/components/ui/button";
import StairTransition from "@/components/StairTransition";

export default function NotFound() {
  return (
    <>
      <StairTransition />
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto flex flex-col items-center justify-center text-center gap-6">
          <h1 className="text-[120px] font-bold leading-none text-accent">
            404
          </h1>
          <h2 className="text-3xl font-semibold">Page not found</h2>
          <p className="text-white/60 max-w-[400px]">
            The page you are looking for does not exist.
          </p>
          <Link href="/">
            <Button variant="outline" size="lg" className="uppercase">
              Go to Home
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
