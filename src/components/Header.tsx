import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const linkCls = ({ isActive }: { isActive: boolean }) =>
  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground";

export const Header: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Show different header based on auth state
  if (user) {
    // Client portal header - minimal navigation
    return (
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <span className="font-semibold">{t('header.companyName')}</span>
          <nav className="flex items-center gap-4">
            {isAdmin ? (
              <NavLink to="/admin" className={linkCls}>{t('navigation.admin')}</NavLink>
            ) : (
              <NavLink to="/dashboard" className={linkCls}>{t('navigation.dashboard')}</NavLink>
            )}
            <LanguageSwitcher />
            <Button size="sm" variant="outline" onClick={handleSignOut}>{t('navigation.signOut')}</Button>
          </nav>
        </div>
      </header>
    );
  }

  // Marketing website header - clean and minimal
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
          {t('header.companyName')}
        </NavLink>
        <nav className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button asChild size="sm" className="gradient-primary text-white shadow-medium hover:shadow-large transition-all duration-300">
            <NavLink to="/auth">{t('navigation.signIn')}</NavLink>
          </Button>
        </nav>
      </div>
    </header>
  );
};
