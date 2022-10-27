<template>
	<div>
		<h1>assign</h1>
		<button class="btn btn-info" @click="hello">hello!!</button>
		<hr />
		<Test></Test>
	</div>
</template>

<script>
import { useStore } from "vuex";
import Test from "../../components/form/test.vue";
export default {
	components:{Test},
	setup() {
		const store = useStore();
		const hello = async () => {
			await store.dispatch("auth/hello");
			console.log(store.state.auth.hello);
		};
		return {
			hello,
		};
	},
};
</script>

<style></style>
