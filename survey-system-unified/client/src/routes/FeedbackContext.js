// src/routes/FeedbackContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context for the object
const FeedbackContext = createContext();

// Provider component
export const FeedbackProvider = ({ children }) => {
    const [feedback, setFeedback] = useState({
        entity: null,
        rating: null,
        review: null,
        touchpoint: null, 
        is_analyzed:false,
        submitted_at: null,
        language: null

    });

    return (
        <FeedbackContext.Provider value={{ feedback, setFeedback }}>
            {children}
        </FeedbackContext.Provider>
    );
};

// Custom hook to use the context
export const useFeedback = () => useContext(FeedbackContext);
