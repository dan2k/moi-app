import { createApp } from "vue";
import App from "@/App.vue";
import "bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import "@/assets/js/fontawesome";
import "@/assets/js/regular";
import "@/assets/js/solid";

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import 'nprogress/nprogress.css';
import store from "@/store/index";
import router from "@/route/index";
import Loading from "@/views/loading.vue";
import VueApexCharts from "vue3-apexcharts";
import {FileUpload} from "@/plugins/fileupload"
import Maska from 'maska'
const app = createApp(App);
app.component('Loading',Loading);
app.use(VueSweetalert2);
window.Swal =  app.config.globalProperties.$swal;
app.use(store);
app.use(FileUpload,{size:300})
app.use(Maska);
app.config.devtools = true;
app.use(router);
app.use(VueApexCharts);
app.mount("#app");
// window.__VUE_DEVTOOLS_GLOBAL_HOOK__.store = app.constructor;
