import { Hero } from '@/components/landing/hero';
import { FeatureGrid } from '@/components/landing/feature-grid';
import { SiteFooter } from '@/components/landing/site-footer';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <SiteFooter />
    </>
  );
}
