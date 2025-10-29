// src/utils/currencyUtils.js

/**
 * Fetch all currencies from the RESTCountries API.
 * Returns an array of currency options for dropdowns.
 */
export const fetchCurrencies = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
  
      // Build currency options using ISO codes (e.g., "USD", "PHP").
      const allCurrencies = [];
      data.forEach((country) => {
        if (country.currencies) {
          Object.entries(country.currencies).forEach(([code, info]) => {
            allCurrencies.push({
              code,
              name: info.name,
              symbol: info.symbol,
            });
          });
        }
      });
  
      // De-duplicate the array by code since multiple countries can share the same currency code.
      const uniqueCurrencies = Array.from(
        new Map(allCurrencies.map((curr) => [curr.code, curr])).values()
      );
  
      // Create dropdown options, sorted by code or name as you prefer.
      const currencyOptions = uniqueCurrencies
        .map((curr) => ({
          value: curr.code, // This is critical, e.g., "USD"
          label: `${curr.code} – ${curr.name}${curr.symbol ? ' (' + curr.symbol + ')' : ''}`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
  
      return currencyOptions;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      return [];
    }
  };
  
  /**
   * Fetch exchange rates with the base set to PHP.
   * Returns an object where "rates.USD" means "1 PHP = X USD".
   */
  export const fetchConversionRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/PHP');
      const data = await response.json();
      return data.rates;
    } catch (error) {
      console.error('Error fetching conversion rates:', error);
      return {};
    }
  };
  
  /**
   * Convert income to PHP based on the selected currency and conversion rates.
   * @param {number} income - The income amount.
   * @param {string} currencyCode - The ISO currency code (e.g., "USD").
   * @param {object} conversionRates - The conversion rates object.
   * @returns {string} - The converted income in PHP, formatted to 2 decimal places.
   */
  export const convertIncomeToPHP = (income, currencyCode, conversionRates) => {
    if (isNaN(income)) return '0.00';
  
    // If the user is already in PHP, one "unit" is 1:1.
    if (currencyCode === 'PHP') {
      return income.toFixed(2);
    }
  
    const rateAgainstPHP = conversionRates[currencyCode];
  
    if (!rateAgainstPHP) {
      // If for some reason we don't have the rate for that currency, fallback.
      return income.toFixed(2);
    }
  
    // Calculate how many PHP the given income is.
    const convertedIncome = (income * (1 / rateAgainstPHP)).toFixed(2);
    return convertedIncome;
  };