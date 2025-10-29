// useTranslations.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../../config/apiConfig.js';

/**
 * Custom hook to fetch and manage translations for a specific component and language.
 *
 * @param {string} component - The name of the component for which translations are needed.
 * @param {string} language - The language code for the desired translations.
 * @returns {Object} - An object containing the translations for the specified component and language.
 *
 * @example
 * const translations = useTranslations('Header', 'en');
 * console.log(translations.title); // Outputs the translated title for the Header component in English.
 */
const useTranslations = (component, language) => {
    const [translations, setTranslations] = useState({});

    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const response = await axios.get(
                    getApiUrl(`/api/texts?language=${language}&component=${component}`),
                     { withCredentials: true }
                );
                setTranslations(response.data);
            } catch (error) {
                console.error('Error fetching translations:', error);
            }
        };

        fetchTranslations();
    }, [component, language]);

    return translations;
};

export default useTranslations;