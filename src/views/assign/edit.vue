<template>
	<div class="jumbotron mx-2 py-2 col-9 mx-auto">
		<div class="container mx-auto">
			<h5 class="mx-auto text-center text-primary">
				<i class="fas fa-save"></i>
				<u>ปรับปรุงงานที่ได้รับมอบหมาย</u>
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
							v-model="state.title"
							:disabled="(level==1 || Number(state.status)==3)"
						></input-component>
					</div>
					<div class="col-12"></div>
					<div class="col-12">
						<text-area-component
							label="รายละเอียด"
							:v="v.detail"
							v-model="state.detail"
							:disabled="(level==1 || Number(state.status)==3)"
						></text-area-component>
					</div>
					<div class="col-12"></div>
					<div class="col-12">
						<text-area-component
							label="ผลการดำเนินงาน"
							:v="v.solve_detail"
							v-model="state.solve_detail"
							:disabled="(level==1 || Number(state.status)==3)"
						></text-area-component>
					</div>
					<div class="col-12"></div>
					<div class="col-4">
						<select-component
							label="สถานะ"
							:v="v.status"
							:obj="status"
							v-model="state.status"
							:disabled="(level==1 || Number(state.status)==3)"
						></select-component>
					</div>
					<div class="col-4">
						<input-component
							label="กำหนดเสร็จ"
							:v="v.end_date"
							v-model="state.end_date"
							readonly
							:disabled="(level==1 || Number(state.status)==3)"
						></input-component>
					</div>
					<div class="col-4">
						<date-component
							label="วันที่ดำเนินการเสร็จ"
							:v="v.solve_date"
							v-model="state.solve_date"
							:disabled="(level==1 || Number(state.status)==3)"
						></date-component>
					</div>
					<div class="col-12"></div>
					<div
						class="col-12"
						v-if="Number(state.status) > 1 && level == 1"
					>
						<!-- v-if="level == 1 && state.status == 3" -->
						<div
							class="border border-info rounded px-5 py-2 my-3"
						>
							<div class="text-center">
								<b><u>ประเมินผลการทำงาน</u></b>
							</div>
							<div class="col-12"></div>
							<div class="form-row">
								<div class="col">
									<radio-component
										ref="time"
										v-model="state.time"
										:v="v.time"
										label="วันที่ดำเนินการเสร็จ&nbsp;&nbsp;"
										:obj="times"
										:inline="true"
										:disabled="level != 1"
										name="time"
									></radio-component>
								</div>
							</div>
							<div class="form-row">
								<div class="col">
									<radio-component
										ref="quality"
										v-model="state.quality"
										:v="v.quality"
										label="คุณภาพงาน&nbsp;&nbsp;"
										:obj="qualities"
										:inline="true"
										:disabled="level != 1"
										name="quality"
									></radio-component>
								</div>
							</div>
						</div>
					</div>
					<div class="col-12 text-center">
						<button
							class="btn btn-primary mr-2"
							v-if="level > 1"
							:disabled="
								!(
									emp_id == state.emp_solve &&
									state.status < 3
								)
							"
						>
							<i class="fas fa-save"></i> ปรับปรุง
						</button>
						<button
							class="btn btn-primary mr-2"
							v-if="level == 1"
							:disabled="!(level == 1 && state.status > 1)"
						>
							<i class="fas fa-save"></i> ประเมิน
						</button>
						<button
							
							class="btn btn-danger mr-2"
							type="button"
							@click="reset()"

						>
							<i class="fas fa-redo-alt"></i> ยกเลิก
						</button>
						<button
							class="btn btn-warning"
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
		<!-- <pre>{{ v.status }}{{ v.solve_detail }}</pre> -->
	</div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { ref, reactive, computed, onMounted } from "vue";
import InputComponent from "@/components/form/InputComponent.vue";
import TextAreaComponent from "@/components/form/TextAreaComponent.vue";
import DateComponent from "@/components/form/DateComponent.vue";
import RadioComponent from "@/components/form/RadioComponent.vue";
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
		RadioComponent,
	},
	setup() {
		const router = useRouter();
		const route = useRoute();
		const store = useStore();
		const user = store.getters["auth/getAuthData"].user[0];
		const level = ref(user.level || null);
		const emp_id = ref(user.emp_id || null);
		let status = ref([]);
		let tmp = {};
		const state = reactive({
			title: "",
			detail: "",
			solve_detail: "",
			end_date: null,
			solve_date: null,
			status: "",
			time: "",
			quality: "",
		});
		const times = ref([
			{ value: 1, label: "ช้ากว่ากำหนด" },
			{ value: 2, label: "ตรงตามกำหนด" },
			{ value: 3, label: "ก่อนกำหนด" },
		]);
		const qualities = ref([
			{ value: 1, label: "ควรปรับปรุง" },
			{ value: 2, label: "พอใช้" },
			{ value: 3, label: "ดี" },
			{ value: 4, label: "ดีมาก" },
		]);
		let isRequired =
			level.value == 1 && state.status == 3
				? {
						required: helpers.withMessage(
							"ห้ามเป็นค่าว่าง",
							required
						),
				  }
				: {};
		const rules = computed(() => ({
			title: {
				required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
			},
			detail: {
				required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
			},
			solve_detail: {
				required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
			},
			end_date: {},
			solve_date: {
				required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
			},
			status: {
				required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
			},
			time: isRequired,
			quality: isRequired,
		}));

		const v = useVuelidate(rules, state);
		onMounted(async () => {
			try {
				const res1 = await api.get(
					`/assign/v1/assign/${route.params.id}`
				);
				if (res1 && res1.data) {
					if (res1.data.status) {
						tmp = res1.data.data[0];
						state.title = tmp.title;
						state.detail = tmp.detail;
						state.solve_detail = tmp.solve_detail;
						state.end_date = tmp.end_date2;
						state.solve_date = tmp.solve_date
							? new Date(tmp.solve_date)
							: new Date();
						state.status = tmp.status;
						state.time = tmp.time;
						state.quality = tmp.quality;
						state.emp_solve = tmp.emp_solve;
					} else {
						throw res1.data.error;
					}
				}
				const res = await api.get("/assign/v1/status");
				if (res && res.data) {
					if (res.data.status) {
						status.value = res.data.data.filter((it, i) => {
							if (state.status == 0) {
								return ["1", "2"].includes(it.id);
							} else if (state.status == 1) {
								return ["2"].includes(it.id);
							} else if (state.status == 2) {
								if (level.value == 1) {
									return ["3"].includes(it.id);
								} else {
									return ["2"].includes(it.id);
								}
							} else if (state.status == 3) {
								return ["3"].includes(it.id);
							}
						});
						if (state.status == 0) {
							state.status = "1";
						} else if (state.status == 1) {
							state.status = 2;
						} else if (state.status == 2) {
							if (level.value == 1) {
								state.status = 3;
							} else {
								state.status = 2;
							}
						} else if (state.status == 3) {
							state.status = 3;
						}
					} else {
						throw res.data.error;
					}
				}
			} catch (err) {
				console.log(err);
				Swal.fire({
					icon: "error",
					title: '<span style="color:red">แจ้งข้อผิดพลาด</span>',
					text: err,
				});
			}
		});
		async function submit() {
			this.v.$touch();
			if (this.v.$error) return;
			const authData = store.getters["auth/getAuthData"];
			state["upd_emp"] = authData.user[0].emp_id;
			state["solve_date"] = moment(state.solve_date).format(
				"YYYY-MM-DD"
			);
			state["job_id"] = route.params.id;
			state["level"] = level.value;
			try {
				const response = await api.post("/assign/v1/edit", state);
				if (response.data.status) {
					router.push({
						name: "assign-index",
						replace: true,
					});
					return;
				}
				throw response.data.error;
			} catch (err) {
				console.log(err);
				Swal.fire({
					icon: "error",
					title: '<span style="color:red">แจ้งข้อผิดพลาด</span>',
					text: err,
				});
			}
		}
		function reset() {
			self = this;
			// Object.keys(state).forEach((k) => {
			// 	self.v[k].$model = "";
			// });
			state.title = tmp.title;
			state.detail = tmp.detail;
			state.solve_detail = tmp.solve_detail;
			state.end_date = tmp.end_date2;
			state.solve_date = new Date(tmp.solve_date);
			state.status = tmp.status;
			state.time = tmp.time;
			state.quality = tmp.quality;
			state.emp_solve = tmp.emp_solve;
			if (state.status == 0) {
				state.status = "1";
			} else if (state.status == 1) {
				state.status = 2;
			} else if (state.status == 2) {
				state.status = 2;
			} else if (state.status == 3) {
				state.status = 3;
			}

			self.v.$reset();
		}
		return {
			v,
			state,
			submit,
			reset,
			router,
			status,
			times,
			qualities,
			level,
			emp_id,
		};
	},
};
</script>

<style></style>
