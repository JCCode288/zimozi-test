import axios from "axios";

// Create axios instance with the correct base URL
const Axios = axios.create({
   baseURL: process.env.BE_URL, // This should be set in your .env file
});

// Add a more robust request interceptor to ensure auth headers are added

Axios.interceptors.request.use(async (req) => {
   try {
      // Check if we're in a browser environment

      // Add ngrok header to bypass browser warning
      req.headers["ngrok-skip-browser-warning"] = true;

      return req;
   } catch (error) {
      console.error("Error in Axios request interceptor:", error);
      return req;
   }
});

Axios.interceptors.response.use(
   (res) => {
      console.log("API Response:", {
         url: res.config.url,
         status: res.status,
         statusText: res.statusText,
      });
      return Promise.resolve(res);
   },
   (err) => {
      console.error("API Error:", {
         url: err.config?.url,
         status: err.response?.status,
         statusText: err.response?.statusText,
         message: err.message,
         data: err.response?.data,
      });
      throw err;
   }
);

export default Axios;
