import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Shield, 
  Award, 
  Users, 
  Globe,
  CheckCircle,
  Star
} from "lucide-react";

const About = () => {
  const { t, translations } = useTranslation();
  const teamMembers = translations?.about?.team?.members || [];
  const achievements = translations?.about?.achievements || [];
  const values = translations?.about?.values?.items || [];

  const achievementIcons = [Users, Shield, Award, Globe];
  const valueIcons = [Shield, CheckCircle, Star];

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>{t('about.title')}</title>
        <meta name="description" content={t('about.description')} />
        <link rel="canonical" href={window.location.origin + "/about"} />
      </Helmet>

      {/* Hero Section */}
      <section className="px-4 py-20 gradient-hero">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6">
            {t('about.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-20 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">{t('about.mission.title')}</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t('about.mission.description')}
              </p>
              <Button asChild variant="trust" size="lg">
                <Link to="/start">{t('about.mission.cta')}</Link>
              </Button>
            </div>
            <div className="grid gap-6">
              {achievements.map((achievement, index) => {
                const Icon = achievementIcons[index] || Users;
                return (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-card rounded-lg border border-border/50 shadow-soft">
                    <div className="gradient-primary p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">{t('about.team.title')}</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-medium hover:shadow-large transition-all duration-500 border border-border/50 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-trust-blue font-semibold mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-2">{member.experience}</p>
                <p className="text-xs text-muted-foreground italic">{member.credentials}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-20 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">{t('about.values.title')}</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => {
              const Icon = valueIcons[index] || Shield;
              const gradientClass = index === 0 ? "gradient-primary" : index === 1 ? "gradient-success" : "gradient-premium";
              return (
                <div key={index} className="bg-card rounded-xl p-8 shadow-medium border border-border/50">
                  <div className={`${gradientClass} inline-flex p-3 rounded-lg mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-trust-blue to-trust-blue-light">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {t('about.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="xl" variant="premium">
              <Link to="/start">{t('about.cta.primaryButton')}</Link>
            </Button>
            <Button asChild size="xl" variant="outline-premium">
              <Link to="/contact">{t('about.cta.secondaryButton')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;