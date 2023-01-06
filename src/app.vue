<template>
	<div class="wrapper" id="app">
		<nav id="sidebar" v-if="store.state.auth.isLogin && toggleClass">
			<div class="sidebar-header text-center" @click="toggle">
				<img
					src="./assets/img/02.png"
					width="150"
					height="100"
					class="mx-auto"
				/>
			</div>
			<ul class="list-unstyled components">
				<p><i class="fas fa-user-alt"></i> {{ fullname }}</p>
				<li :class="{ active: $route.path.includes('/main') }">
					<router-link to="/main"
						><i class="fas fa-home"></i>
						<span class="ml-3">DASHBOARD</span></router-link
					>
				</li>
				<li>
					<a
						href="#inform"
						data-toggle="collapse"
						aria-expanded="false"
						class="dropdown-toggle"
						id="ainform"
						><i class="far fa-bookmark"></i>
						<span class="ml-3">รับแจ้ง</span>
					</a>
					<ul class="collapse list-unstyled" id="inform">
						<!-- <li
							:class="{
								active: $route.path.includes(
									'/jobremain'
								),
							}"
						>
							<router-link to="/inform/jobremain">
								<i class="fas fa-circle-notch"></i>
								<span class="ml-3">งานค้าง</span>
							</router-link>
						</li> -->
						<li
							:class="{
								active: $route.path.includes(
									'/logbook'
								),
							}"
						>
							<router-link to="/inform/logbook">
								<i class="fas fa-bold"></i>
								<span class="ml-3">logbook</span>
							</router-link>
						</li>
						<!-- <li
							:class="{
								active: $route.path.includes(
									'/newjob'
								),
							}"
						>
							<router-link to="/inform/followup/newjob">
								<i class="fas fa-newspaper"></i>
								<span class="ml-3">เปิดงานใหม่</span>  
							</router-link>
						</li> -->
						<li
							:class="{
								active: $route.path.includes(
									'/followup'
								),
							}"
						>
							<router-link to="/inform/followup">
								<i class="fas fa-eye"></i>
								<span class="ml-3">ติดตามปัญหา</span>
							</router-link>
						</li>
					</ul>
				</li>
				<li :class="{ active: $route.path.includes('/assign') }">
					<router-link to="/assign/"
						><i class="fas fa-address-card"></i>
						<span class="ml-3">ระบบ assign</span></router-link
					>
				</li>
				<li :class="{ active: $route.path.includes('/repair') }">
					<router-link to="/repair/"
						><i class="fas fa-bug"></i>
						<span class="ml-3">ระบบรับซ่อม/ส่งคืน โปรแกรม</span></router-link
					>
				</li>
				<li :class="{ active: $route.path.includes('/kpi') }">
					<router-link to="/kpi/"
						><i class="fas fa-key"></i>
						<span class="ml-3">KPI</span></router-link
					>
				</li>
			
				<!-- <li :class="{ active: $route.path.includes('/think') }">
					<router-link to="/think/"
						><i class="fas fa-lightbulb"></i>
						<span class="ml-3">THINK TANK</span></router-link
					>
				</li> -->
				<li>
					<router-link to="/logout"
						><i class="fas fa-sign-out-alt"></i>
						<span class="ml-3">LOGOUT</span></router-link
					>
				</li>
			</ul>
		</nav>

		
		<div id="content" class="px-0 py-0">
			<nav class="navbar navbar-expand-lg navbar-light bg-light mb-0">
				<div class="container-fluid px-2 nav-bg">
					<button
						v-if="store.state.auth.isLogin && !toggleClass"
						type="button"
						id="sidebarCollapse"
						class="btn btn-info"
						style="position: absolute; top: 0; left: 0"
						@click="toggle"
					>
						<i class="fas fa-align-left"></i>
					</button>
				</div>
			</nav>

			<router-view class="mx-2 my-2"></router-view>
		</div>
	</div>
</template>

<script>
import { ref, computed, watch, nextTick } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
	setup() {
		const toggleClass = ref(true);
		const store = useStore();
		const route = useRoute();

		const toggle = () => {
			toggleClass.value = !toggleClass.value;
			if (route.path.includes("/inform") && toggleClass.value) {
				console.log(document.getElementById("ainform"));
				nextTick(() => {
					//รอให้ renderให้เสร็จก่อนแล้วค่อยทำงาน
					document.getElementById("ainform").click();
				});
			}
		};
		const fullname = computed(() => {
			let authData = store.getters["auth/getAuthData"];
			let user = authData.user[0];
			return user.emp_fname
				? `${user.emp_fname} ${user.emp_lname}`
				: "";
		});

		return {
			toggleClass,
			store,
			fullname,
			toggle,
		};
	},
};
</script>

<style>
@import "./assets/css/bootstrap.min.css";
@import "./assets/css/style.css";
@import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@100&display=swap");
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://fonts.googleapis.com/css2?family=Material+Icons+Outlined");

.form-control.is-invalid,
.was-validated .form-control:invalid {
	border-color: #dc3545;
	padding-right: calc(1.5em + 0.75rem);
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
	background-repeat: no-repeat;
	background-position: center right calc(0.375em + 0.1875rem);
	background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}
.nav-bg {
	background-image: url("./assets/img/H120X1024.jpg");
	width: 100%;
	height: 18vh;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}
</style>
