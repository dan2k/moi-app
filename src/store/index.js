import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { auth } from "./auth.module";
import SecureLS from "secure-ls";
// const ls = new SecureLS( {encodingType: 'aes',isCompression: true });
const ls = new SecureLS({
	encodingType: "des",
	isCompression: true,
	encryptionSecret: import.meta.env.VITE_PRIVATE_TOKEN_KEY,
});
const authState = createPersistedState({
	paths: ["auth"],
	key: "moi-app",
	// storage:window.localStorage,
	storage: {
		getItem: (key) => ls.get(key),
		setItem: (key, value) => ls.set(key, value),
		removeItem: (key) => ls.remove(key),
	},
});

const store = createStore({
	modules: {
		auth,
	},
	strict: true,
	plugins: [authState],
});

export default store;
// export default app;
