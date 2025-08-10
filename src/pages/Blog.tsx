import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

const Blog = () => {
  const featuredPost = {
    id: "crypto-recovery-guide-2024",
    title: "Complete Guide to Cryptocurrency Recovery in 2024",
    excerpt: "Everything you need to know about recovering stolen crypto, from immediate steps to advanced recovery techniques.",
    author: "Sarah Chen, Recovery Specialist",
    date: "2024-01-15",
    readTime: "12 min read",
    category: "Cryptocurrency",
    featured: true,
    image: "/api/placeholder/600/300"
  };

  const blogPosts = [
    {
      id: "chargeback-success-rates",
      title: "Chargeback Success Rates by Industry: 2024 Data Analysis",
      excerpt: "Comprehensive analysis of chargeback success rates across different industries and fraud types.",
      author: "Michael Rodriguez, Data Analyst",
      date: "2024-01-12",
      readTime: "8 min read",
      category: "Chargebacks"
    },
    {
      id: "wire-fraud-prevention",
      title: "Wire Transfer Fraud: Prevention and Recovery Strategies",
      excerpt: "How to protect your business from wire fraud and what to do if you become a victim.",
      author: "David Kim, Fraud Investigator",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Wire Transfers"
    },
    {
      id: "romance-scam-psychology",
      title: "The Psychology Behind Romance Scams and How to Recover",
      excerpt: "Understanding the emotional manipulation tactics used by romance scammers and paths to recovery.",
      author: "Dr. Jennifer Walsh, Forensic Psychologist",
      date: "2024-01-08",
      readTime: "10 min read",
      category: "Romance Scams"
    },
    {
      id: "investment-fraud-red-flags",
      title: "10 Red Flags of Investment Fraud You Must Know",
      excerpt: "Learn to identify the warning signs of investment scams before you become a victim.",
      author: "Robert Thompson, Financial Investigator",
      date: "2024-01-05",
      readTime: "7 min read",
      category: "Investment Fraud"
    },
    {
      id: "blockchain-forensics",
      title: "How Blockchain Forensics Helps Recover Stolen Cryptocurrency",
      excerpt: "Deep dive into blockchain analysis techniques used to trace and recover stolen digital assets.",
      author: "Alex Zhang, Blockchain Analyst",
      date: "2024-01-03",
      readTime: "15 min read",
      category: "Cryptocurrency"
    },
    {
      id: "bank-cooperation-recovery",
      title: "How Banks Cooperate in Fund Recovery Efforts",
      excerpt: "Understanding the banking industry's role in fraud investigation and fund recovery processes.",
      author: "Patricia Miller, Banking Specialist",
      date: "2024-01-01",
      readTime: "9 min read",
      category: "Banking"
    }
  ];

  const categories = [
    "All Posts",
    "Cryptocurrency", 
    "Chargebacks",
    "Wire Transfers",
    "Romance Scams",
    "Investment Fraud",
    "Banking"
  ];

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Fund Recovery Blog | Expert Insights & Case Studies</title>
        <meta name="description" content="Expert insights on fund recovery, fraud prevention, and case studies from our recovery specialists. Stay informed about the latest scam trends." />
        <link rel="canonical" href={window.location.origin + "/blog"} />
      </Helmet>

      {/* Hero Section */}
      <section className="gradient-background text-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-6">
            Fund Recovery Insights
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Expert insights, case studies, and the latest trends in fraud prevention and fund recovery.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Featured Post */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-playfair text-foreground mb-4">Featured Article</h2>
          </div>
          
          <Card className="overflow-hidden hover:shadow-large transition-shadow duration-300">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gradient-primary"></div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    {featuredPost.category}
                  </Badge>
                  <Badge variant="secondary">Featured</Badge>
                </div>
                <h3 className="text-2xl font-bold font-playfair text-foreground mb-4">
                  {featuredPost.title}
                </h3>
                <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(featuredPost.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <Button asChild>
                  <Link to={`/blog/${featuredPost.id}`}>
                    Read Full Article <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Category Filter */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All Posts" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-large transition-shadow duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="h-48 bg-gradient-primary"></div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{post.author}</span>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/blog/${post.id}`}>
                        Read More <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 py-16 gradient-background text-white rounded-2xl">
          <div className="text-center max-w-2xl mx-auto px-6">
            <h2 className="text-3xl font-bold font-playfair mb-4">
              Stay Informed About Fraud Trends
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Get the latest insights on fraud prevention and recovery strategies delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-foreground bg-white"
              />
              <Button className="bg-white text-primary hover:bg-white/90">
                Subscribe
              </Button>
            </div>
            <p className="text-sm opacity-80 mt-4">
              No spam. Unsubscribe anytime. Privacy policy protected.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Blog;