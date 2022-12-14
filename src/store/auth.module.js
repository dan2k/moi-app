import { api } from "@/helper/api";
import router from "@/route";
import Swal from "sweetalert2";
export const auth = {
	namespaced: true,
	state: () => ({
		isLogin: false,
		hello: {},
		authData: {
			user: null,
			accessToken: null,
			refreshToken: null,
		},
	}),
	mutations: {
		logout: async (state) => {
			state.authData.user = null;
			state.authData.accessToken = null;
			state.authData.refreshToken = null;
			state.isLogin = false;
			router.push({ path: "/", replace: true });
		},
		hello: (state, payload) => {
			state.hello = { data: payload };
		},
		saveTokenData(state, data) {
			state.authData.user = data.user;
			state.authData.accessToken = data.access_token;
			state.authData.refreshToken = data.refresh_token;
		},
		setLoginStatus(state, value) {
			state.isLogin = value;
		},
	},
	actions: {
		async login({ commit, dispatch }, payload) {
			const response = await api
				.post("/auth/v1/login", payload)
				.catch((err) => {
					commit("logout");
					Swal.fire({
						icon: "error",
						title:
							'<span style="color:red">แจ้งข้อผิดพลาด</span>',
						text: err,
					});
					console.log(err);
				});
			if (response && response.data) {
				if (response.data.status) {
					commit("saveTokenData", response.data);
					commit("setLoginStatus", true);
					router.replace({ path: "/" });
					return;
				}
				Swal.fire({
					icon: "error",
					title: '<span style="color:red">แจ้งข้อผิดพลาด</span>',
					text: response.data.error,
				});
			}
			commit("setLoginStatus", false);
			commit("logout");
		},
		logout: ({ commit }) => {
			commit("logout");
		},
		hello: async ({ commit }) => {
			let res = await api.get("/auth/v1/hello").catch((err) => {
				console.log(err);
			});
			let data = null;
			if (res && res.data) {
				data = res.data;
			} else {
				data = "failed";
			}
			commit("hello", data);
		},
		saveTokensToStorage({ commit }, payload) {
			commit("saveTokenData", payload);
		},
	},
	getters: {
		getLoginStatus(state) {
			return !!state.isLogin;
		},
		getAuthData(state) {
			return state.authData;
		},
	},
};
