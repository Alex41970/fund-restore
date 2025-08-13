import { Helmet } from "react-helmet-async";
import { useTranslation } from '@/hooks/useTranslation';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>{t('contact.title')}</title>
        <meta name="description" content={t('contact.description')} />
        <link rel="canonical" href={window.location.origin + "/contact"} />
      </Helmet>
      <div className="mx-auto max-w-3xl px-4 py-12 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">{t('contact.hero.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('contact.hero.subtitle')}</p>
        </div>
      </div>
    </main>
  );
};

export default Contact;