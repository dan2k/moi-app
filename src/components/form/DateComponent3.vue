<template>
	<!-- ระหว่างทดสอบ -->
	<form-group :v="v" :label="label">
		<Datepicker 
			v-bind="$attrs"
			v-model="v.$model"	
			:format="format"
			:enable-time-picker="showTime"
		>
		<template #dp-input="{ value, onInput, onEnter, onTab, onClear }">
          <input 
		  	type="text" 
			class="form-control form-control-sm" 
			:class="{
				'is-invalid': v.$error,
				'is-valid': v.$dirty && !v.$error,
			}"
			:value="value" 
			readonly="true"
			/>
        </template>
		<template #input-icon>
            <span class="dpicon" ><i class="far fa-calendar-alt"></i></span>
        </template>
		<template #clear-icon="{ clear }">
			<span class="trash" @click="clear" ><i class="fas fa-eraser"></i></span>
        </template>
		
		</Datepicker>
	</form-group>
</template>
<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
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
		showTime:{
			type:Boolean,
			default:true,
		},
		format:{
			type:Function,
			default:(date) => {
				const day = date.getDate();
				const month = date.getMonth() + 1;
				const year = date.getFullYear();
				var seconds = date.getSeconds();
				var minutes = date.getMinutes();
				var hour = date.getHours();

				return `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
			}
		}
	},
	setup() {
		//  const format = (date) => {
        //     const day = date.getDate();
        //     const month = date.getMonth() + 1;
        //     const year = date.getFullYear();
		// 	var seconds = date.getSeconds();
		// 	var minutes = date.getMinutes();
		// 	var hour = date.getHours();

        //     return `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
        // } 
		// return { format }

	},
};
</script>

<style scoped>
	
	.trash{
		margin-right: 25px;
	}
	.dpicon{
		height: 20px;
        width: auto;
        margin-left: 5px;
	}
	input {
		text-indent: 15px !important;
	}
</style>
