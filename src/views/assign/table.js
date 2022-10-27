import { ref, reactive, toRefs, watch, onMounted } from "vue";
import { api } from "@/helper/api";
import Swal from "sweetalert2";
export default function useTable(
	page,
	page_size,
	pagination_size,
	method,
	url,
	queryParams,
	columns,
	emit
) {
	let state = reactive({
		rows: [],
		columns: columns,
		totals: 0,
		totals_page: 0,
		isLoading: false,
		pageArr: [],
		pageStart: 0,
		pageStop: 0,
		p_method: method,
		p_url: url,
		p_queryParams: {},
		params: queryParams,
	});
	let p_page = ref(page);
	let p_pagination_size = ref(pagination_size);
	let p_page_size = ref(page_size);
	const setPage = (p) => {
		p_page.value = p;
	};
	onMounted(async () => {
		// console.log("from hook");
		await getData();
		// await search("t5");
		state.pageStart = 1;
		state.pageStop =
			state.pageStart + p_pagination_size.value > state.totals_page
				? state.totals_page
				: state.pageStart + p_pagination_size.value - 1;
		setPageArr();
	});
	watch(p_page_size, async (v, v_old) => {
		state.totals_page = Math.ceil(state.totals / p_page_size.value);
		p_page.value =
			p_page.value > state.totals_page
				? state.totals_page
				: p_page.value;
		changePage();
	});
	watch(p_page, (v, v_old) => {
		changePage();
	});
	async function getData() {
		state.isLoading = true;
		let sorts = [];

		// console.log(state.columns);
		state.columns.forEach((it, i) => {
			if (it.sortable) {
				sorts.push({
					field: it.name,
					order: it.order,
				});
			}
		});

		state.p_queryParams = {
			page: p_page.value,
			page_size: p_page_size.value,
			sorts,
		};
		Object.keys(state.params).forEach((k, i) => {
			state.p_queryParams[k] = state.params[k];
		});

		try {
			const res = await api[state.p_method](
				state.p_url,
				state.p_queryParams
			);
			if (res && res.data) {
				if (res.data.status) {
					// assigns.value = res.data.assigns;
					state.rows = res.data.assigns.rows;
					state.totals = res.data.assigns.totals;
					state.totals_page = Math.ceil(
						state.totals / p_page_size.value
					);
					state.isLoading = false;
					return;
				}
				state.isLoading = false;
				state.rows = [];
				state.totals = 0;
				state.totals_page = 0;
				// changePage();
				Swal.fire({
					icon: "error",
					title: '<span style="color:red">แจ้งข้อผิดพลาด</span>',
					text: res.data.error,
				});
			}
		} catch (err) {
			console.log(err);
		}
	}
	const setOrder = (obj, order) => {
		obj.order = order;
		switch (order) {
			case "":
				obj.order = "desc";
			case "desc":
				obj.order = "asc";
				break;
			case "asc":
				obj.order = "desc";
				break;
		}
		changePage();
		console.log(obj.order);
	};
	const changePage = async () => {
		await getData();
		let now_range = Math.ceil(p_page.value / p_pagination_size.value);
		let max_page_now_range = now_range * p_pagination_size.value;

		let stop =
			max_page_now_range >= state.totals_page
				? state.totals_page
				: max_page_now_range;
		let start =
			stop - p_pagination_size.value < 1
				? 1
				: stop == state.totals_page
				? (now_range - 1) * p_pagination_size.value + 1
				: stop - p_pagination_size.value + 1;

		state.pageStart = start;
		state.pageStop = stop;
		setPageArr();
		// console.log(
		// 	`${now_range}%${stop}=${
		// 		now_range % stop
		// 	}  now_range=${now_range}  max_page_now_range=${max_page_now_range} start=${start}  stop=${stop}`
		// );
		// console.log(
		// 	`next=>${p_page} |page=>${p_page} | pageSart=>${pageStart} | pageStop=>${pageStop}`
		// );
	};
	const search = (txtSearch) => {
		state.rows = state.rows.value.filter((ob) => {
			let keys = Object.keys(ob);
			let tmp = [];
			keys.forEach((k) => {
				let t = String(ob[k]).includes(txtSearch);
				tmp.push(t);
			});
			return tmp.includes(true);
		});
	};
	const setPageArr = () => {
		let tmp = [];
		for (let i = state.pageStart; i <= state.pageStop; i++) {
			if (i > state.totals_page) break;
			tmp.push(i);
		}
		state.pageArr = tmp;
	};

	const next = () => {
		p_page.value++;
	};
	const prev = () => {
		p_page.value--;
	};
	const first = () => {
		p_page.value = 1;
	};
	const last = () => {
		p_page.value = state.totals_page;
	};
	const onRowClick = (e, index, row) => {
		// console.log("event target is td", e.target.is("td"));
		// if (e.target.classList.contains("formatter")) return;
		// console.log("formatter=", e.target.dataset["formatter"]);
		if (e.target.dataset["formatter"]) {
			// console.log("ok");
		} else {
			// console.log("no ok");
			emit("on-row-click", e, index, row);
		}
	};
	const setParams = (k, v) => {
		state.params[k] = v;
	};
	return {
		setPage,
		setPageArr,
		changePage,
		getData,
		search,
		setOrder,
		next,
		prev,
		first,
		last,
		onRowClick,
		setParams,
		p_page,
		p_pagination_size,
		p_page_size,
		...toRefs(state),
	};
}
