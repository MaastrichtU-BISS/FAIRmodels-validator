<script lang="ts">
	import { stopPropagation } from 'svelte/legacy';

	import MaterialSymbolsUpload2Rounded from '~icons/material-symbols/upload-2-rounded';
	import MaterialSymbolsCheck from '~icons/material-symbols/check';
	import SolarCalculatorMinimalisticLinear from '~icons/solar/calculator-minimalistic-linear';
	import MaterialSymbolsDeleteOutline from '~icons/material-symbols/delete-outline';

	interface Props {
		userName?: string;
		date?: string;
		uploadedFile?: File | null;
	}

	let {
		userName = $bindable(''),
		date = $bindable(''),
		uploadedFile = $bindable(null)
	}: Props = $props();
	let datasetDescription = $state('');
	let datasetCharacteristics = $state('');
	let isDragging = $state(false);
	let dropZone: HTMLDivElement;
	let fileInput: HTMLInputElement;

	function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			uploadedFile = input.files[0];
		}
	}

	function handleDragEnter(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		const target = event.target as HTMLElement;
		if (target === dropZone) {
			isDragging = false;
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		const files = event.dataTransfer?.files;
		if (files && files[0]) {
			uploadedFile = files[0];
		}
	}

	function handleClick() {
		fileInput?.click();
	}

	function removeFile() {
		uploadedFile = null;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function calculateSummary() {
		// TODO: Implement summary calculation
		console.log('Calculating summary...');
	}

	function checkDataset() {
		// TODO: Implement dataset check
		console.log('Checking dataset...');
	}
</script>

<div class="grid grid-cols-[400px_1fr] gap-12">
	<!-- Left Column -->
	<div class="space-y-6">
		<div>
			<label class="label" for="userName">User</label>
			<input
				type="text"
				id="userName"
				class="input input-bordered w-full"
				placeholder="Add user name (Sam Smith)"
				bind:value={userName}
			/>
		</div>

		<div>
			<label class="label" for="date">Date</label>
			<input type="date" id="date" class="input input-bordered w-full" bind:value={date} />
		</div>

		<div>
			<div
				bind:this={dropZone}
				class="border-base-300 hover:border-primary/50 relative cursor-pointer rounded-lg border-2 border-dashed p-8 transition-all duration-200 ease-in-out {isDragging
					? 'border-primary bg-primary/5'
					: ''}"
				ondragenter={handleDragEnter}
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDrop}
				onclick={handleClick}
				onkeydown={(e) => e.key === 'Enter' && handleClick()}
				role="button"
				tabindex="0"
			>
				<div
					class="flex flex-col items-center justify-center gap-4 transition-transform duration-200 {isDragging
						? 'scale-105'
						: ''}"
				>
					<div class="transition-transform duration-200 {isDragging ? 'scale-110' : ''}">
						<MaterialSymbolsUpload2Rounded />
					</div>
					<div>
						<h3 class="text-lg font-semibold">Upload dataset</h3>
						<p class="text-base-content/70 text-sm">or drag and drop</p>
					</div>
					<input bind:this={fileInput} type="file" class="hidden" onchange={handleFileUpload} />
				</div>
				{#if uploadedFile}
					<div class="mt-4 flex items-center justify-center gap-2">
						<p class="text-success">{uploadedFile.name}</p>
						<button
							class="btn btn-ghost btn-sm text-error"
							onclick={stopPropagation(removeFile)}
							title="Remove file"
						>
							<MaterialSymbolsDeleteOutline />
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Right Column -->
	<div>
		<div class="grid grid-cols-2 gap-8">
			<div>
				<h3 class="text-lg font-medium">Dataset description</h3>
				<textarea
					class="textarea textarea-bordered h-48 w-full"
					placeholder="Free text or structure, including purpose of validation (to test data (N=5), to validate (N>30), quality assurance), source of data, etc)"
					bind:value={datasetDescription}
				></textarea>
			</div>
			<div>
				<h3 class="text-lg font-medium">Dataset characteristics</h3>
				<textarea
					class="textarea textarea-bordered h-48 w-full"
					placeholder="Characteristics of dataset that are not given in the data file (as sex distribution, ethnicity, characteristics of groups)"
					bind:value={datasetCharacteristics}
				></textarea>
			</div>
		</div>

		<!-- Right Column -->
		<div class="mt-8 space-y-4">
			<div>
				<button class="btn btn-outline w-auto gap-2" onclick={calculateSummary}>
					<SolarCalculatorMinimalisticLinear />
					Calculate the summary
				</button>
			</div>
			<textarea
				class="textarea textarea-bordered h-48 w-full"
				placeholder="Free text or structure, including purpose of validation (to test data (N=5), to validate (N>30), quality assurance), source of data, etc)"
				readonly
			></textarea>

			<button class="btn btn-outline gap-2" onclick={checkDataset}>
				<MaterialSymbolsCheck />
				Check the dataset
			</button>
			<textarea
				class="textarea textarea-bordered h-48 w-full"
				placeholder="Free text or structure, including purpose of validation (to test data (N=5), to validate (N>30), quality assurance), source of data, etc)"
				readonly
			></textarea>
		</div>
	</div>
</div>
