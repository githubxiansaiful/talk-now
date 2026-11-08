import { SiteHeader } from '@/components/common/site-header';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[#7657E8]/20 selection:text-[#7657E8]">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
