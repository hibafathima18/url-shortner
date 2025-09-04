import axios from "axios";
import { setAuthToken } from "../../../Logging Middleware/logger";

const AUTH_API_URL = "http://20.244.56.144/evaluation-service/auth";

const dummyRegistrationData = {
  email: "ramkrishna@abc.edu",
  name: "Ram Krishna",
  rollNo: "aalbb",
  accessCode: "xgASNC",
  clientID: "d9cbb699-6a27-44a5-8d59-8b1befa816da",
  clientSecret: "tVJaaaRBSeXcRXeM",
};

export const initializeLogger = async () => {
  try {
    const response = await axios.post(AUTH_API_URL, dummyRegistrationData);
    const token = response.data.access_token;
    if (token) {
      setAuthToken(token);
    }
  } catch (error) {
    console.log(error);
  }
};
