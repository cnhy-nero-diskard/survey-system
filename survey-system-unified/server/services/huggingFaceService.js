import logger from '../middleware/logger.js';
export const queryHuggingFace = async (data, apiToken, modelUrl, maxRetries = 3) => {
  logger.info('Querying Hugging Face model');
  logger.info(`Data: ${JSON.stringify(data)}`);
  logger.info(`Model URL: ${modelUrl}`);
  const requestData = { inputs: data };
  let retryCount = 0;

  try {
    while (true) {
      const response = await fetch(modelUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      logger.info(`Hugging Face response: ${JSON.stringify(result)}`);

      if (result.error && result.error.includes('503 Service Unavailable')) {
        if (retryCount >= maxRetries) {
          throw new Error(
            `Hugging Face model loading retry limit reached after ${retryCount} retries: ${result.error}`
          );
        }

        // If the model is still loading, wait for the estimated time and retry
        const estimatedTime = 10; // seconds
        retryCount += 1;
        logger.info(`Model is loading. Retrying in ${estimatedTime} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, estimatedTime * 1000));
        continue;
      }

      return result;
    }
  } catch (error) {
    logger.error(`Error querying Hugging Face model: ${error.message}`);
    throw error;
  }
};
