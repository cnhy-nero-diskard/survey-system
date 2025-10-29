// storageUtils.js
export const saveToLocalStorage = (key, data) => {
    try {
        const serializedData = JSON.stringify(data);
        sessionStorage.setItem(key, serializedData);
        console.log(`[SESSIONSTORAGE] ---> Saved key ${key} with data ${JSON.stringify(data)}`);
    } catch (error) {
        console.error('Error saving to sessionStorage:', error);
    }
};

export const loadFromLocalStorage = (key) => {
    try {
        const serializedData = sessionStorage.getItem(key);
        if (serializedData === null) {
            return null;
        }
        console.log(`[SESSIONSTORAGE] ---> Loaded key ${key} with data ${JSON.stringify(serializedData)}`);
        return JSON.parse(serializedData);
    } catch (error) {
        console.error('Error loading from sessionStorage:', error);
        return null;
    }
};

export const clearLocalStorage = (key) => {
    try {
        sessionStorage.removeItem(key);
        console.log(`Cleared sessionStorage key: ${key}`);
    } catch (error) {
        console.error('Error clearing sessionStorage:', error);
    }
};

// Make clearSessionStorage globally accessible (optional)
window.clearSessionStorageFromConsole = (key) => {
    try {
        sessionStorage.removeItem(key);
        console.log(`Cleared sessionStorage key: ${key}`);
    } catch (error) {
        console.error('Error clearing sessionStorage:', error);
    }
};