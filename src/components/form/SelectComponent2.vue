<template>
	<form-group :v="v" :label="label">
		<vue-select
			v-bind="$attrs"
			v-model="v.$model"
			:options="obj"
			label-by="label"
			value-by="id"
			:searchable="true"
			:close-on-select="true"
			:clear-on-close="true"
			:clear-on-select="true"
			placeholder="เลือก"
			search-placeholder="ค้นหา"
			@update:modelValue="onupdate"
			class="form-control form-control-sm"
			:class="{
				'is-invalid': v.$error,
				'is-valid': v.$dirty && !v.$error,
			}"
			@blur="v.$dirty=true"
			></vue-select>
			<!-- {{v}} -->
	</form-group>
</template>
<script>
import VueNextSelect from "vue-next-select";
import "vue-next-select/dist/index.min.css";
import FormGroup from "./FormGroup.vue";
export default {
	inheritAttrs: false,
	components: {
		FormGroup,
		"vue-select": VueNextSelect,
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
	setup(_,{emit}){
		const onupdate=(opt)=>{
			emit('onUpdate',opt)
		}
		return{ onupdate}
	}
	
};
</script>

<style scoped></style>
