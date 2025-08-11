import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (language: string) => {
    console.log('Changing language to:', language);
    i18n.changeLanguage(language);
    console.log('Language changed, new language:', i18n.language);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  console.log('Current language:', i18n.language, 'Current language object:', currentLanguage);

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 bg-background hover:bg-accent border-border"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">{currentLanguage.flag} {currentLanguage.name}</span>
            <span className="md:hidden">{currentLanguage.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="z-50 bg-background border border-border shadow-lg min-w-[160px] p-1"
          sideOffset={5}
        >
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`cursor-pointer hover:bg-accent rounded-sm ${
                i18n.language === language.code ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              <span className="mr-2 text-base">{language.flag}</span>
              <span className="text-sm">{language.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};