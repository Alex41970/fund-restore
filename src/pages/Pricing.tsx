import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/hooks/useTranslation';

const Pricing = () => {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>{t('pricing.title')}</title>
        <meta name="description" content={t('pricing.description')} />
        <link rel="canonical" href={window.location.origin + "/pricing"} />
      </Helmet>
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">{t('pricing.hero.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('pricing.hero.subtitle')}</p>
        </div>
        <section className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-md p-6">
            <h2 className="font-semibold">Free Evaluation</h2>
            <p className="text-sm text-muted-foreground mt-2">We'll review your situation and advise next steps.</p>
            <div className="mt-4"><Button asChild><Link to="/start">Start Now</Link></Button></div>
          </div>
          <div className="border rounded-md p-6">
            <h2 className="font-semibold">Case Review Fee</h2>
            <p className="text-sm text-muted-foreground mt-2">Deeper analysis and evidence planning. Stripe checkout coming next.</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Pricing;