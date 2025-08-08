import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const PaymentCanceled = () => {
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Payment Canceled | Lixington Capital Recovery</title>
        <meta name="description" content="Your payment was canceled." />
        <link rel="canonical" href={window.location.origin + "/payment-canceled"} />
      </Helmet>
      <div className="mx-auto max-w-xl px-4 py-12 space-y-6 text-center">
        <h1 className="text-3xl font-bold">Payment canceled</h1>
        <p className="text-muted-foreground">You can restart payment anytime.</p>
        <Link className="underline" to="/pricing">Back to Pricing</Link>
      </div>
    </main>
  );
};

export default PaymentCanceled;
