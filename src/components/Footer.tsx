import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Award, 
  CheckCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";

const linkCls = "text-muted-foreground hover:text-foreground transition-colors duration-200";

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t border-border/50">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">{t('header.companyName')}</h3>
              <p className="text-sm text-muted-foreground">{t('footer.company.description')}</p>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-success-green" />
              <span>{t('footer.company.licensed')}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4 text-premium-gold" />
              <span>{t('footer.company.certified')}</span>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t('footer.navigation.title')}</h4>
            <nav className="flex flex-col space-y-3">
              <NavLink to="/" className={linkCls}>{t('navigation.home')}</NavLink>
              <NavLink to="/about" className={linkCls}>{t('navigation.about')}</NavLink>
              <NavLink to="/services" className={linkCls}>{t('navigation.services')}</NavLink>
              <NavLink to="/case-studies" className={linkCls}>{t('navigation.successStories')}</NavLink>
              <NavLink to="/pricing" className={linkCls}>{t('navigation.pricing')}</NavLink>
              <NavLink to="/start" className={linkCls}>{t('navigation.start')}</NavLink>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t('footer.services.title')}</h4>
            <div className="flex flex-col space-y-3">
              <span className="text-sm text-muted-foreground">{t('footer.services.bankDisputes')}</span>
              <span className="text-sm text-muted-foreground">{t('footer.services.cryptoRecovery')}</span>
              <span className="text-sm text-muted-foreground">{t('footer.services.wireRecalls')}</span>
              <span className="text-sm text-muted-foreground">{t('footer.services.consultation')}</span>
            </div>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t('footer.contact.title')}</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{t('footer.contact.email')}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{t('footer.contact.phone')}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{t('footer.contact.location')}</span>
              </div>
            </div>

            <div className="pt-2">
              <NavLink to="/contact" className={linkCls}>
                {t('navigation.contact')}
              </NavLink>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 p-6 bg-gradient-to-r from-trust-blue/5 to-success-green/5 rounded-xl border border-border/30">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success-green" />
              <h3 className="text-lg font-semibold text-foreground">{t('footer.cta.title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{t('footer.cta.description')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button asChild className="gradient-primary text-white">
                <NavLink to="/start">{t('footer.cta.getStarted')}</NavLink>
              </Button>
              <Button asChild variant="outline">
                <NavLink to="/contact">{t('footer.cta.contactUs')}</NavLink>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            
            {/* Copyright & Legal */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-muted-foreground">
              <span>{t('footer.bottom.copyright')}</span>
              <div className="flex space-x-4">
                <NavLink to="/security" className="hover:text-foreground transition-colors">
                  {t('footer.bottom.privacy')}
                </NavLink>
                <NavLink to="/security" className="hover:text-foreground transition-colors">
                  {t('footer.bottom.terms')}
                </NavLink>
                <NavLink to="/security" className="hover:text-foreground transition-colors">
                  {t('footer.bottom.security')}
                </NavLink>
              </div>
            </div>

            {/* Social & Language */}
            <div className="flex items-center space-x-4">
              <div className="flex space-x-3">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Instagram className="h-4 w-4" />
                </Button>
              </div>
              <div className="border-l border-border/50 pl-4">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};