import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const { user } = useAuth();
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <Helmet>
        <title>Case Manager | Home</title>
        <meta name="description" content="Manage your cases and attachments securely with Case Manager." />
        <link rel="canonical" href={window.location.origin + "/"} />
      </Helmet>
      <div className="text-center space-y-4 px-4">
        <h1 className="text-4xl font-bold">Manage your cases with ease</h1>
        <p className="text-xl text-muted-foreground">Simple, secure case tracking and file attachments.</p>
        <div className="flex items-center justify-center gap-3">
          {user ? (
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Index;
