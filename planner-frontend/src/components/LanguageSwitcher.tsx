// src/components/LanguageSwitcher.tsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("lang", selectedLang);
  };

  return (
    <select value={i18n.language} onChange={handleChange} margin-right="50px">
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  );
};

export default LanguageSwitcher;
