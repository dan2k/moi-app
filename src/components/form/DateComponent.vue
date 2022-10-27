<template>
	<!-- ระหว่างทดสอบ -->
	<form-group :v="v" :label="label">
		<datepicker
			v-bind="$attrs"
			v-model="v.$model"
			inputFormat="dd-MM-yyyy"
			class="form-control form-control-sm"
			:class="{
				'is-invalid': v.$error,
				'is-valid': v.$dirty && !v.$error,
			}"
			:locale="th"
			readonly="false"
			@blur="v.$dirty=true"
		/>
	</form-group>
</template>
<script>
import Datepicker from "vue3-datepicker";
import th from "date-fns/locale/th/index";
import FormGroup from "./FormGroup.vue";
export default {
	inheritAttrs: false,
	components: {
		FormGroup,
		Datepicker,
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
	setup() {
		// console.log(th);
		return { th };
	},
};
</script>

<style></style>
