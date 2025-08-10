import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
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
  const { user } = useAuth();
  
  const stats = [
    { icon: TrendingUp, title: "Success Rate", value: "94%", description: "Cases resolved successfully" },
    { icon: Users, title: "Clients Served", value: "2,500+", description: "Satisfied customers worldwide" },
    { icon: Shield, title: "Funds Recovered", value: "$50M+", description: "Total amount recovered" },
    { icon: Clock, title: "Avg Resolution", value: "45 days", description: "Average case duration" }
  ];

  const processSteps = [
    {
      title: "Free Case Evaluation",
      description: "We analyze your situation at no cost and provide honest feedback about recovery prospects.",
      icon: FileSearch
    },
    {
      title: "Evidence Collection",
      description: "Our experts gather all necessary documentation and build a compelling case strategy.",
      icon: UserCheck
    },
    {
      title: "Active Recovery",
      description: "We engage with banks, platforms, and relevant parties to initiate the recovery process.",
      icon: Zap
    },
    {
      title: "Successful Resolution",
      description: "Track progress in real-time and receive your recovered funds through secure channels.",
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
    { icon: Shield, title: "Licensed & Regulated", description: "Fully compliant operations" },
    { icon: Award, title: "Industry Recognition", description: "Awards for excellence" },
    { icon: Lock, title: "Data Security", description: "Bank-level encryption" },
    { icon: Globe, title: "Global Reach", description: "Worldwide recovery network" }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Lixington Capital Recovery | Professional Fund Recovery Services</title>
        <meta name="description" content="Leading fund recovery specialists. 94% success rate recovering money from scams, chargebacks, and wire transfer recalls. Free consultation." />
        <link rel="canonical" href={window.location.origin + "/"} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="relative px-4 py-20 md:py-32">
          <div className="mx-auto max-w-6xl text-center text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm mb-8 animate-fade-in">
              <Star className="h-4 w-4 text-premium-gold" />
              <span>Trusted by 2,500+ clients worldwide</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-playfair mb-6 animate-slide-up">
              Recover Your Lost Funds
              <span className="block text-premium-gold">With Confidence</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: "200ms" }}>
              Professional money recovery specialists with a 94% success rate. We help recover funds from scams, chargebacks, and wire transfer errors.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "400ms" }}>
              {user ? (
                <Button asChild size="xl" variant="premium">
                  <Link to="/dashboard">Access Client Portal</Link>
                </Button>
              ) : (
                <Button asChild size="xl" variant="premium">
                  <Link to="/start">Get Free Consultation</Link>
                </Button>
              )}
              <Button asChild size="xl" variant="outline-premium">
                <Link to="/case-studies">View Success Stories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">Proven Track Record</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our results speak for themselves. Join thousands of satisfied clients who've recovered their funds.
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
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">Our Recovery Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive fund recovery solutions tailored to your specific situation.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card rounded-xl p-8 shadow-medium hover:shadow-large transition-all duration-500 border border-border/50 animate-fade-in">
              <div className="gradient-primary inline-flex p-3 rounded-lg mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Bank & Card Disputes</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Expert assistance with chargebacks, unauthorized transactions, and payment disputes backed by comprehensive evidence.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  Chargeback preparation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  Evidence documentation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  Bank communication
                </li>
              </ul>
            </div>
            
            <div className="bg-card rounded-xl p-8 shadow-medium hover:shadow-large transition-all duration-500 border border-border/50 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="gradient-success inline-flex p-3 rounded-lg mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Crypto Scam Recovery</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Advanced blockchain analysis and platform coordination to recover cryptocurrency from scammers and fraudulent schemes.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  Blockchain tracing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  Platform escalations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  Asset freezing
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-medium hover:shadow-large transition-all duration-500 border border-border/50 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="gradient-premium inline-flex p-3 rounded-lg mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Wire Transfer Recalls</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Rapid response services for misdirected wire transfers and fraudulent international money transfers.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  SWIFT network coordination
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  Bank-to-bank communication
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-green" />
                  Legal documentation
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
                step={index + 1}
                title={step.title}
                description={step.description}
                icon={step.icon}
                isLast={index === processSteps.length - 1}
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
              <Link to="/start">Get Free Consultation</Link>
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