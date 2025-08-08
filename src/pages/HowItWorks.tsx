import { Helmet } from "react-helmet-async";

const HowItWorks = () => {
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>How It Works | Money Recovery</title>
        <meta name="description" content="Understand our fund recovery process from evaluation to resolution." />
        <link rel="canonical" href={window.location.origin + "/how-it-works"} />
      </Helmet>
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
        <h1 className="text-3xl font-bold">How it works</h1>
        <section className="space-y-4">
          <p className="text-muted-foreground">We assess your case, gather evidence, contact relevant parties, and pursue chargebacks or recalls where applicable.</p>
          <ol className="list-decimal pl-6 space-y-2 text-sm">
            <li>Free case evaluation</li>
            <li>Evidence review and case strategy</li>
            <li>Engagement with banks, platforms, or counterparts</li>
            <li>Progress updates and resolution</li>
          </ol>
        </section>
      </div>
    </main>
  );
};

export default HowItWorks;
