// src/components/LanguageSwitcher.tsx
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select value={i18n.language} onChange={handleChange}>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  );
};

export default LanguageSwitcher;
