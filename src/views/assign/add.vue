<template>
	<div class="jumbotron mx-2 py-2 col-7  mx-auto">
		<div class="container mx-auto">
			<h5 class="mx-auto text-center text-primary">
				<i class="fas fa-save"></i> <u>บันทึกงานที่ได้รับมอบหมาย</u>
			</h5>
			<form
				ref="form"
				@submit.prevent="submit"
				class="needs-validation"
				novalidate
			>
				<div class="form-row">
					<div class="col-10">
						<input-component
							label="หัวข้องาน"
							:v="v.title"
						></input-component>
					</div>
					<div class="col-12"></div>
					<div class="col-12">
						<text-area-component
							label="รายละเอียด"
							:v="v.detail"
						></text-area-component>
					</div>
					<div class="col-12"></div>
					<div class="col-4">
						<date-component
							label="กำหนดเสร็จ"
							:v="v.end_date"
						></date-component>
					</div>
					<div class="col-4">
						<select-component
							label="ผุ้มอบหมายงาน"
							:v="v.emp_assign"
							:obj="assigner"
						></select-component>
					</div>
					<div class="col-12"></div>
					<div class="col-12 text-center">
						<button class="btn btn-primary mr-2 ">
							<i class="fas fa-save"></i> บันทึก
						</button>
						<button
							class="btn btn-danger mr-2  "
							type="reset"
							@click="reset()"
						>
							<i class="fas fa-redo-alt"></i> ยกเลิก
						</button>
						<button
							class="btn btn-warning "
							type="button"
							@click="router.back()"
						>
							<i class="fas fa-arrow-alt-circle-left"></i>
							ย้อนกลับ
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { ref, reactive, computed, onMounted } from "vue";
import InputComponent from "@/components/form/InputComponent.vue";
import TextAreaComponent from "@/components/form/TextAreaComponent.vue";
import DateComponent from "@/components/form/DateComponent.vue";
import SelectComponent from "@/components/form/SelectComponent.vue";
import Swal from "sweetalert2";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { api } from "@/helper/api";
import moment from "moment";
export default {
	components: {
		InputComponent,
		TextAreaComponent,
		DateComponent,
		SelectComponent,
	},
	setup() {
		const router = useRouter();
		const route = useRoute();
		const store = useStore();
		let assigner = ref([]);
		const state = reactive({
			title: "",
			detail: "",
			end_date: null,
			emp_assign: null,
			emp_solve: "",
		});
		const rules = computed(() => ({
			title: {
				required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
			},
			detail: {
				required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
			},
			end_date: {
				required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
			},
			emp_assign: {
				required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
			},
			emp_solve: {},
		}));

		const v = useVuelidate(rules, state);
		onMounted(async () => {
			try {
				const res = await api.get("/assign/v1/getAssigner");
				if (res && res.data) {
					if (res.data.status) {
						assigner.value = res.data.data;

						return;
					}
					Swal.fire({
						icon: "error",
						title:
							'<span style="color:red">แจ้งข้อผิดพลาด</span>',
						text: response.data.error,
					});
				}
			} catch (err) {
				console.log(err);
			}
		});
		async function submit() {
			this.v.$touch();
			if (this.v.$error) return;
			const authData = store.getters["auth/getAuthData"];
			state["emp_solve"] = authData.user[0].emp_id;
			state["end_date"] = moment(state.end_date).format("YYYY-MM-DD");
			const response = await api
				.post("/assign/v1/add", state)
				.catch((err) => {
					console.log(err);
				});
			if (response && response.data) {
				// router.push({ name: "assign-index", replace: true });
				if (response.data.status) {
					router.push({ name: "assign-index", replace: true });
					return;
				}
				Swal.fire({
					icon: "error",
					title: '<span style="color:red">แจ้งข้อผิดพลาด</span>',
					text: response.data.error,
				});
			}
		}
		function reset() {
			self = this;
			Object.keys(state).forEach((k) => {
				self.v[k].$model = "";
			});
			self.v.$reset();
		}
		return { v, state, submit, reset, router, assigner };
	},
};
</script>

<style></style>
