// // SurveyRoutesContext.js
// import React, { createContext, useState } from 'react';

// export const SurveyRoutesContext = createContext();

// export const SurveyConditionalBlocks = ({ children }) => {
//   const [activeBlocks, setActiveBlocks] = useState([]);

//   return (
//     <SurveyRoutesContext.Provider value={{ activeBlocks, setActiveBlocks }}>
//       {children}
//     </SurveyRoutesContext.Provider>
//   );
// };