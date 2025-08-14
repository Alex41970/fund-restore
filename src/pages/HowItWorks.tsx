import { Helmet } from "react-helmet-async";
import { ProcessStep } from "@/components/ProcessStep";
import { TrustBadge } from "@/components/TrustBadge";
import { Shield, Clock, Users, CheckCircle, FileText, Search, Phone, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const processSteps = [
    {
      icon: FileText,
      title: "Free Case Evaluation",
      description: "Submit your case details through our secure form. Our experts review your situation within 24 hours and provide an honest assessment of recovery prospects.",
      details: ["No upfront fees", "24-hour response time", "Confidential assessment", "Expert analysis"]
    },
    {
      icon: Search,
      title: "Evidence Collection & Strategy",
      description: "We gather all necessary documentation, transaction records, and evidence. Our team develops a customized recovery strategy based on your specific case type.",
      details: ["Document analysis", "Transaction tracing", "Legal research", "Strategy development"]
    },
    {
      icon: Phone,
      title: "Engagement & Negotiation",
      description: "Our specialists contact banks, platforms, exchanges, and other parties. We leverage our relationships and expertise to maximize recovery chances.",
      details: ["Professional representation", "Multi-channel approach", "Regulatory pressure", "Negotiation expertise"]
    },
    {
      icon: DollarSign,
      title: "Recovery & Resolution",
      description: "We pursue all available options including chargebacks, recalls, freezing orders, and legal action. You receive regular updates throughout the process.",
      details: ["Multiple recovery methods", "Regular updates", "Transparent process", "No recovery, no fee"]
    }
  ];

  const trustFactors = [
    {
      icon: Shield,
      title: "100% Confidential",
      description: "Your case details are protected with bank-level security"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our team is available around the clock for urgent cases"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Former banking and law enforcement professionals"
    },
    {
      icon: CheckCircle,
      title: "94% Success Rate",
      description: "Industry-leading recovery success across all case types"
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>How It Works | Lexington Capital Recovery</title>
        <meta name="description" content="Learn our proven 4-step fund recovery process with 94% success rate. From free evaluation to full recovery." />
        <link rel="canonical" href={window.location.origin + "/how-it-works"} />
      </Helmet>

      {/* Hero Section */}
      <section className="gradient-background text-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-6">
            Our Proven Recovery Process
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            From initial assessment to successful recovery, we guide you through every step with transparency and expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/start">Start Free Evaluation</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/case-studies">View Success Stories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-playfair text-foreground mb-4">
              How We Recover Your Funds
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our systematic approach combines industry expertise, regulatory knowledge, and proven recovery techniques.
            </p>
          </div>
          
          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <ProcessStep
                key={index}
                {...step}
                stepNumber={index + 1}
                isEven={index % 2 === 1}
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Factors */}
      <section className="py-16 bg-card/30">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-playfair text-foreground mb-4">
              Why Choose Our Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our process is designed with your success and security in mind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFactors.map((factor, index) => (
              <TrustBadge
                key={index}
                icon={factor.icon}
                title={factor.title}
                description={factor.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-playfair text-foreground mb-4">
              Recovery Timeline
            </h2>
            <p className="text-muted-foreground">
              Typical timelines for different recovery methods
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border/50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">1-3 Days</div>
              <div className="font-semibold text-foreground mb-2">Emergency Response</div>
              <p className="text-sm text-muted-foreground">
                Immediate action for fresh fraud cases to freeze accounts and halt transfers
              </p>
            </div>
            
            <div className="bg-card border border-border/50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">2-8 Weeks</div>
              <div className="font-semibold text-foreground mb-2">Standard Recovery</div>
              <p className="text-sm text-muted-foreground">
                Chargebacks, wire recalls, and platform disputes typically resolve within this timeframe
              </p>
            </div>
            
            <div className="bg-card border border-border/50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">3-6 Months</div>
              <div className="font-semibold text-foreground mb-2">Complex Cases</div>
              <p className="text-sm text-muted-foreground">
                Multi-jurisdictional cases or those requiring legal action may take longer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-background text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold font-playfair mb-4">
            Ready to Start Your Recovery?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Get your free case evaluation today. No upfront fees, no hidden costs.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link to="/start">Get Free Evaluation</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default HowItWorks;
