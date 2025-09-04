import { useState, useCallback } from "react";

const STORAGE_KEY = "urlShortenerData";

const getInitialData = () => {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : {};
  } catch (error) {
    return {};
  }
};

export const useUrlStore = () => {
  const [urls, setUrls] = useState(getInitialData());

  const saveData = (newData) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setUrls(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const addUrls = useCallback((newUrls) => {
    const currentData = getInitialData();
    const updatedData = { ...currentData, ...newUrls };
    saveData(updatedData);
  }, []);

  const getAllUrls = useCallback(() => {
    return Object.values(getInitialData());
  }, []);

  const getUrlByShortcode = useCallback((shortCode) => {
    return getInitialData()[shortCode];
  }, []);

  const isShortcodeTaken = useCallback((shortCode) => {
    return !!getInitialData()[shortCode];
  }, []);

  const recordClick = useCallback((shortCode, clickData) => {
    const currentData = getInitialData();
    if (currentData[shortCode]) {
      currentData[shortCode].clicks.push(clickData);
      saveData(currentData);
    }
  }, []);

  return {
    urls,
    addUrls,
    getAllUrls,
    getUrlByShortcode,
    isShortcodeTaken,
    recordClick,
  };
};
