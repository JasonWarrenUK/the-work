<div class="grain" aria-hidden="true"></div>
<div class="vignette" aria-hidden="true"></div>

<style>
	.grain {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 9999;
		opacity: 0.04;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		background-repeat: repeat;
		animation: grain 0.5s steps(6) infinite;
	}

	.vignette {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 9998;
		box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.7);
	}

	@keyframes grain {
		0%,
		100% {
			transform: translate(0, 0);
		}
		10% {
			transform: translate(-5%, -10%);
		}
		30% {
			transform: translate(3%, -15%);
		}
		50% {
			transform: translate(12%, 9%);
		}
		70% {
			transform: translate(9%, 4%);
		}
		90% {
			transform: translate(-1%, 7%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.grain {
			animation: none;
		}
	}

	@media (prefers-contrast: more) {
		.grain,
		.vignette {
			display: none;
		}
	}
</style>
