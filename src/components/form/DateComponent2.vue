<template>
	<datepicker-lite
		:id-attr="datepickerSetting.id"
		:name-attr="datepickerSetting.name"
		:class-attr="datepickerSetting.class"
		:value-attr="datepickerSetting.value"
		:placeholder-attr="datepickerSetting.placeholder"
		:year-minus="datepickerSetting.yearMinus"
		:from="datepickerSetting.fromDate"
		:to="datepickerSetting.toDate"
		:disabled-date="datepickerSetting.disabledDate"
		:locale="datepickerSetting.locale"
		@value-changed="datepickerSetting.changeEvent"
		:disableInput="datepickerSetting.disableInput"
	></datepicker-lite>
</template>
<script>
import DatepickerLite from "vue3-datepicker-lite";
import FormGroup from "./FormGroup.vue";
export default {
	inheritAttrs: false,
	components: {
		FormGroup,
		DatepickerLite,
	},

	props: {
		label: {
			type: String,
			default: "",
		},
		v: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			datepickerSetting: {
				id: "birthday",
				name: "birthday",
				class: "myDateInput",
				value: "2020/10/01",
				placeholder: "Select",
				yearMinus: 0,
				fromDate: "2020/02/10",
				toDate: "2021/02/10",
				disabledDate: [
					"2020/10/02",
					"2020/10/03",
					"2020/10/04",
					"2020/10/05",
					"2020/10/06",
				],
				locale: {
					format: "YYYY/MM/DD",
					weekday: [
						"Sun",
						"Mon",
						"Tue",
						"Wed",
						"Thu",
						"Fri",
						"Sat",
					],
					startsWeeks: 0,
					todayBtn: "Today",
					clearBtn: "Clear",
					closeBtn: "Close",
				},
				changeEvent: (value) => {
					console.log(value + " selected!");
				},
				disableInput: false,
			},
		};
	},
};
</script>

<style></style>
