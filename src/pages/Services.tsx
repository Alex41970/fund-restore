import { Helmet } from "react-helmet-async";

const Services = () => {
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Services | Lixington Capital Recovery</title>
        <meta name="description" content="Expert chargebacks, crypto scam assistance, wire recalls, and dispute services." />
        <link rel="canonical" href={window.location.origin + "/services"} />
      </Helmet>
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
        <h1 className="text-3xl font-bold">Services</h1>
        <section className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-md p-6">
            <h2 className="font-semibold">Card Chargebacks</h2>
            <p className="text-sm text-muted-foreground mt-2">We help prepare evidence and communicate with your bank to file effective chargebacks.</p>
          </div>
          <div className="border rounded-md p-6">
            <h2 className="font-semibold">Crypto Scam Recovery</h2>
            <p className="text-sm text-muted-foreground mt-2">We trace on-chain activity and coordinate with platforms for potential asset freezes.</p>
          </div>
          <div className="border rounded-md p-6">
            <h2 className="font-semibold">Wire Transfer Recalls</h2>
            <p className="text-sm text-muted-foreground mt-2">We contact recipient banks promptly to request recall or return of misdirected funds.</p>
          </div>
          <div className="border rounded-md p-6">
            <h2 className="font-semibold">Marketplace & Broker Disputes</h2>
            <p className="text-sm text-muted-foreground mt-2">Assistance with platform disputes and escalations.</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Services;
