import { Helmet } from "react-helmet-async";
import { useTranslation } from '@/hooks/useTranslation';

const Services = () => {
  const { t, translations } = useTranslation();
  const services = translations?.services?.items || [];

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>{t('services.title')}</title>
        <meta name="description" content={t('services.description')} />
        <link rel="canonical" href={window.location.origin + "/services"} />
      </Helmet>
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">{t('services.hero.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('services.hero.subtitle')}</p>
        </div>
        <section className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <div key={index} className="border rounded-md p-6">
              <h2 className="font-semibold">{service.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
};

export default Services;
