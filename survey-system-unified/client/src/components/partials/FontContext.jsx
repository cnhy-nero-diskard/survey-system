// FontContext.js
import React, { createContext, useState } from 'react';

const FontContext = createContext();

const FontProvider = ({ children }) => {
  const [fonts, setFonts] = useState([
    {
      family: "'Roboto', sans-serif",
      url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
    },
    {
      family: "'Montserrat', sans-serif",
      url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap",
    },
  ]);

  const changeFont = (newFonts) => {
    setFonts(newFonts);
  };

  return (
    <FontContext.Provider value={{ fonts, changeFont }}>
      {children}
    </FontContext.Provider>
  );
};

export { FontContext, FontProvider };