import store from "@/store/index.js";
import {
	createRouter,
	createWebHashHistory,
	createWebHistory,
} from "vue-router";
import NProgress from "nprogress";

async function beforeEnter(to, from, next) {
	if (to.path == "/logout") {
		store.dispatch("auth/logout");
		next("/");
		return;
	}
	const logined = store.getters["auth/getLoginStatus"];
	if (logined) {
		if (to.path == "/login") {
			next("/");
			return;
		}
		next();
		return;
	}
	if (to.path == "/login") {
		next();
		return;
	}
	next("/login");
}
const routes = [
	{
		path: "/",
		name: "index",
		component: () => import("../views/index.vue"),
		beforeEnter: beforeEnter,
	},
	{
		path: "/main",
		name: "main",
		component: () => import("../views/main.vue"),
		beforeEnter: beforeEnter,
	},
	{
		path: "/:pathMatch(.*)*",
		name: "PageNotFound",
		component: () => import("../views/notFound.vue"),
	},
	{
		path: `/inform/jobremain`,
		name: "jobremain",
		component: () => import("../views/inform/jobremain/index.vue"),
		beforeEnter: beforeEnter,
	},
	{
		path: `/inform/logbook`,
		name: "logbook",
		component: () => import("../views/inform/logbook/index.vue"),
		beforeEnter: beforeEnter,
	},
	{
		path: `/inform/followup`,
		name: "followup",
		component: () => import("../views/inform/followup/index.vue"),
		children: [
			{
				path:"",
				name:"followup-list",
				component: () => import("../views/inform/followup/followup-list.vue"),
			},
			{
				path:"newjob",
				name:"followup-newjob",
				component: () => import("../views/inform/followup/followup-newjob.vue"),
			},
			{
				path:":jobid/receive",
				name:"followup-receive",
				component: () => import("../views/inform/followup/followup-receive.vue"),
			},
			{
				path:":jobid/detail",
				name:"followup-detail",
				component: () => import("../views/inform/followup/followup-detail.vue"),
			},
			{
				path:":jobid/comment",
				name:"followup-comment",
				component: () => import("../views/inform/followup/followup-comment.vue"),
			},
			{
				path:":jobid/close",
				name:"followup-close",
				component: () => import("../views/inform/followup/followup-close.vue"),
			},
			{
				path:":jobid/feedbackmts",
				name:"followup-feedbackmts",
				component: () => import("../views/inform/followup/followup-feedbackmts.vue"),
			},
			{
				path:":jobid/sendback",
				name:"followup-sendback",
				component: () => import("../views/inform/followup/followup-sendback.vue"),
			},
			{
				path:":jobid/summarize",
				name:"followup-summarize",
				component: () => import("../views/inform/followup/followup-summarize.vue"),
			},
			{
				path:":jobid/receiverepair",
				name:"followup-receiverepair",
				component: () => import("../views/inform/followup/followup-receiverepair.vue"),
			},
			{
				path:":jobid/testprogram",
				name:"followup-testprogram",
				component: () => import("../views/inform/followup/followup-testprogram.vue"),
			},
		],
		beforeEnter: beforeEnter,
	},
	{
		path: `/assign`,
		name: "assign",
		component: () => import("../views/assign/index.vue"),
		children: [
			{
				path: "",
				name: "assign-index",
				component: () => import("../views/assign/list.vue"),
				props: true,
				beforeEnter: beforeEnter,
			},
			{
				path: "add",
				name: "assign-add",
				component: () => import("../views/assign/add.vue"),
				beforeEnter: beforeEnter,
			},
			{
				path: "edit/:id",
				name: "assign-edit",
				component: () => import("../views/assign/edit.vue"),
				beforeEnter: beforeEnter,
			},
		],
	},
	{
		path: `/repair`,
		name: "repair",
		component: () => import("../views/repair/index.vue"),
		children: [
			{
				path: "",
				name: "repair-list",
				component: () => import("../views/repair/repair-list.vue"),
			},	
			{
				path: ":jobid/new",
				name: "repair-new",
				component: () => import("../views/repair/repair-new.vue"),
			},	
			{
				path: ":docno/edit",
				name: "repair-edit",
				component: () => import("../views/repair/repair-edit.vue"),
			},	
		],
		beforeEnter: beforeEnter,
	},
	{
		path: "/kpi",
		name: "kpi",
		component: () => import("../views/kpi/index.vue"),
		children: [
			{
				path: "",
				name: "kpi-index",
				component: () => import("../views/kpi/list.vue"),
				beforeEnter: beforeEnter,
			},
		],
	},
	// {
	// 	path: `/think`,
	// 	name: "think",
	// 	component: () => import("../views/think/index.vue"),
	// 	children: [
	// 		{
	// 			path: "",
	// 			name: "think-index",
	// 			component: () => import("../views/think/list.vue"),
	// 			beforeEnter: beforeEnter,
	// 		},
	// 		{
	// 			path: "/post",
	// 			name: "think-post",
	// 			component: () => import("../views/think/post.vue"),
	// 			beforeEnter: beforeEnter,
	// 		},
	// 		{
	// 			path: "/edit/:id",
	// 			name: "think-edit",
	// 			component: () => import("../views/think/edit.vue"),
	// 			beforeEnter: beforeEnter,
	// 		},
	// 		{
	// 			path: "comment/:id",
	// 			name: "think-comment",
	// 			component: () => import("../views/think/comment.vue"),
	// 			beforeEnter: beforeEnter,
	// 		},
	// 	],
	// },
	{
		path: "/login",
		name: "login",
		component: () => import("../views/login.vue"),
		beforeEnter: beforeEnter,
	},
	{
		path: "/logout",
		name: "logout",
		component: null,
		beforeEnter: beforeEnter,
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.VITE_PRIVATE_BASE_URL),
	routes,
});
router.beforeResolve((to, from, next) => {
	// If this isn't an initial page load.
	if (to.name) {
		// Start the route progress bar.
		NProgress.start();
	}
	next();
});

router.afterEach((to, from) => {
	// Complete the animation of the route progress bar.
	NProgress.done();
});
export default router;
