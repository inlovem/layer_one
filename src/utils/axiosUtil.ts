import axios from "axios";

export const makeRequest = (method: string, url: string, data?: any) => {
    return axios({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${process.env.ANYTHINGLLM_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    });
  };