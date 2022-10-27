<template>
	<form-group :v="v" :label="label">
		&nbsp;
		<div
			v-for="(ob, index) in obj"
			:key="index"
			class="form-check"
			:class="[{ 'form-check-inline': inline }]"
		>
			<input
				v-bind="$attrs"
				class="form-check-input"
				v-model="v.$model"
				:value="ob.value"
				type="checkbox"
				:class="{
					'is-invalid': v.$error,
					'is-valid': v.$dirty && !v.$error,
				}"
				:disabled="disabled"
			/>
			<label class="form-check-label">{{ ob.label }}</label>
		</div>
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
		value: {
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
		label: {
			type: String,
			default: "",
		},
		inline: {
			type: Boolean,
			default: true,
		},
		disabled: {
			type: Boolean,
			default: false,
			required: false,
		}
	},
};
</script>
