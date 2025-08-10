import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const linkCls = ({ isActive }: { isActive: boolean }) =>
  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground";

export const Header: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <NavLink to="/" className="font-semibold">Lixington Capital Recovery</NavLink>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className={linkCls} end>Home</NavLink>
          <NavLink to="/about" className={linkCls}>About</NavLink>
          <NavLink to="/services" className={linkCls}>Services</NavLink>
          <NavLink to="/case-studies" className={linkCls}>Success Stories</NavLink>
          <NavLink to="/pricing" className={linkCls}>Pricing</NavLink>
          <NavLink to="/start" className={linkCls}>Start</NavLink>
          <NavLink to="/contact" className={linkCls}>Contact</NavLink>
          {user && <NavLink to="/dashboard" className={linkCls}>Dashboard</NavLink>}
          {isAdmin && <NavLink to="/admin" className={linkCls}>Admin</NavLink>}
          {!user ? (
            <Button asChild size="sm">
              <NavLink to="/auth">Sign in</NavLink>
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={handleSignOut}>Sign out</Button>
          )}
        </nav>
      </div>
    </header>
  );
};
