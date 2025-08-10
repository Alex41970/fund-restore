import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Award, 
  Users, 
  Globe,
  CheckCircle,
  Star
} from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Michael Richardson",
      role: "Founder & CEO",
      experience: "15+ years in financial recovery",
      credentials: "Certified Fraud Examiner, MBA Finance"
    },
    {
      name: "Sarah Thompson",
      role: "Head of Recovery Operations",
      experience: "12+ years in banking disputes",
      credentials: "Former Bank Investigation Specialist"
    },
    {
      name: "David Chen",
      role: "Crypto Recovery Specialist",
      experience: "8+ years in blockchain analysis",
      credentials: "Certified Blockchain Investigator"
    },
    {
      name: "Emma Wilson",
      role: "Client Relations Director",
      experience: "10+ years in client advocacy",
      credentials: "Certified Customer Success Manager"
    }
  ];

  const achievements = [
    { icon: Users, title: "2,500+ Clients Served", description: "Successfully helped thousands recover their funds" },
    { icon: Shield, title: "$50M+ Recovered", description: "Total funds recovered for our clients" },
    { icon: Award, title: "94% Success Rate", description: "Industry-leading recovery success rate" },
    { icon: Globe, title: "Global Network", description: "Partnerships with banks and agencies worldwide" }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>About Us | Lixington Capital Recovery</title>
        <meta name="description" content="Learn about Lixington Capital Recovery's experienced team, proven track record, and commitment to fund recovery excellence." />
        <link rel="canonical" href={window.location.origin + "/about"} />
      </Helmet>

      {/* Hero Section */}
      <section className="px-4 py-20 gradient-hero">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6">
            About Lixington Capital Recovery
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
            Dedicated professionals with a proven track record of recovering lost funds and restoring financial security.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-20 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                At Lixington Capital Recovery, we believe that financial fraud victims deserve expert representation and the best possible chance at recovery. Our mission is to provide professional, ethical, and effective fund recovery services while maintaining the highest standards of client care.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Founded by financial industry veterans, we combine deep expertise in banking, cryptocurrency, and fraud investigation to deliver results that matter.
              </p>
              <Button asChild variant="trust" size="lg">
                <Link to="/start">Start Your Recovery</Link>
              </Button>
            </div>
            <div className="grid gap-6">
              {achievements.map((achievement, index) => (
                <div key={achievement.title} className="flex items-center space-x-4 p-4 bg-card rounded-lg border border-border/50 shadow-soft">
                  <div className="gradient-primary p-3 rounded-lg">
                    <achievement.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">Meet Our Expert Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Industry veterans with decades of combined experience in financial recovery and fraud investigation.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div key={member.name} className="bg-card rounded-xl p-6 shadow-medium hover:shadow-large transition-all duration-500 border border-border/50 text-center">
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
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every action we take on behalf of our clients.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card rounded-xl p-8 shadow-medium border border-border/50">
              <div className="gradient-primary inline-flex p-3 rounded-lg mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Integrity First</h3>
              <p className="text-muted-foreground leading-relaxed">
                We operate with complete transparency and honesty, providing realistic assessments and ethical recovery methods.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-8 shadow-medium border border-border/50">
              <div className="gradient-success inline-flex p-3 rounded-lg mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Results Driven</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our 94% success rate speaks to our commitment to achieving the best possible outcomes for every client.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-medium border border-border/50">
              <div className="gradient-premium inline-flex p-3 rounded-lg mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Client Excellence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every client receives personalized attention and regular updates throughout their recovery journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-trust-blue to-trust-blue-light">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">
            Ready to Work with the Experts?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of satisfied clients who've trusted us with their fund recovery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="xl" variant="premium">
              <Link to="/start">Get Free Consultation</Link>
            </Button>
            <Button asChild size="xl" variant="outline-premium">
              <Link to="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;