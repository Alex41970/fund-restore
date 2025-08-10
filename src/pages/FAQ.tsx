import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HelpCircle, Clock, Shield, DollarSign, Phone } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: HelpCircle,
      faqs: [
        {
          question: "How do I know if you can help with my case?",
          answer: "We handle most types of financial fraud including credit card fraud, cryptocurrency scams, wire transfer fraud, investment scams, and romance scams. Our free case evaluation will determine if we can assist with your specific situation. We have a 94% success rate across all case types."
        },
        {
          question: "How much does the initial consultation cost?",
          answer: "The initial case evaluation is completely free. We review your case, assess recovery prospects, and provide recommendations at no cost. You only pay if we successfully recover your funds."
        },
        {
          question: "What information do I need to provide?",
          answer: "We'll need details about the fraud, transaction records, communication with the scammer, and any documentation you have. Don't worry if you don't have everything - our team can help guide you through gathering the necessary evidence."
        },
        {
          question: "How long does the evaluation process take?",
          answer: "We provide initial assessment within 24 hours of receiving your case details. For urgent cases involving recent fraud, we can provide immediate guidance within hours."
        }
      ]
    },
    {
      title: "Recovery Process",
      icon: Clock,
      faqs: [
        {
          question: "How long does fund recovery typically take?",
          answer: "Recovery timeframes vary by case type: Emergency responses (1-3 days), standard chargebacks and wire recalls (2-8 weeks), complex multi-jurisdictional cases (3-6 months). We provide regular updates throughout the process."
        },
        {
          question: "What is your success rate?",
          answer: "We maintain a 94% success rate across all case types. This includes full and partial recoveries. Our success comes from our systematic approach, industry relationships, and experienced team of former banking and law enforcement professionals."
        },
        {
          question: "What recovery methods do you use?",
          answer: "We employ multiple recovery strategies including credit card chargebacks, wire transfer recalls, cryptocurrency tracing and freezing, platform disputes, regulatory complaints, and when necessary, legal action. The approach depends on your specific case."
        },
        {
          question: "Can you recover cryptocurrency that was stolen?",
          answer: "Yes, we have specialized blockchain analysts who can trace cryptocurrency transactions. We work with exchanges to freeze accounts and have successfully recovered millions in stolen crypto through various techniques."
        }
      ]
    },
    {
      title: "Costs & Fees",
      icon: DollarSign,
      faqs: [
        {
          question: "What are your fees?",
          answer: "We work on a 'no recovery, no fee' basis. You only pay if we successfully recover your funds. Our fee structure is transparent and discussed upfront. For detailed pricing information, please visit our pricing page or contact us directly."
        },
        {
          question: "Are there any upfront costs?",
          answer: "No upfront fees for our recovery services. However, some cases may require third-party costs (court filing fees, forensic analysis, etc.) which we'll discuss with you beforehand. These are typically minimal compared to potential recovery amounts."
        },
        {
          question: "Do you offer payment plans?",
          answer: "Since we work on a contingency basis, payment is only required upon successful recovery. In cases where third-party costs are involved, we can discuss payment arrangements to make the process accessible."
        },
        {
          question: "What happens if you don't recover my money?",
          answer: "If we're unable to recover your funds, you owe us nothing. This is our commitment to you - we only succeed when you succeed. We're confident in our abilities, which is why we can offer this guarantee."
        }
      ]
    },
    {
      title: "Security & Privacy",
      icon: Shield,
      faqs: [
        {
          question: "How do you protect my personal information?",
          answer: "We use bank-level encryption and security measures to protect all client information. Our systems comply with industry standards, and we never share your information without explicit consent except where required by law."
        },
        {
          question: "Will my case be kept confidential?",
          answer: "Absolutely. Client confidentiality is paramount to our practice. We maintain strict confidentiality agreements and only share case information on a need-to-know basis within our recovery team."
        },
        {
          question: "Do you work with law enforcement?",
          answer: "Yes, we coordinate with law enforcement agencies when beneficial to your case. Many of our team members are former law enforcement professionals. We can help you file proper reports and work with authorities to strengthen your case."
        },
        {
          question: "Can working with you affect my relationship with my bank?",
          answer: "No, working with us typically strengthens your position with financial institutions. We have established relationships with banks and speak their language, often improving your chances of successful resolution."
        }
      ]
    }
  ];

  const quickStats = [
    { label: "Cases Handled", value: "10,000+", icon: HelpCircle },
    { label: "Success Rate", value: "94%", icon: Shield },
    { label: "Funds Recovered", value: "$50M+", icon: DollarSign },
    { label: "Response Time", value: "24hrs", icon: Clock }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>FAQ | Frequently Asked Questions - Lixington Capital Recovery</title>
        <meta name="description" content="Get answers to common questions about fund recovery, our process, fees, and success rates. Expert help for fraud victims." />
        <link rel="canonical" href={window.location.origin + "/faq"} />
      </Helmet>

      {/* Hero Section */}
      <section className="gradient-background text-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Find answers to common questions about our fund recovery process, fees, and success rates.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {quickStats.map((stat, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-large transition-shadow duration-300">
                <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold font-playfair text-foreground">
                    {category.title}
                  </h2>
                </div>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border border-border/50 rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-card/30">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold font-playfair text-foreground mb-4">
            Still Have Questions?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our expert team is here to help you understand your options and guide you through the recovery process.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="p-6">
              <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Speak to an Expert</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get immediate answers from our recovery specialists
              </p>
              <Button asChild className="w-full">
                <Link to="/contact">Contact Us Now</Link>
              </Button>
            </Card>
            
            <Card className="p-6">
              <HelpCircle className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Free Case Review</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get personalized answers about your specific situation
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/start">Start Evaluation</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 gradient-background text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold font-playfair mb-4">
            Emergency Cases
          </h2>
          <p className="text-xl opacity-90 mb-8">
            For time-sensitive fraud cases, contact us immediately. Every hour matters in fresh fraud cases.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/contact">Emergency Contact</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/how-it-works">Learn Our Process</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FAQ;