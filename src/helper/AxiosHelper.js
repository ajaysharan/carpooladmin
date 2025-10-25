// lib/api.js
import axios from "../utils/axios";

// const commonHeaders = () => {
//   axios.defaults.withCredentials = true;
// };

const errorData = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      data: error.response.data,
      message: error.response.data?.message || "Something went wrong",
    };
  } else if (error.request) {
    return {
      status: 500,
      data: null,
      message: "No response from server",
    };
  } else {
    return {
      status: 500,
      data: null,
      message: error.message,
    };
  }
};
const AxiosHelper = {
  getData: async (url, params = {}) => {
    // console.log("GET CONSOLE: ", url);
    try {
      const response = await axios.get(url, { params, withCredentials: true });
      // console.log("GET RESPONSE: ",response);
      return response.data;
    } catch (error) {
      return errorData(error);
    }
  },
  postData: async (url, data = {}, isFormData = false) => {
    try {
      const response = await axios.post(url, data, {
        headers: isFormData
          ? {
              "Content-Type": "multipart/form-data",
              Accept: "multipart/form-data",
            }
          : {},
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return errorData(error);
    }
  },
  putData: async (url, data = {}, isFormData = false) => {
    try {
      const headers = isFormData
        ? {
            Accept: "application/json", // ✅ Don't manually set Content-Type
          }
        : {};
  
      const response = await axios.put(url, data, {
        headers,
        withCredentials: true,
      });
  
      return response.data;
    } catch (error) {
      return errorData(error);
    }
  },
  
    // putData: async (url, data = {}, isFormData = false) => {
    //   try {
      
    //     const response = await axios.put(url, data, {
    //       headers: isFormData
    //         ? {
    //             "Content-Type": "multipart/form-data",
    //             Accept: "multipart/form-data",
    //           }
    //         : {},
    //       withCredentials: true,
    //     });

    //     return response.data;
    //   } catch (error) {
    //     return errorData(error);
    //   }
    // },
  
    
  deleteData: async (url) => {
    try {
      const response = await axios.delete(url, { withCredentials: true });
      return response.data;
    } catch (error) {
      return errorData(error);
    }
  },
};

export default AxiosHelper;
