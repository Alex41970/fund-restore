import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/useTranslation";
import { StatCard } from "@/components/StatCard";
import { ProcessStep } from "@/components/ProcessStep";
import { TestimonialCard } from "@/components/TestimonialCard";
import { TrustBadge } from "@/components/TrustBadge";
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Clock, 
  FileSearch, 
  UserCheck, 
  Zap, 
  CheckCircle,
  Star,
  Award,
  Lock,
  Globe
} from "lucide-react";

const Index = () => {
  const { user, isAdmin, loading } = useAuth();
  const { t } = useTranslation();
  
  // Redirect authenticated users to their appropriate dashboard
  if (!loading && user) {
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }
  
  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }
  
  const stats = [
    { icon: TrendingUp, title: t('home.stats.successRate.title'), value: t('home.stats.successRate.value'), description: t('home.stats.successRate.description') },
    { icon: Users, title: t('home.stats.clientsServed.title'), value: t('home.stats.clientsServed.value'), description: t('home.stats.clientsServed.description') },
    { icon: Shield, title: t('home.stats.fundsRecovered.title'), value: t('home.stats.fundsRecovered.value'), description: t('home.stats.fundsRecovered.description') },
    { icon: Clock, title: t('home.stats.avgResolution.title'), value: t('home.stats.avgResolution.value'), description: t('home.stats.avgResolution.description') }
  ];

  const processSteps = [
    {
      title: t('home.process.steps.evaluation.title'),
      description: t('home.process.steps.evaluation.description'),
      icon: FileSearch
    },
    {
      title: t('home.process.steps.evidence.title'),
      description: t('home.process.steps.evidence.description'),
      icon: UserCheck
    },
    {
      title: t('home.process.steps.recovery.title'),
      description: t('home.process.steps.recovery.description'),
      icon: Zap
    },
    {
      title: t('home.process.steps.resolution.title'),
      description: t('home.process.steps.resolution.description'),
      icon: CheckCircle
    }
  ];

  const testimonials = [
    {
      quote: "Lixington Capital Recovery helped me recover $25,000 from a crypto scam. Their professionalism and expertise exceeded my expectations.",
      author: "Sarah Johnson",
      title: "Business Owner",
      recoveredAmount: "$25,000",
      rating: 5
    },
    {
      quote: "After banks refused my chargeback, Lixington stepped in and got my money back within 30 days. Incredible service!",
      author: "Michael Chen",
      title: "Software Engineer", 
      recoveredAmount: "$12,500",
      rating: 5
    }
  ];

  const trustBadges = [
    { icon: Shield, title: t('home.trust.licensed.title'), description: t('home.trust.licensed.description') },
    { icon: Award, title: t('home.trust.recognition.title'), description: t('home.trust.recognition.description') },
    { icon: Lock, title: t('home.trust.security.title'), description: t('home.trust.security.description') },
    { icon: Globe, title: t('home.trust.global.title'), description: t('home.trust.global.description') }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>{t('nav.header.companyName')} | Professional Fund Recovery Services</title>
        <meta name="description" content={t('home.hero.description')} />
        <link rel="canonical" href={window.location.origin + "/"} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="relative px-4 py-20 md:py-32">
          <div className="mx-auto max-w-6xl text-center text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm mb-8 animate-fade-in">
              <Star className="h-4 w-4 text-premium-gold" />
              <span>{t('home.hero.badge')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-playfair mb-6 animate-slide-up">
              {t('home.hero.title')}
              <span className="block text-premium-gold">{t('home.hero.subtitle')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: "200ms" }}>
              {t('home.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "400ms" }}>
              <Button asChild size="xl" variant="premium">
                <Link to="/auth">{t('home.hero.cta')}</Link>
              </Button>
              <Button asChild size="xl" variant="outline-premium">
                <Link to="/case-studies">{t('home.hero.ctaSecondary')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">{t('home.stats.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.stats.description')}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.title}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                delay={index * 150}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">{t('home.services.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.services.description')}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card rounded-xl p-8 shadow-medium hover:shadow-large transition-all duration-500 border border-border/50 animate-fade-in">
              <div className="gradient-primary inline-flex p-3 rounded-lg mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t('home.services.bankDisputes.title')}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('home.services.bankDisputes.description')}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  {t('home.services.bankDisputes.features.chargeback')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  {t('home.services.bankDisputes.features.evidence')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  {t('home.services.bankDisputes.features.bankComm')}
                </li>
              </ul>
            </div>
            
            <div className="bg-card rounded-xl p-8 shadow-medium hover:shadow-large transition-all duration-500 border border-border/50 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="gradient-success inline-flex p-3 rounded-lg mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t('home.services.cryptoRecovery.title')}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('home.services.cryptoRecovery.description')}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  {t('home.services.cryptoRecovery.features.tracing')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  {t('home.services.cryptoRecovery.features.escalations')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  {t('home.services.cryptoRecovery.features.freezing')}
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-medium hover:shadow-large transition-all duration-500 border border-border/50 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="gradient-premium inline-flex p-3 rounded-lg mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t('home.services.wireRecalls.title')}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('home.services.wireRecalls.description')}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  {t('home.services.wireRecalls.features.swift')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  {t('home.services.wireRecalls.features.bankToBank')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  {t('home.services.wireRecalls.features.legal')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="px-4 py-20 bg-background">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">Our Recovery Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A proven 4-step methodology that maximizes your chances of successful fund recovery.
            </p>
          </div>
          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <ProcessStep
                key={step.title}
                stepNumber={index + 1}
                title={step.title}
                description={step.description}
                details={[step.description]}
                icon={step.icon}
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">Client Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real recoveries, real results. See what our clients say about their experience.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.author}
                quote={testimonial.quote}
                author={testimonial.author}
                title={testimonial.title}
                recoveredAmount={testimonial.recoveredAmount}
                rating={testimonial.rating}
                delay={index * 200}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="trust" size="lg">
              <Link to="/case-studies">View All Success Stories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-4 py-20 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">Why Trust Lixington Capital Recovery</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Industry-leading credentials and security standards protect your interests.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {trustBadges.map((badge, index) => (
              <TrustBadge
                key={badge.title}
                icon={badge.icon}
                title={badge.title}
                description={badge.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-trust-blue to-trust-blue-light">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">
            Ready to Recover Your Funds?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Start with a free consultation. No upfront fees, no hidden costs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="xl" variant="premium">
              <Link to="/auth">Get Free Consultation</Link>
            </Button>
            <Button asChild size="xl" variant="outline-premium">
              <Link to="/contact">Speak with an Expert</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;