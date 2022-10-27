<template>
	<div class="jumbotron mx-2">
		<div class="container">
			<!-- <ul class="list-group">
				<li
					class="list-group-item"
					v-for="(user, i) of users"
					:key="Number(i)"
				>
					{{ user.name }}
					<div class="card">
						<div class="card-head">
							<div class="progress">
								<div
									class="progress-bar"
									role="progressbar"
									:style="{ width: user.jobs + '%' }"
									aria-valuenow="25"
									:aria-valuenow="user.jobs"
									aria-valuemin="0"
									aria-valuemax="100"
								>
									{{ user.jobs }}
								</div>
							</div>
						</div>
					</div>
				</li>
			</ul> -->
			<span class="badge badge-primary">2564</span>
			<hr />
			<div class="row justify-content-center">
				<div
					class="col-sm-12 col-md-3 card mx-1 my-1"
					v-for="(u, i) of users"
					:key="Number(i)"
				>
					<span
						class="badge badge-primary"
						style="position: absolute; top: -5px; right: -5px"
						>{{ u.jobs }}</span
					>
					<div class="card-head mt-2">
						<b>
							<i class="far fa-user"></i>&nbsp;{{ u.name }}
						</b>
						<div class="card-title my-0">
							idcode: 3459 ภาค 6
						</div>

						<div class="card-body px-0 pt-1">
							<ul class="list-group py-0">
								<li class="list-group-item py-1">
									งานใหม่
									<div
										class="
											badge badge-danger
											float-right
										"
									>
										{{ u.new }}
									</div>
								</li>
								<li class="list-group-item py-1">
									ระหว่างกำลังดำเนินการ
									<div
										class="
											badge badge-warning
											float-right
										"
									>
										{{ u.wait }}
									</div>
								</li>
								<li class="list-group-item py-1">
									ดำเนินการเรียบร้อยแล้ว
									<div
										class="
											badge badge-success
											float-right
										"
									>
										{{ u.success }}
									</div>
								</li>
								<li class="list-group-item py-1">
									ประเมินเรียบร้อยแล้ว
									<div
										class="
											badge badge-primary
											float-right
										"
									>
										{{ u.approve }}
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref } from "vue";

export default {
	setup() {
		const users = ref([
			{
				name: "แสงทอง หวลไข่",
				jobs: 1,
				new: 1,
				wait: 0,
				success: 0,
				approve: 0,
			},
			{
				name: "แสงทอง หวลไข่",
				jobs: 20,
				new: 5,
				wait: 5,
				success: 5,
				approve: 5,
			},
			{
				name: "แสงทอง หวลไข่",
				jobs: 3,
				new: 1,
				wait: 2,
				success: 0,
				approve: 0,
			},
			{
				name: "แสงทอง หวลไข่",
				jobs: 4,
				new: 5,
				wait: 5,
				success: 5,
				approve: 5,
			},
			{
				name: "แสงทอง หวลไข่",
				jobs: 400,
				new: 5,
				wait: 100,
				success: 100,
				approve: 195,
			},
			{
				name: "แสงทอง หวลไข่",
				jobs: 6,
				new: 1,
				wait: 2,
				success: 3,
				approve: 0,
			},
		]);
		return {
			users,
		};
	},
};
</script>

<style scoped>
.card ul li {
	font-size: 12px;
}
.card-head {
	font-size: 12px;
}
.card-title {
	font-size: 10px;
	color: rgba(201, 183, 183, 0.986);
}
</style>
