import { getSession } from "@/lib/auth";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

// Shared shell for all public marketing pages: consistent nav + footer,
// white base. The nav adapts to whether the visitor is signed in.
export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <SiteNav authed={!!session} />
      {children}
      <SiteFooter />
    </div>
  );
}
