import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/use-auth";
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
  Instagram,
  ExternalLink,
  MessageCircle,
  BookOpen,
  Users,
  Building,
  FileText,
  Clock,
  HelpCircle,
  Download
} from "lucide-react";

const linkCls = "text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  // Hide footer on auth pages and authenticated user pages
  if (location.pathname.startsWith('/auth') || 
      (user && (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')))) {
    return null;
  }

  return (
    <footer className="bg-card border-t border-border/50">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">{t('header.companyName')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('footer.company.description')}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="h-4 w-4 text-success-green" />
                <span className="text-muted-foreground">{t('footer.company.licensed')}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <Award className="h-4 w-4 text-premium-gold" />
                <span className="text-muted-foreground">{t('footer.company.certified')}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle className="h-4 w-4 text-trust-blue" />
                <span className="text-muted-foreground">{t('footer.company.trusted')}</span>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t('footer.navigation.title')}</h4>
            <nav className="flex flex-col space-y-3">
              <NavLink to="/" className={linkCls}>{t('navigation.home')}</NavLink>
              <NavLink to="/about" className={linkCls}>{t('navigation.about')}</NavLink>
              <NavLink to="/services" className={linkCls}>{t('navigation.services')}</NavLink>
              <NavLink to="/how-it-works" className={linkCls}>{t('navigation.howItWorks')}</NavLink>
              <NavLink to="/case-studies" className={linkCls}>{t('navigation.successStories')}</NavLink>
              <NavLink to="/pricing" className={linkCls}>{t('navigation.pricing')}</NavLink>
              <NavLink to="/start" className={linkCls}>
                {t('navigation.start')}
                <ExternalLink className="h-3 w-3" />
              </NavLink>
            </nav>
          </div>

          {/* Services & Solutions */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t('footer.services.title')}</h4>
            <div className="flex flex-col space-y-3">
              <span className="text-sm text-muted-foreground">{t('footer.services.bankDisputes')}</span>
              <span className="text-sm text-muted-foreground">{t('footer.services.cryptoRecovery')}</span>
              <span className="text-sm text-muted-foreground">{t('footer.services.wireRecalls')}</span>
              <span className="text-sm text-muted-foreground">{t('footer.services.consultation')}</span>
              <span className="text-sm text-muted-foreground">{t('footer.services.marketplaceDisputes')}</span>
            </div>
          </div>

          {/* Resources & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t('footer.resources.title')}</h4>
            <nav className="flex flex-col space-y-3">
              <NavLink to="/faq" className={linkCls}>
                <HelpCircle className="h-3 w-3" />
                {t('footer.resources.faq')}
              </NavLink>
              <NavLink to="/blog" className={linkCls}>
                <BookOpen className="h-3 w-3" />
                {t('footer.resources.blog')}
              </NavLink>
              <NavLink to="/security" className={linkCls}>
                <Shield className="h-3 w-3" />
                {t('footer.resources.security')}
              </NavLink>
              <a href="#" className={linkCls}>
                <Download className="h-3 w-3" />
                {t('footer.resources.guides')}
              </a>
              <a href="#" className={linkCls}>
                <MessageCircle className="h-3 w-3" />
                {t('footer.resources.support')}
              </a>
            </nav>
          </div>

          {/* Contact & Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t('footer.contact.title')}</h4>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-sm">
                  <Mail className="h-4 w-4 mt-0.5 text-trust-blue" />
                  <div>
                    <div className="text-muted-foreground">{t('footer.contact.email')}</div>
                    <div className="text-xs text-muted-foreground/80">{t('footer.contact.emailHours')}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 text-sm">
                  <Phone className="h-4 w-4 mt-0.5 text-trust-blue" />
                  <div>
                    <div className="text-muted-foreground">{t('footer.contact.phone')}</div>
                    <div className="text-xs text-muted-foreground/80">{t('footer.contact.phoneHours')}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-trust-blue" />
                  <div className="text-muted-foreground">{t('footer.contact.location')}</div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <NavLink to="/contact" className={linkCls}>
                  <MessageCircle className="h-3 w-3" />
                  {t('navigation.contact')}
                </NavLink>
                <a href="#" className={linkCls}>
                  <Clock className="h-3 w-3" />
                  {t('footer.contact.consultation')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter & CTA Section */}
        <div className="mt-16 p-8 bg-gradient-to-r from-trust-blue/5 to-success-green/5 rounded-2xl border border-border/30">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="h-6 w-6 text-success-green" />
              <h3 className="text-xl font-bold text-foreground">{t('footer.cta.title')}</h3>
            </div>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">{t('footer.cta.description')}</p>
            
            {/* Newsletter Signup */}
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder={t('footer.newsletter.placeholder')}
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-trust-blue"
                />
                <Button className="gradient-primary text-white px-6">
                  {t('footer.newsletter.subscribe')}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{t('footer.newsletter.privacy')}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button asChild size="lg" className="gradient-primary text-white">
                <NavLink to="/start">{t('footer.cta.getStarted')}</NavLink>
              </Button>
              <Button asChild variant="outline" size="lg">
                <NavLink to="/contact">{t('footer.cta.contactUs')}</NavLink>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            
            {/* Copyright & Legal */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-muted-foreground">
              <span className="font-medium">{t('footer.bottom.copyright')}</span>
              <div className="flex flex-wrap justify-center gap-6">
                <NavLink to="/security" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {t('footer.bottom.privacy')}
                </NavLink>
                <NavLink to="/security" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {t('footer.bottom.terms')}
                </NavLink>
                <NavLink to="/security" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {t('footer.bottom.security')}
                </NavLink>
                <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {t('footer.bottom.compliance')}
                </a>
              </div>
            </div>

            {/* Social & Language */}
            <div className="flex items-center space-x-6">
              <div className="flex space-x-3">
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-trust-blue/10 hover:text-trust-blue">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-trust-blue/10 hover:text-trust-blue">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-trust-blue/10 hover:text-trust-blue">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-trust-blue/10 hover:text-trust-blue">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </div>
              <div className="border-l border-border/50 pl-6">
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          {/* Professional Disclaimer */}
          <div className="mt-6 pt-6 border-t border-border/20">
            <p className="text-xs text-muted-foreground/80 text-center max-w-4xl mx-auto leading-relaxed">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};