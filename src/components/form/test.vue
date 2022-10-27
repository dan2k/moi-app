<template>
	<div class="form-row">
		<div class="col-3">
			<InputComponent :v="v.name" label="ชื่อ"></InputComponent>
			<text-area-component
				:v="v.detail"
				label="รายละเอียด"
			></text-area-component>
			<date-component :v="v.date" label="วันที่"></date-component>
			<!-- <date-component2 label="วันที่ 2" :v="v.date2"></date-component2> -->
			<!-- <pre>{{ v.date }}</pre> -->
		</div>
		<div class="col-3">
			<div class="form-group" style="position: relative">
				<label for="x">xxx</label>
				<input
					type="test"
					class="form-control"
					@click="onSet(true)"
					@blur="onSet(false)"
				/>
				<div
					v-if="isShow"
					style="
						position: absolute;
						top: 30;
						left: 0;
						width: 200;
						height: 50;
						background-color: blue;
					"
				>
					xxxxxxxxxxxxxxxx{{ isShow }}xxxxxxxxxxxxxx
				</div>
				{{ isShow }}
			</div>
		</div>
		<div class="col-3">
			<date-component3></date-component3>
		</div>
	</div>
	<button class="btn btn-primary" @click="v.$reset">reset</button>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { ref, computed } from "vue";
import InputComponent from "./InputComponent.vue";
import TextAreaComponent from "./TextAreaComponent.vue";
import DateComponent from "./DateComponent.vue";
import DateComponent2 from "./DateComponent2.vue";
import DateComponent3 from "./DateComponent3.vue";
export default {
	components: {
		InputComponent,
		TextAreaComponent,
		DateComponent,
		DateComponent2,
		DateComponent3,
	},
	setup() {
		const name = ref("");
		const detail = ref("");
		const date = ref(new Date());
		const date2 = ref(null);
		const isShow = ref(false);
		const rules = computed(() => ({
			name: {
				required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
			},
			detail: {
				required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
			},
			date: {
				required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
			},
			date2: {
				required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
			},
		}));
		const v = useVuelidate(rules, { name, detail, date, date2 });
		function onSet(t) {
			isShow.value = t;
			console.log(isShow.value);
		}

		return { v, onSet, onSet, isShow };
	},
};
</script>
