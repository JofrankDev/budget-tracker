import axios from "axios";
import {BASE_URL} from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    },
});

//Interceptor de la peticion
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Intercepetor de la respuesta

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401){
                window.location.href = "/login";
            } else if (error.response.status === 500){
                console.error("Server error. Intentalo mas tarde.")
            }
        }
        else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Por favor intenta de nuevo");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;