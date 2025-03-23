import axios from "axios";

const axiosConfig = axios.create({
	baseURL: "https://195-35-45-82.sslip.io:8000/api", // Update with your backend API URL
});

export default axiosConfig;
