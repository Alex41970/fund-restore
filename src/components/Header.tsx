import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const linkCls = ({ isActive }: { isActive: boolean }) =>
  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground";

export const Header: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

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
          <span className="font-semibold">Lixington Capital Recovery</span>
          <nav className="flex items-center gap-4">
            {isAdmin ? (
              <NavLink to="/admin" className={linkCls}>{t('navigation.admin')}</NavLink>
            ) : (
              <NavLink to="/dashboard" className={linkCls}>{t('navigation.dashboard')}</NavLink>
            )}
            <LanguageSwitcher />
            <Button size="sm" variant="outline" onClick={handleSignOut}>{t('common.signOut')}</Button>
          </nav>
        </div>
      </header>
    );
  }

  // Marketing website header - full navigation
  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <NavLink to="/" className="font-semibold">Lixington Capital Recovery</NavLink>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className={linkCls} end>{t('navigation.home')}</NavLink>
          <NavLink to="/about" className={linkCls}>{t('navigation.about')}</NavLink>
          <NavLink to="/services" className={linkCls}>{t('navigation.services')}</NavLink>
          <NavLink to="/case-studies" className={linkCls}>{t('navigation.caseStudies')}</NavLink>
          <NavLink to="/pricing" className={linkCls}>{t('navigation.pricing')}</NavLink>
          <NavLink to="/start" className={linkCls}>{t('navigation.start')}</NavLink>
          <NavLink to="/contact" className={linkCls}>{t('navigation.contact')}</NavLink>
          <LanguageSwitcher />
          <Button asChild size="sm">
            <NavLink to="/auth">{t('common.signIn')}</NavLink>
          </Button>
        </nav>
      </div>
    </header>
  );
};
