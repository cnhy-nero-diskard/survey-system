import React, { createContext, useState, useEffect } from 'react';

export const UnifiedContext = createContext();

export const UnifiedProvider = ({ children, routes }) => {
  // Initialize activeBlocks from sessionStorage or use default value
  const [activeBlocks, setActiveBlocks] = useState(() => {
    const storedActiveBlocks = sessionStorage.getItem('activeBlocks');
    return storedActiveBlocks ? JSON.parse(storedActiveBlocks) : ['universal', 'surveytpms', 'feedback', 'isalone'];
  });

  const [headerText, setHeaderText] = useState('');
  const [touristAlone, setTouristAlone] = useState('');

  // Sync activeBlocks to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('activeBlocks', JSON.stringify(activeBlocks));
  }, [activeBlocks]);

  // Function to append new blocks to activeBlocks
  const appendActiveBlocks = (newBlocks) => {
    setActiveBlocks((prevBlocks) => {
      // Ensure no duplicates
      const uniqueBlocks = [...new Set([...prevBlocks, ...newBlocks])];
      return uniqueBlocks;
    });
  };

  // Function to remove a specific block from activeBlocks
  const removeActiveBlocks = (blockToRemove) => {
    setActiveBlocks((prevBlocks) => {
      // Filter out the block to be removed
      const updatedBlocks = prevBlocks.filter((block) => block !== blockToRemove);
      return updatedBlocks;
    });
  };

  // Function to check if a block is active
  const isBlockActive = (block) => {
    return activeBlocks.includes(block);
  };

  return (
    <UnifiedContext.Provider
      value={{
        activeBlocks,
        setActiveBlocks,
        appendActiveBlocks,
        removeActiveBlocks,
        isBlockActive,
        routes,
        headerText,
        setHeaderText,
        touristAlone,
        setTouristAlone,
      }}
    >
      {children}
    </UnifiedContext.Provider>
  );
};