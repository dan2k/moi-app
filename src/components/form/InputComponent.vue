<template>
	<form-group :v="v" :label="label">
		<input
			type="text"
			v-bind="$attrs"
			v-model="v.$model"
			class="form-control form-control-sm" 
			:class="{
				'is-invalid': v.$error,
				'is-valid': v.$dirty && !v.$error,
			}"
			@blur="v.$dirty=true"
		/>
	</form-group>
</template>
<script>
import FormGroup from "./FormGroup.vue";
export default {
	inheritAttrs: false,
	components: {
		FormGroup,
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
};
</script>

<style></style>
