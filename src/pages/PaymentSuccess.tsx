import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Payment Success | Money Recovery</title>
        <meta name="description" content="Your payment was successful." />
        <link rel="canonical" href={window.location.origin + "/payment-success"} />
      </Helmet>
      <div className="mx-auto max-w-xl px-4 py-12 space-y-6 text-center">
        <h1 className="text-3xl font-bold">Payment successful</h1>
        <p className="text-muted-foreground">Thank you. You can now proceed to your portal.</p>
        <Link className="underline" to="/dashboard">Go to Dashboard</Link>
      </div>
    </main>
  );
};

export default PaymentSuccess;
