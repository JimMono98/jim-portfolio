export const metadata = {
  title: "Sanity Studio",
  description: "Content management for the Portfolio",
};

export default function StudioLayout({ children }) {
  return <div style={{ height: "100vh" }}>{children}</div>;
}
