import axios from "axios";

const baseUrl = "https://www.themealdb.com/api/json/v1/1";

export const callAPI = async (
  endpoint,
  method,
  headers = {},
  params = {},
  data = {}
) => {
  const options = {
    url: baseUrl + endpoint,
    method,
    headers,
    params,
    data,
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Server responded with an error:", error.response.data);
      return { error: "Server error" };
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from the server");
      return { error: "No response from server" };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up the request:", error.message);
      return { error: "Request setup error" };
    }
  }
};
