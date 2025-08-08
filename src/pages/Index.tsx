import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const { user } = useAuth();
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <Helmet>
        <title>Lixington Capital Recovery | Home</title>
        <meta name="description" content="Lixington Capital Recovery helps reclaim lost funds from scams, chargebacks, and wire recalls." />
        <link rel="canonical" href={window.location.origin + "/"} />
      </Helmet>
      <div className="px-4">
        <section className="mx-auto max-w-6xl text-center py-20">
          <div className="inline-block rounded-full border px-3 py-1 text-xs text-muted-foreground mb-6">Trusted fund recovery assistance</div>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair">Lixington Capital Recovery</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Professional help to recover chargebacks, crypto scams, and wire transfers—ethical, transparent, and effective.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            {user ? (
              <Button asChild>
                <Link to="/dashboard">Go to Client Portal</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/start">Free Case Evaluation</Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link to="/pricing">See Pricing</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl grid gap-6 md:grid-cols-3 py-10">
          <div className="border rounded-md p-6 bg-card/50">
            <h3 className="font-semibold">Bank & Card Disputes</h3>
            <p className="text-sm text-muted-foreground mt-1">Chargebacks and recalls backed by clear evidence.</p>
          </div>
          <div className="border rounded-md p-6 bg-card/50">
            <h3 className="font-semibold">Crypto Scam Assistance</h3>
            <p className="text-sm text-muted-foreground mt-1">On-chain tracing and platform escalations.</p>
          </div>
          <div className="border rounded-md p-6 bg-card/50">
            <h3 className="font-semibold">Transparent Guidance</h3>
            <p className="text-sm text-muted-foreground mt-1">Clear next steps and regular progress updates.</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl py-12">
          <h2 className="text-2xl font-bold font-playfair text-center">How it works</h2>
          <div className="grid gap-4 md:grid-cols-4 mt-6">
            {['Evaluate','Plan','Engage','Recover'].map((s, i) => (
              <div key={s} className="border rounded-md p-5 text-center">
                <div className="text-3xl font-playfair">{i+1}</div>
                <div className="mt-2 font-medium">{s}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button asChild variant="ghost"><Link to="/how-it-works">Learn more</Link></Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl py-12">
          <h2 className="text-2xl font-bold font-playfair text-center">What clients say</h2>
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <blockquote className="border rounded-md p-6 bg-card">
              <p className="italic">“Professional and honest. They guided me through a successful chargeback.”</p>
              <footer className="mt-2 text-sm text-muted-foreground">— A. Reynolds</footer>
            </blockquote>
            <blockquote className="border rounded-md p-6 bg-card">
              <p className="italic">“Clear strategy and communication. Highly recommend.”</p>
              <footer className="mt-2 text-sm text-muted-foreground">— M. Singh</footer>
            </blockquote>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Index;
