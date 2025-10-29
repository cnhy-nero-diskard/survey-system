import logger from "../middleware/logger.js";
export const queryHuggingFace = async (data, apiToken, modelUrl) => {
    logger.info("Querying Hugging Face model");
    logger.info(`Data: ${JSON.stringify(data)}`);
    logger.info(`API Token: ${apiToken}`);
    logger.info(`Model URL: ${modelUrl}`);
    data = {inputs: data};
    const queryModel = async () => {
        try {
            const response = await fetch(modelUrl, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            });

            const result = await response.json();
            logger.info(`Hugging Face response: ${JSON.stringify(result)}`);

            if (result.error && result.error.includes("503 Service Unavailable")) {
                // If the model is still loading, wait for the estimated time and retry
                const estimatedTime = 10; // seconds
                logger.info(`Model is loading. Retrying in ${estimatedTime} seconds...`);
                await new Promise((resolve) => setTimeout(resolve, estimatedTime * 1000));
                return queryModel(); // Retry the request
            }

            return result;
        } catch (error) {
            logger.error(`Error querying Hugging Face model: ${error.message}`);
            throw error;
        }
    };

    try {
        const result = await queryModel();
        return result;
    } catch (error) {
        logger.error(`Error querying Hugging Face model: ${error.message}`);
        throw error;
    }
};