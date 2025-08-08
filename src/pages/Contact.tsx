import { Helmet } from "react-helmet-async";

const Contact = () => {
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Contact | Lixington Capital Recovery</title>
        <meta name="description" content="Get in touch with the Lixington Capital Recovery team for assistance." />
        <link rel="canonical" href={window.location.origin + "/contact"} />
      </Helmet>
      <div className="mx-auto max-w-3xl px-4 py-12 space-y-6">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-muted-foreground">Email: support@example.com</p>
        <p className="text-muted-foreground">We’ll add a contact form here next.</p>
      </div>
    </main>
  );
};

export default Contact;
