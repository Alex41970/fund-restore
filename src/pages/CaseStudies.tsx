import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "@/components/TestimonialCard";
import { 
  Shield, 
  TrendingUp, 
  Globe,
  DollarSign,
  Clock,
  CheckCircle
} from "lucide-react";

const CaseStudies = () => {
  const successStories = [
    {
      title: "Crypto Investment Scam Recovery",
      category: "Cryptocurrency",
      amount: "$125,000",
      duration: "42 days",
      description: "Client fell victim to a fake crypto investment platform. Through blockchain analysis and platform coordination, we successfully traced and recovered the majority of funds.",
      testimonial: {
        quote: "I thought my money was gone forever. Lexington's team worked tirelessly and recovered $125,000 from what seemed like an impossible situation.",
        author: "Robert Martinez",
        title: "Tech Entrepreneur",
        recoveredAmount: "$125,000",
        rating: 5
      },
      challenges: ["Complex blockchain routing", "International jurisdiction", "Platform cooperation"],
      solutions: ["Advanced blockchain forensics", "Legal pressure on exchange", "Multi-agency coordination"]
    },
    {
      title: "Wire Transfer Fraud Recovery",
      category: "Wire Transfer",
      amount: "$85,000",
      duration: "28 days",
      description: "Business owner's wire transfer was intercepted by fraudsters. Our rapid response team coordinated with international banks to freeze and recover funds.",
      testimonial: {
        quote: "The speed and professionalism of Lexington's response was incredible. They recovered our entire wire transfer in less than a month.",
        author: "Lisa Thompson",
        title: "Business Owner",
        recoveredAmount: "$85,000",
        rating: 5
      },
      challenges: ["Time-sensitive situation", "Cross-border banking", "Fraudster sophistication"],
      solutions: ["24/7 response team", "SWIFT network coordination", "Law enforcement liaison"]
    },
    {
      title: "Romance Scam Chargeback Success",
      category: "Chargeback",
      amount: "$45,000",
      duration: "35 days",
      description: "Victim of an elaborate romance scam sent multiple payments. We compiled evidence and successfully obtained chargebacks from all payment processors.",
      testimonial: {
        quote: "I was embarrassed and devastated. Lexington handled everything with sensitivity and got every penny back through chargebacks.",
        author: "Margaret Wilson",
        title: "Retired Teacher",
        recoveredAmount: "$45,000",
        rating: 5
      },
      challenges: ["Multiple payment methods", "Emotional vulnerability", "Documentation gaps"],
      solutions: ["Comprehensive evidence package", "Psychological support", "Multi-channel recovery"]
    },
    {
      title: "Binary Options Fraud Recovery",
      category: "Investment Fraud",
      amount: "$67,500",
      duration: "52 days",
      description: "Client lost funds to a fraudulent binary options platform. We traced funds through multiple accounts and negotiated a settlement with the broker.",
      testimonial: {
        quote: "The binary options broker refused to return my funds. Lexington's legal pressure and negotiation skills got me a full refund.",
        author: "James Anderson",
        title: "Financial Advisor",
        recoveredAmount: "$67,500",
        rating: 5
      },
      challenges: ["Offshore broker", "Regulatory complexity", "Asset hiding"],
      solutions: ["Regulatory complaints", "Asset tracing", "Settlement negotiation"]
    }
  ];

  const recoveryStats = [
    { icon: DollarSign, label: "Total Recovered", value: "$322,500", description: "From featured cases" },
    { icon: Clock, label: "Average Time", value: "39 days", description: "To full recovery" },
    { icon: CheckCircle, label: "Success Rate", value: "100%", description: "For featured cases" },
    { icon: Shield, label: "Client Satisfaction", value: "5 stars", description: "Average rating" }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Case Studies | Lexington Capital Recovery Success Stories</title>
        <meta name="description" content="Real fund recovery success stories. See how Lexington Capital Recovery helped clients recover millions from scams, fraud, and disputes." />
        <link rel="canonical" href={window.location.origin + "/case-studies"} />
      </Helmet>

      {/* Hero Section */}
      <section className="px-4 py-20 gradient-hero">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6">
            Real Success Stories
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
            See how we've helped clients recover millions from fraud, scams, and payment disputes.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">Featured Case Results</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These numbers represent real recoveries for real clients who trusted us with their cases.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recoveryStats.map((stat, index) => (
              <div key={stat.label} className="bg-card rounded-xl p-6 shadow-medium border border-border/50 text-center">
                <div className="gradient-primary inline-flex p-3 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold font-playfair text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl space-y-20">
          {successStories.map((story, index) => (
            <div key={story.title} className="grid gap-12 lg:grid-cols-2 items-start">
              <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="bg-card rounded-xl p-8 shadow-medium border border-border/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="gradient-primary p-3 rounded-lg">
                      {story.category === "Cryptocurrency" && <TrendingUp className="h-6 w-6 text-white" />}
                      {story.category === "Wire Transfer" && <Globe className="h-6 w-6 text-white" />}
                      {story.category === "Chargeback" && <Shield className="h-6 w-6 text-white" />}
                      {story.category === "Investment Fraud" && <DollarSign className="h-6 w-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-playfair">{story.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="bg-trust-blue/10 text-trust-blue px-3 py-1 rounded-full">{story.category}</span>
                        <span>{story.amount} recovered</span>
                        <span>{story.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">{story.description}</p>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Challenges Faced</h4>
                      <ul className="space-y-2">
                        {story.challenges.map((challenge, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-warning-amber" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Our Solutions</h4>
                      <ul className="space-y-2">
                        {story.solutions.map((solution, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-success-green" />
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`order-1 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <TestimonialCard
                  quote={story.testimonial.quote}
                  author={story.testimonial.author}
                  title={story.testimonial.title}
                  recoveredAmount={story.testimonial.recoveredAmount}
                  rating={story.testimonial.rating}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-trust-blue to-trust-blue-light">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">
            Your Success Story Starts Here
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join our growing list of successful recoveries. Get your free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="xl" variant="premium">
              <Link to="/start">Start Your Recovery</Link>
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

export default CaseStudies;