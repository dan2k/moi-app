import axios from "axios";
import store from "@/store/index.js";
import {useRoute} from "vue-router";
const route=useRoute();
const obj = axios.create({
	// baseURL: "https://www.controldata.co.th/mpsicc/moi-app/server/api",
	baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
	timeout: 10000,
	params: {}, // do not remove this, its added to add params later in the config
});
obj.interceptors.request.use(
	function (config) {
		const authData = store.getters["auth/getAuthData"];
		if (authData.accessToken) {
			config.headers = {
				Authorization: `Bearer ${authData.accessToken}`,
				// "Content-Type": "multipart/form-data",
				"Content-Type": "Application/json",
				// "Content-Type":"application/x-www-form-urlencoded",
			};
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);
obj.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const authData = store.getters["auth/getAuthData"];
		console.log(error.response);
		if(error.response.status==500 && error.response.data=='Expired token'){
			console.log(store.getters["auth/getPreUrl"]);
			await store.dispatch("auth/logout");
			return false;
			
		}
		if (error.response.status === 401) {
			const res = await api
				.post("/auth/v1/refresh", { token: authData.refreshToken })
				.catch(async (err) => {
					await store.dispatch("auth/logout");
				});
			// alert(res.data.access_token);
			// console.log("----------------------------");
			// console.log("res=", res.data.access_token);
			// console.log("----------------------------");
			const payload = {
				user: authData.user,
				access_token: res.data.access_token,
				refresh_token: authData.refreshToken,
			};

			await store.dispatch("auth/saveTokensToStorage", payload);
			error.config.headers[
				"Authorization"
			] = `Bearer ${res.data.access_token}`;
			return axios(error.config);
		} else {
			return Promise.reject(error);
		}
	}
);
export const api = obj;
