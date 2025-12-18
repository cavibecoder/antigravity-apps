"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";
import { Languages } from "lucide-react";

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ja' : 'en');
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2"
            title={language === 'en' ? "Switch to Japanese" : "Switch to English"}
        >
            <Languages className="h-4 w-4" />
            {language === 'en' ? '日本語' : 'English'}
        </Button>
    );
}
