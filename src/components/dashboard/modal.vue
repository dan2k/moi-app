<template>
	<div class="modal modal-fullscreen" tabindex="-1" role="dialog">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<slot name="header">
						<h5 class="modal-title">Modal title</h5>
					</slot>

					<button
						type="button"
						class="close"
						data-dismiss="modal"
						aria-label="Close"
						@click="close"
					>
						<span aria-hidden="true">×</span>
					</button>
				</div>
				<div class="modal-body">
					<slot name="body">
						<p>Modal body text goes here.</p>
					</slot>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-danger mx-auto pb-2"
						data-dismiss="modal"
						@click="close"
					>
						ปิด
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	setup(_, { emit }) {
		const close = () => {
			emit("close");
		};
		return {
			close,
		};
	},
};
</script>
<style scoped>
.modal {
	display: block;
}
.modal.modal-fullscreen .modal-dialog {
	width: 100vw;
	height: 100vh;
	margin: 0;
	padding: 0;
	max-width: none;
}

.modal.modal-fullscreen .modal-content {
	height: auto;
	height: 100vh;
	border-radius: 0;
	border: none;
}
.modal.modal-fullscreen .modal-body {
	overflow-y: auto;
}
</style>
