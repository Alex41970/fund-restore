import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Start = () => {
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Free Case Evaluation | Lixington Capital Recovery</title>
        <meta name="description" content="Start your free evaluation to begin your fund recovery." />
        <link rel="canonical" href={window.location.origin + "/start"} />
      </Helmet>
      <div className="mx-auto max-w-2xl px-4 py-12 space-y-6">
        <h1 className="text-3xl font-bold">Free Case Evaluation</h1>
        <p className="text-muted-foreground">We’re setting up the form next. For now, create an account to submit your recovery request securely.</p>
        <div className="flex gap-3">
          <Button asChild><Link to="/auth">Create Account</Link></Button>
          <Button asChild variant="outline"><Link to="/contact">Contact Us</Link></Button>
        </div>
      </div>
    </main>
  );
};

export default Start;
