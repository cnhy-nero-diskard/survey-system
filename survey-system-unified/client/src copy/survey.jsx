import React, { useState } from 'react';
import translations from './translations.json';

const Question = ({ label }) => (
    <div>
      <label>{label}</label>
      <input type="text" />
    </div>
  );
  
  const Page1 = ({ translations }) => (
    <div>
      <h1>{translations.page1.title}</h1>
      <Question label={translations.page1.question1} />
      <Question label={translations.page1.question2} />
    </div>
  );

const SurveyForm = () => {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <div>
      <select onChange={(e) => handleLanguageChange(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        {/* Add more languages here */}
      </select>
      <h1>{translations[language].page1.title}</h1>
      <form>
        <label>{translations[language].page1.question1}</label>
        <input type="text" />
        <label>{translations[language].page1.question2}</label>
        <input type="number" />
      </form>
    </div>
  );
};

export default SurveyForm;