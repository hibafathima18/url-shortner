import axios from "axios";

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";
let authToken = "";

export const setAuthToken = (token) => {
  authToken = token;
};

export const log = async (stack, level, pacckage, message) => {
  if (!authToken) {
    return;
  }

  try {
    await axios.post(
      LOG_API_URL,
      {
        stack,
        level,
        pacckage,
        message: JSON.stringify(message),
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};
