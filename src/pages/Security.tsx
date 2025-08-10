import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, FileCheck, Server, Users, AlertTriangle, CheckCircle } from "lucide-react";

const Security = () => {
  const securityMeasures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All communications and data transfers use military-grade AES-256 encryption",
      details: [
        "SSL/TLS encryption for all web traffic",
        "Encrypted file storage and transmission",
        "Secure API communications",
        "Regular encryption key rotation"
      ]
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Enterprise-grade hosting with multiple security layers and redundancy",
      details: [
        "ISO 27001 certified data centers",
        "24/7 security monitoring",
        "DDoS protection and mitigation",
        "Regular security audits and penetration testing"
      ]
    },
    {
      icon: Users,
      title: "Access Controls",
      description: "Strict access controls ensure only authorized personnel can view your case",
      details: [
        "Multi-factor authentication required",
        "Role-based access permissions",
        "Regular access reviews and updates",
        "Audit trails for all data access"
      ]
    },
    {
      icon: Eye,
      title: "Privacy Protection",
      description: "Your personal information is protected with bank-level privacy standards",
      details: [
        "Strict confidentiality agreements",
        "Need-to-know data access policy",
        "No third-party data sharing without consent",
        "Regular privacy training for all staff"
      ]
    }
  ];

  const certifications = [
    {
      icon: Shield,
      title: "SOC 2 Type II Compliant",
      description: "Independently audited security, availability, and confidentiality controls"
    },
    {
      icon: FileCheck,
      title: "GDPR Compliant",
      description: "Full compliance with European data protection regulations"
    },
    {
      icon: CheckCircle,
      title: "PCI DSS Standards",
      description: "Payment card industry security standards for financial data"
    },
    {
      icon: Lock,
      title: "ISO 27001 Certified",
      description: "International standard for information security management"
    }
  ];

  const bestPractices = [
    {
      title: "Data Minimization",
      description: "We only collect and retain data necessary for your case recovery"
    },
    {
      title: "Regular Backups",
      description: "Automated, encrypted backups ensure your data is never lost"
    },
    {
      title: "Incident Response",
      description: "Comprehensive incident response plan with immediate notification protocols"
    },
    {
      title: "Staff Training",
      description: "Regular security training and background checks for all team members"
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Security & Privacy | Lixington Capital Recovery</title>
        <meta name="description" content="Learn about our bank-level security measures, data protection, and privacy policies. Your case information is protected with military-grade encryption." />
        <link rel="canonical" href={window.location.origin + "/security"} />
      </Helmet>

      {/* Hero Section */}
      <section className="gradient-background text-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-6">
            Security & Privacy
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Your trust is paramount. We protect your sensitive information with bank-level security and unwavering commitment to privacy.
          </p>
        </div>
      </section>

      {/* Security Measures */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-playfair text-foreground mb-4">
              How We Protect Your Information
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We employ multiple layers of security to ensure your case information remains confidential and secure throughout the recovery process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {securityMeasures.map((measure, index) => (
              <Card key={index} className="p-6 hover:shadow-large transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <measure.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {measure.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {measure.description}
                    </p>
                    <ul className="space-y-2">
                      {measure.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-success-green flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-card/30">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-playfair text-foreground mb-4">
              Security Certifications
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our security practices are independently verified and certified by leading industry standards.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-large transition-shadow duration-300">
                <div className="inline-flex p-3 rounded-lg bg-success-green/10 mb-4">
                  <cert.icon className="h-6 w-6 text-success-green" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {cert.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {cert.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-playfair text-foreground mb-4">
              Our Privacy Principles
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {bestPractices.map((practice, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-card/50 border border-border/30 rounded-lg">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {practice.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {practice.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-16 bg-card/30">
        <div className="mx-auto max-w-4xl px-4">
          <Card className="p-8">
            <div className="text-center mb-6">
              <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold font-playfair text-foreground mb-4">
                Transparency Commitment
              </h2>
            </div>
            
            <div className="space-y-6 text-muted-foreground">
              <p>
                <strong className="text-foreground">What We Collect:</strong> We only collect information necessary for your case recovery, including transaction details, communication records, and relevant documentation.
              </p>
              
              <p>
                <strong className="text-foreground">How We Use It:</strong> Your information is used exclusively for case analysis, recovery efforts, and communication with relevant parties (banks, platforms, authorities) to recover your funds.
              </p>
              
              <p>
                <strong className="text-foreground">Who Has Access:</strong> Only authorized recovery specialists assigned to your case can access your information. All staff sign strict confidentiality agreements.
              </p>
              
              <p>
                <strong className="text-foreground">Data Retention:</strong> We retain case files only as long as necessary for recovery efforts and legal requirements, then securely delete all information.
              </p>
              
              <p>
                <strong className="text-foreground">Your Rights:</strong> You have the right to access, correct, or request deletion of your information at any time. Contact us for any privacy-related requests.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Security Incident Response */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-playfair text-foreground mb-4">
              Security Incident Response
            </h2>
          </div>
          
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-orange-500/10 flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Our Response Commitment
                </h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    In the unlikely event of a security incident, we have comprehensive response procedures:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success-green flex-shrink-0" />
                      Immediate containment and assessment within 1 hour
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success-green flex-shrink-0" />
                      Client notification within 24 hours if personal data is affected
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success-green flex-shrink-0" />
                      Full investigation and remediation with external security experts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success-green flex-shrink-0" />
                      Transparent communication throughout the resolution process
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Security Team */}
      <section className="py-16 gradient-background text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold font-playfair mb-4">
            Questions About Security?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Our security team is available to address any concerns about data protection and privacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/contact">Contact Security Team</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/start">Start Secure Evaluation</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Security;