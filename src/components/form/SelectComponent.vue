<template>
	<form-group :v="v" :label="label">
		<select
			v-bind="$attrs"
			class="form-control form-control-sm"
			v-model="v.$model"
			:class="{
				'is-invalid': v.$error,
				'is-valid': v.$dirty && !v.$error,
			}"
			@blur="v.$dirty=true"
			
		>
			<option v-for="(s, i) in obj" :key="i" :value="s.id">
				{{ s.text }}
			</option>
		</select>
	</form-group>
</template>
<script>
import FormGroup from "./FormGroup.vue";
import { computed } from "vue";
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
		obj: {
			type: Object,
			required: true,
			default: {},
		},
	},
	
};
</script>

<style></style>
