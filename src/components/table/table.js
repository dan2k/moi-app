import { api } from "@/helper/api";
import { reactive, toRefs } from "vue";
export function useTable(props, emit) {
	const store = reactive({
		url: props.url,
		rows: [],
		headers: props.headers,
		mode: props.mode,
		page: props.activePage,
		size: props.rowsSize,
		isAll: false,
		totalRows: 0,
		totalPages: 0,
		currentPagination: 1,
		totalPaginations: 0,
		paginationSize: props.widthPagination,
		paginationArray: [],
		filters: [],
		queryParams: [],
		txtSearch: "",
		isLoading: false,
	});
	const setFilter = (k, opt, v) => {
		let co = store.filters.reduce((c, it) => {
			return it.name == k ? c + 1 : c + 0;
		}, 0);
		if (co > 0) {
			store.filters.forEach((it, i) => {
				if (it.name == k) {
					it.opt = opt;
					it.value = v;
				}
			});
		} else {
			store.filters.push({ name: k, opt: opt, value: v });
		}
	};
	const getFilter = () => store.filters;
	const setParam = (obj) => {
		store.queryParams = obj;
	};
	const getData = async () => {
		store.isLoading = true;
		if (props.mode === "server") {
			let arrSort = store.headers
				.filter((it, i) => it.sortable && it.order != "")
				.map((it, i) => {
					let ob = { name: it.name, order: it.order };
					return ob;
				});

			await api
				.post(`${store.url}`, {
					page: store.page - 1,
					size: store.size,
					sort: arrSort,
					filters: store.filters,
					params: store.queryParams,
					txtSearch: store.txtSearch,
				})
				.then((res) => {
					store.rows = res.data.rows;
					store.totalRows = res.data.totals;
					emit("onLoadSuccess", store.rows);
				});
		} else {
			//client
			let tmp = [];
			let tmpdata = props.data;

			store.filters.forEach((it, i) => {
				if (it.value != "ทั้งหมด") {
					tmpdata = tmpdata.filter((it1, i1) => {
						return String(it1[it.name]).includes(it.value);
					});
				}
			});

			if (store.txtSearch != "") {
				tmpdata = tmpdata.filter((it, i) => {
					return search(it, store.txtSearch);
				});
			}
			tmpdata.forEach((it, i) => {
				if (
					i >= store.page - 1 &&
					i <= store.page - 1 + (store.size - 1)
				)
					tmp.push(it);
			});

			store.rows = tmp;
			store.rows = tmp.map((it, i) => it);

			store.totalRows = tmpdata.length;
		}
		store.totalPages = Math.ceil(store.totalRows / store.size);

		store.rows.forEach((r, i) => {
			store.rows[i].state = false;
		});

		genPagination();
		store.isLoading = false;
	};
	const genPagination = () => {
		store.paginationArray = [];
		store.currentPagination =
			store.page <= store.paginationSize + 1
				? 1
				: Math.ceil((store.page - 1) / store.paginationSize);
		let start = 0;
		if (store.currentPagination == 1) {
			start = 2;
		} else {
			start = store.paginationSize * (store.currentPagination - 1) + 2;
		}
		store.totalPaginations = Math.ceil(
			store.totalPages / store.paginationSize
		);
		let stop = 0;
		if (store.currentPagination == store.totalPaginations) {
			stop = store.totalPages - 1;
		} else {
			stop = start + (store.paginationSize - 1);
		}
		let j = 0;
		for (let i = start; i <= stop; i++) {
			store.paginationArray[j] = i;
			j++;
		}
	};
	/* const search = (obj, txtSearch) => {
    obj = obj.filter((ob) => {
      let keys = Object.keys(ob);
      let tmp = [];
      keys.forEach((k) => {
        let t = String(ob[k]).includes(txtSearch);
        tmp.push(t);
      });
      return tmp.includes(true);
    });
  }; */

	const search = (ob, txtSearch) => {
		let keys = Object.keys(ob);
		let tmp = [];
		keys.forEach((k) => {
			let t = String(ob[k])
				.toLowerCase()
				.includes(txtSearch.toLowerCase());
			tmp.push(t);
		});
		return tmp.includes(true);
	};

	const sort = (obj) => {
		let r = "";
		switch (obj.order) {
			case "":
				r = "asc";
				break;
			case "asc":
				r = "desc";
				break;
			case "desc":
				r = "asc";
				break;
		}

		store.headers = store.headers.map((it, i) => {
			it.order = it.name == obj.name ? r : "";
			return it;
		});
		if (props.mode == "client") {
			props.data.sort(compareValues(obj.name, obj.order));
		}
		getData();
	};
	// singers.sort(compareValues('band'));
	const compareValues = (key, order = "asc") => {
		return function innerSort(a, b) {
			if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
				// property doesn't exist on either object
				return 0;
			}

			const varA =
				typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
			const varB =
				typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

			let comparison = 0;
			if (varA > varB) {
				comparison = 1;
			} else if (varA < varB) {
				comparison = -1;
			}
			return order === "desc" ? comparison * -1 : comparison;
		};
	};
	const selectAll = (e) => {
		let checked = e.target.checked;
		store.rows.forEach((r, i) => {
			store.rows[i].state = checked;
		});
		setAll();
		if (checked) {
			emit("onSelectAll");
		} else {
			emit("onUnSelectAll");
		}
	};
	const setAll = () => {
		store.isAll =
			store.rows.length ==
			store.rows.reduce((p, c) => {
				let t = c.state ? 1 : 0;
				return Number(p) + Number(t);
			}, 0);
	};
	const select = (row, i) => {
		row.state = !row.state;
		setAll();
		if (row.state) {
			emit("onSelect", { row, i });
		} else {
			emit("onUnSelect", { row, i });
		}
	};
	const getSelect = () => {
		let a = store.rows.filter((it, i) => it.state);
		emit("onGetSelect", a);
		return store.rows.filter((it, i) => it.state);
	};
	const clickRow = (e, row, i) => {
		if (!["input", "button"].includes(e.target.tagName.toLowerCase())) {
			emit("onClickRow", { row, i });
		}
	};
	const changePage = (page) => {
		store.page = page;
		emit("onChangePage", { page });
	};
	return {
		sort,
		getData,
		setFilter,
		getFilter,
		setParam,
		selectAll,
		select,
		getSelect,
		clickRow,
		changePage,
		search,
		...toRefs(store),
	};
}
