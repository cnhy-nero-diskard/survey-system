import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

/**
 * LanguageProvider component that provides the selected language context to its children.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will consume the language context.
 *
 * @returns {JSX.Element} The LanguageContext provider with the selected language and setter function.
 *
 * @example
 * <LanguageProvider>
 *   <YourComponent />
 * </LanguageProvider>
 */
export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    // Retrieve the language from localStorage on initial load
    console.log(`LANGUAGECONTEXT ${localStorage.getItem('selectedLanguage')}`);
    return localStorage.getItem('selectedLanguage') || 'en'; // Default to 'en' if no language is found
  });

  useEffect(() => {
    // Save the selected language to localStorage whenever it changes
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }, [selectedLanguage]);

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);