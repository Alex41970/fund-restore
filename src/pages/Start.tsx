import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrustBadge } from "@/components/TrustBadge";
import { Shield, Clock, Award, CheckCircle, AlertTriangle, CreditCard, Coins, Building, Users } from "lucide-react";

const Start = () => {
  const caseTypes = [
    {
      icon: CreditCard,
      title: "Credit Card Fraud",
      description: "Unauthorized charges, fake merchants, identity theft",
      urgency: "High",
      timeFrame: "1-3 days for best results"
    },
    {
      icon: Coins,
      title: "Cryptocurrency Scams", 
      description: "Investment scams, fake exchanges, romance scams",
      urgency: "Critical",
      timeFrame: "Immediate action required"
    },
    {
      icon: Building,
      title: "Wire Transfer Fraud",
      description: "Business email compromise, fake invoices, romance scams",
      urgency: "Critical", 
      timeFrame: "Hours matter for recovery"
    },
    {
      icon: Users,
      title: "Investment Fraud",
      description: "Ponzi schemes, fake brokers, unregulated platforms",
      urgency: "Medium",
      timeFrame: "2-4 weeks typical"
    }
  ];

  const trustFactors = [
    {
      icon: Shield,
      title: "100% Confidential",
      description: "Bank-level security for your case"
    },
    {
      icon: Clock,
      title: "24-Hour Response",
      description: "We review cases within one business day"
    },
    {
      icon: Award,
      title: "94% Success Rate",
      description: "Industry-leading recovery success"
    },
    {
      icon: CheckCircle,
      title: "No Upfront Fees",
      description: "Only pay when we recover your funds"
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Free Case Evaluation | Lixington Capital Recovery</title>
        <meta name="description" content="Start your free case evaluation today. 94% success rate, no upfront fees. Get expert help recovering your lost funds." />
        <link rel="canonical" href={window.location.origin + "/start"} />
      </Helmet>

      {/* Hero Section */}
      <section className="gradient-background text-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-6">
            Start Your Free Case Evaluation
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Get expert assessment of your case within 24 hours. No upfront fees, no hidden costs.
          </p>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold">$50M+</div>
              <div className="text-sm opacity-80">Recovered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">94%</div>
              <div className="text-sm opacity-80">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24h</div>
              <div className="text-sm opacity-80">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Types Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-playfair text-foreground mb-4">
              What Type of Case Do You Have?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Different fraud types require different approaches. Time is critical for many cases.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {caseTypes.map((caseType, index) => (
              <Card key={index} className="p-6 hover:shadow-large transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${caseType.urgency === 'Critical' ? 'bg-destructive/10' : caseType.urgency === 'High' ? 'bg-yellow-500/10' : 'bg-primary/10'}`}>
                    <caseType.icon className={`h-6 w-6 ${caseType.urgency === 'Critical' ? 'text-destructive' : caseType.urgency === 'High' ? 'text-yellow-500' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{caseType.title}</h3>
                      <Badge variant={caseType.urgency === 'Critical' ? 'destructive' : caseType.urgency === 'High' ? 'secondary' : 'default'} className="text-xs">
                        {caseType.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{caseType.description}</p>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs text-muted-foreground">{caseType.timeFrame}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="shadow-elegant">
                <Link to="/auth">Start Secure Evaluation</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Speak to Expert Now</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Emergency cases: Call immediately for fastest response
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-card/30">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-playfair text-foreground mb-4">
              Why Start With Us?
            </h2>
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

      {/* Process Preview */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-playfair text-foreground mb-4">
              What Happens Next?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">1</div>
              <h3 className="font-semibold text-foreground mb-2">Submit Details</h3>
              <p className="text-sm text-muted-foreground">Securely share your case information through our encrypted form</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">2</div>
              <h3 className="font-semibold text-foreground mb-2">Expert Review</h3>
              <p className="text-sm text-muted-foreground">Our specialists analyze your case and develop a recovery strategy</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">3</div>
              <h3 className="font-semibold text-foreground mb-2">Action Plan</h3>
              <p className="text-sm text-muted-foreground">Receive detailed assessment and next steps within 24 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 gradient-background text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold font-playfair mb-4">
            Don't Wait - Start Your Recovery Today
          </h2>
          <p className="text-xl opacity-90 mb-8">
            The sooner you act, the better your chances of full recovery.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elegant">
            <Link to="/auth">Begin Free Evaluation</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Start;