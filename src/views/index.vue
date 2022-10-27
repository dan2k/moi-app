<template>
	<div class="container h-50">
		<loading v-if="isloading"></loading>
		<div class="row h-100 justify-content-center align-items-center">
			<div class="col-12">
				
				<h1 class="text-center">Welcome To <br />MOI APP</h1>
			</div>
		</div>
	</div>
</template>

<script>
import { onMounted, ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
// import Loading from "./loading.vue";
export default {
	components: {
		// Loading,
	},
	setup() {
		const router = useRouter();
		let isloading = ref(true);
		onMounted(() => {
			setTimeout(() => {
				router.push({ path: "/main/", replace: true });
			}, 500);
		});
		return { isloading };
	},
};
</script>

<style scoped></style>
