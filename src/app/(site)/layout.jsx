import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import StairTransition from "@/components/StairTransition";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <StairTransition />
      <PageTransition>
        <div className="pb-14">{children}</div>
      </PageTransition>
    </>
  );
}
