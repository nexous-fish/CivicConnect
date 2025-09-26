import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="relative overflow-hidden min-w-[80px] h-8 px-3"
      >
        <div className="flex items-center gap-1">
          <span className={`transition-all duration-300 ${language === 'en' ? 'opacity-100' : 'opacity-50'}`}>
            EN
          </span>
          <span className="text-muted-foreground">|</span>
          <span className={`transition-all duration-300 ${language === 'hi' ? 'opacity-100' : 'opacity-50'}`}>
            हि
          </span>
        </div>
        
        {/* Sliding indicator */}
        <div 
          className={`absolute top-0 w-1/2 h-full bg-primary/10 transition-all duration-300 ${
            language === 'en' ? 'left-0' : 'left-1/2'
          }`}
        />
      </Button>
    </div>
  );
};

export default LanguageSwitcher;