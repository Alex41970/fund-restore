import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Pricing | Money Recovery</title>
        <meta name="description" content="Transparent fees for case evaluation and recovery services." />
        <link rel="canonical" href={window.location.origin + "/pricing"} />
      </Helmet>
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
        <h1 className="text-3xl font-bold">Pricing</h1>
        <section className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-md p-6">
            <h2 className="font-semibold">Free Evaluation</h2>
            <p className="text-sm text-muted-foreground mt-2">We’ll review your situation and advise next steps.</p>
            <div className="mt-4"><Button asChild><Link to="/start">Start Now</Link></Button></div>
          </div>
          <div className="border rounded-md p-6">
            <h2 className="font-semibold">Case Review Fee</h2>
            <p className="text-sm text-muted-foreground mt-2">Deeper analysis and evidence planning. Stripe checkout coming next.</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Pricing;
