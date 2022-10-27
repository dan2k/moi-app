<template>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-sm-2 col-md-2 col-lg-2"></div>
			<div class="col-10 col-sm-7 col-md-4">
				<div class="card">
					<div class="card-header text-center">
						<h3>เข้าระบบ</h3>
					</div>
					<div class="card-body">
						<form @submit.prevent="submit">
							<div class="form-group">
								<label for="idcode">IDCODE:</label>
								<input
									type="text"
									class="form-control"
									v-model="user.idcode"
									id="idcode"
									placeholder=""
									name="idcode"
								/>
							</div>
							<div class="form-group">
								<label for="password">PASSWORD:</label>
								<input
									type="password"
									class="form-control"
									v-model="user.password"
								/>
							</div>
							<div class="text-center">
								
								<button
									class="btn btn-success mr-2"
									type="submit"
								>
									ตกลง
								</button>
								<button
									class="btn btn-danger"
									type="reset"
									@click="reset"
								>
									ยกเลิก
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { reactive } from "vue";
import { useStore } from "vuex";
import Swal from 'sweetalert2';
export default {
	setup() {
		const user = reactive({
			idcode: "",
			password: "",
		});
		const store = useStore();
		const reset = () => {
			user.idcode = "";
			user.password = "";
		};
		
		const submit = async () => {
			if (!user.idcode) {
				alert("กรุณาระบุ idcode");
				return;
			}
			if (!user.password) {
				alert("กรุณาระบุ password");
				return;
			}
			await store.dispatch("auth/login", user);
		};
		return {
			user,
			reset,
			submit,
			
		};
	},
};
</script>

<style></style>
