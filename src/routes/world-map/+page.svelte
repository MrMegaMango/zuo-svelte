<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationId: number;

	// Detailed continent outlines based on real coastlines
	const continents = [
		// North America - realistic coastline
		{ lat: 83, lng: -80 }, { lat: 83, lng: -90 }, { lat: 81, lng: -100 }, { lat: 78, lng: -110 },
		{ lat: 75, lng: -115 }, { lat: 72, lng: -130 }, { lat: 70, lng: -145 }, { lat: 68, lng: -155 },
		{ lat: 65, lng: -165 }, { lat: 60, lng: -170 }, { lat: 55, lng: -165 }, { lat: 58, lng: -155 },
		{ lat: 61, lng: -150 }, { lat: 70, lng: -140 }, { lat: 69, lng: -133 }, { lat: 68, lng: -125 },
		{ lat: 60, lng: -125 }, { lat: 55, lng: -130 }, { lat: 50, lng: -128 }, { lat: 48, lng: -125 },
		{ lat: 45, lng: -124 }, { lat: 42, lng: -124 }, { lat: 38, lng: -123 }, { lat: 34, lng: -120 },
		{ lat: 32, lng: -117 }, { lat: 29, lng: -115 }, { lat: 26, lng: -110 }, { lat: 24, lng: -107 },
		{ lat: 25, lng: -104 }, { lat: 26, lng: -100 }, { lat: 28, lng: -97 }, { lat: 30, lng: -94 },
		{ lat: 29, lng: -90 }, { lat: 30, lng: -85 }, { lat: 31, lng: -81 }, { lat: 35, lng: -76 },
		{ lat: 39, lng: -74 }, { lat: 41, lng: -70 }, { lat: 44, lng: -67 }, { lat: 47, lng: -67 },
		{ lat: 50, lng: -66 }, { lat: 58, lng: -68 }, { lat: 60, lng: -64 }, { lat: 68, lng: -65 },
		{ lat: 75, lng: -68 }, { lat: 80, lng: -75 }, { lat: 83, lng: -80 },
		null, // Mexico and Central America
		{ lat: 28, lng: -97 }, { lat: 26, lng: -100 }, { lat: 25, lng: -104 }, { lat: 24, lng: -107 },
		{ lat: 22, lng: -106 }, { lat: 21, lng: -87 }, { lat: 18, lng: -88 }, { lat: 16, lng: -90 },
		{ lat: 14, lng: -92 }, { lat: 10, lng: -84 }, { lat: 8, lng: -80 }, { lat: 8, lng: -78 },
		{ lat: 10, lng: -75 }, { lat: 12, lng: -72 }, { lat: 14, lng: -82 }, { lat: 16, lng: -95 },
		{ lat: 20, lng: -105 }, { lat: 22, lng: -106 }, { lat: 24, lng: -107 }, { lat: 26, lng: -100 },
		{ lat: 28, lng: -97 },
		null,

		// South America - detailed coastline
		{ lat: 12, lng: -72 }, { lat: 11, lng: -60 }, { lat: 6, lng: -58 }, { lat: 4, lng: -52 },
		{ lat: 2, lng: -44 }, { lat: -2, lng: -39 }, { lat: -8, lng: -35 }, { lat: -13, lng: -39 },
		{ lat: -18, lng: -39 }, { lat: -23, lng: -43 }, { lat: -29, lng: -50 }, { lat: -33, lng: -53 },
		{ lat: -35, lng: -57 }, { lat: -39, lng: -62 }, { lat: -42, lng: -65 }, { lat: -47, lng: -66 },
		{ lat: -51, lng: -69 }, { lat: -53, lng: -68 }, { lat: -55, lng: -67 }, { lat: -52, lng: -70 },
		{ lat: -48, lng: -74 }, { lat: -44, lng: -74 }, { lat: -39, lng: -73 }, { lat: -35, lng: -72 },
		{ lat: -30, lng: -71 }, { lat: -24, lng: -70 }, { lat: -18, lng: -70 }, { lat: -12, lng: -77 },
		{ lat: -6, lng: -81 }, { lat: 1, lng: -80 }, { lat: 8, lng: -78 }, { lat: 10, lng: -75 },
		{ lat: 12, lng: -72 },
		null,

		// Europe - detailed coastline
		{ lat: 71, lng: 25 }, { lat: 70, lng: 30 }, { lat: 68, lng: 33 }, { lat: 65, lng: 35 },
		{ lat: 60, lng: 30 }, { lat: 56, lng: 22 }, { lat: 55, lng: 13 }, { lat: 57, lng: 8 },
		{ lat: 60, lng: 5 }, { lat: 62, lng: 6 }, { lat: 65, lng: 12 }, { lat: 68, lng: 16 },
		{ lat: 70, lng: 20 }, { lat: 71, lng: 25 },
		null,
		{ lat: 55, lng: 13 }, { lat: 54, lng: 9 }, { lat: 51, lng: 4 }, { lat: 50, lng: -5 },
		{ lat: 58, lng: -8 }, { lat: 61, lng: -2 }, { lat: 59, lng: 1 }, { lat: 56, lng: 3 },
		{ lat: 55, lng: 13 },
		null,
		{ lat: 51, lng: 4 }, { lat: 48, lng: -5 }, { lat: 43, lng: -9 }, { lat: 36, lng: -9 },
		{ lat: 36, lng: -6 }, { lat: 43, lng: 3 }, { lat: 45, lng: 7 }, { lat: 47, lng: 9 },
		{ lat: 49, lng: 8 }, { lat: 51, lng: 4 },
		null,
		{ lat: 47, lng: 9 }, { lat: 46, lng: 13 }, { lat: 42, lng: 12 }, { lat: 38, lng: 15 },
		{ lat: 37, lng: 22 }, { lat: 41, lng: 28 }, { lat: 45, lng: 29 }, { lat: 48, lng: 26 },
		{ lat: 50, lng: 23 }, { lat: 54, lng: 24 }, { lat: 56, lng: 22 }, { lat: 55, lng: 13 },
		{ lat: 54, lng: 9 }, { lat: 47, lng: 9 },
		null,

		// Africa - detailed coastline
		{ lat: 37, lng: -6 }, { lat: 36, lng: -9 }, { lat: 32, lng: -9 }, { lat: 28, lng: -12 },
		{ lat: 21, lng: -17 }, { lat: 15, lng: -17 }, { lat: 12, lng: -15 }, { lat: 5, lng: -3 },
		{ lat: -5, lng: 9 }, { lat: -12, lng: 13 }, { lat: -18, lng: 12 }, { lat: -26, lng: 15 },
		{ lat: -29, lng: 17 }, { lat: -33, lng: 18 }, { lat: -35, lng: 20 }, { lat: -34, lng: 28 },
		{ lat: -26, lng: 33 }, { lat: -12, lng: 40 }, { lat: -1, lng: 42 }, { lat: 12, lng: 43 },
		{ lat: 15, lng: 39 }, { lat: 18, lng: 38 }, { lat: 22, lng: 37 }, { lat: 25, lng: 35 },
		{ lat: 27, lng: 33 }, { lat: 31, lng: 25 }, { lat: 32, lng: 22 }, { lat: 31, lng: 25 },
		{ lat: 33, lng: 28 }, { lat: 34, lng: 26 }, { lat: 36, lng: 22 }, { lat: 37, lng: 10 },
		{ lat: 36, lng: 3 }, { lat: 37, lng: -2 }, { lat: 37, lng: -6 },
		null,

		// Asia - realistic coastline (Siberia and Far East)
		{ lat: 77, lng: 105 }, { lat: 73, lng: 125 }, { lat: 70, lng: 140 }, { lat: 65, lng: 170 },
		{ lat: 60, lng: -170 }, { lat: 65, lng: -165 }, { lat: 68, lng: -155 }, { lat: 70, lng: -145 },
		{ lat: 72, lng: -130 }, { lat: 75, lng: -115 }, { lat: 78, lng: -110 }, { lat: 80, lng: -100 },
		{ lat: 82, lng: -90 }, { lat: 81, lng: -80 }, { lat: 78, lng: -70 }, { lat: 75, lng: -60 },
		{ lat: 70, lng: -55 }, { lat: 65, lng: -60 }, { lat: 60, lng: -65 }, { lat: 55, lng: -70 },
		{ lat: 70, lng: 20 }, { lat: 75, lng: 80 }, { lat: 77, lng: 105 },
		null,
		// Asia mainland - from Central Asia to East Asia
		{ lat: 77, lng: 105 }, { lat: 75, lng: 80 }, { lat: 70, lng: 60 }, { lat: 68, lng: 33 },
		{ lat: 65, lng: 35 }, { lat: 60, lng: 30 }, { lat: 56, lng: 38 }, { lat: 50, lng: 46 },
		{ lat: 45, lng: 48 }, { lat: 40, lng: 50 }, { lat: 35, lng: 52 }, { lat: 25, lng: 55 },
		{ lat: 23, lng: 68 }, { lat: 28, lng: 77 }, { lat: 35, lng: 75 }, { lat: 37, lng: 80 },
		{ lat: 42, lng: 87 }, { lat: 48, lng: 87 }, { lat: 52, lng: 105 }, { lat: 55, lng: 115 },
		{ lat: 60, lng: 120 }, { lat: 65, lng: 125 }, { lat: 70, lng: 140 }, { lat: 77, lng: 105 },
		null,
		{ lat: 35, lng: 75 }, { lat: 28, lng: 77 }, { lat: 23, lng: 68 }, { lat: 25, lng: 55 },
		{ lat: 22, lng: 60 }, { lat: 20, lng: 72 }, { lat: 8, lng: 77 }, { lat: 6, lng: 80 },
		{ lat: 10, lng: 82 }, { lat: 22, lng: 88 }, { lat: 28, lng: 88 }, { lat: 35, lng: 75 },
		null,
		{ lat: 22, lng: 88 }, { lat: 28, lng: 88 }, { lat: 28, lng: 97 }, { lat: 25, lng: 100 },
		{ lat: 21, lng: 106 }, { lat: 16, lng: 108 }, { lat: 10, lng: 104 }, { lat: 1, lng: 104 },
		{ lat: -6, lng: 107 }, { lat: -8, lng: 115 }, { lat: -8, lng: 125 }, { lat: -2, lng: 131 },
		{ lat: 1, lng: 136 }, { lat: 7, lng: 134 }, { lat: 15, lng: 121 }, { lat: 19, lng: 121 },
		{ lat: 24, lng: 118 }, { lat: 31, lng: 121 }, { lat: 38, lng: 125 }, { lat: 41, lng: 124 },
		{ lat: 43, lng: 132 }, { lat: 46, lng: 135 }, { lat: 50, lng: 137 }, { lat: 54, lng: 137 },
		{ lat: 60, lng: 140 }, { lat: 65, lng: 170 }, { lat: 70, lng: 140 }, { lat: 65, lng: 125 },
		{ lat: 60, lng: 120 }, { lat: 55, lng: 115 }, { lat: 52, lng: 105 }, { lat: 48, lng: 87 },
		{ lat: 42, lng: 87 }, { lat: 37, lng: 80 }, { lat: 35, lng: 75 }, { lat: 28, lng: 88 },
		{ lat: 22, lng: 88 },
		null,

		// Australia - detailed coastline
		{ lat: -10, lng: 143 }, { lat: -12, lng: 137 }, { lat: -14, lng: 129 }, { lat: -18, lng: 122 },
		{ lat: -22, lng: 114 }, { lat: -26, lng: 113 }, { lat: -32, lng: 115 }, { lat: -35, lng: 118 },
		{ lat: -35, lng: 123 }, { lat: -33, lng: 128 }, { lat: -32, lng: 133 }, { lat: -30, lng: 138 },
		{ lat: -28, lng: 141 }, { lat: -26, lng: 145 }, { lat: -24, lng: 148 }, { lat: -20, lng: 149 },
		{ lat: -16, lng: 146 }, { lat: -12, lng: 143 }, { lat: -10, lng: 143 },
		null,
		// Tasmania
		{ lat: -41, lng: 144 }, { lat: -43, lng: 146 }, { lat: -43, lng: 148 }, { lat: -41, lng: 148 },
		{ lat: -41, lng: 144 },
		null,
		// New Zealand
		{ lat: -34, lng: 173 }, { lat: -37, lng: 175 }, { lat: -41, lng: 174 }, { lat: -46, lng: 168 },
		{ lat: -46, lng: 166 }, { lat: -41, lng: 172 }, { lat: -37, lng: 174 }, { lat: -34, lng: 173 },
		null
	];

	type GeoPoint = { lat: number; lng: number };
	type Location = {
		name: string;
		lat: number;
		lng: number;
		color: string;
		description: string;
	};
	type Star = {
		x: number;
		y: number;
		radius: number;
		alpha: number;
		twinkle: number;
	};
	type ProjectedLocation = {
		location: Location;
		x: number;
		y: number;
		z: number;
		visible: boolean;
		depth: number;
		size: number;
	};

	// Places where Zuo has lived/worked - based on resume
	const locations: Location[] = [
		{ name: 'Mountain View, CA', lat: 37.3861, lng: -122.0839, color: '#FF3E00', description: 'Atlassian - Software Engineer' },
		{ name: 'Shanghai, CN', lat: 31.2304, lng: 121.4737, color: '#40B3FF', description: 'Tesla Gigafactory - Senior Software Engineer' },
		{ name: 'Austin, TX', lat: 30.2672, lng: -97.7431, color: '#4ECB71', description: 'Tesla Gigafactory - Senior Software Engineer' },
		{ name: 'London, UK', lat: 51.5074, lng: -0.1278, color: '#FF6B6B', description: 'Samaya AI - Member of Technical Staff' },
		{ name: 'Baltimore, MD', lat: 39.2904, lng: -76.6122, color: '#9B59B6', description: 'Johns Hopkins University - MS Information Security' },
		{ name: 'Rochester, NY', lat: 43.1566, lng: -77.6088, color: '#E67E22', description: 'University of Rochester - BS ECE' },
		{ name: 'Wenzhou', lat: 27.9994, lng: 120.6668, color: '#f97316', description: 'Birthplace 🏠' },
		{ name: 'Shenyang', lat: 41.7922, lng: 123.4328, color: '#ec4899', description: 'Childhood 🧸' },
		{ name: 'Virginia Beach, VA', lat: 36.8631, lng: -76.0158, color: '#10b981', description: 'Cape Henry Collegiate 🎓' },
		{ name: 'Shenzhen', lat: 22.5429, lng: 114.063, color: '#e11d48', description: 'Married 💒' },
		{ name: 'Barcelona', lat: 41.3902, lng: 2.154, color: '#f59e0b', description: 'Favorite place to chill 🍤' }
	];

	const continentPaths = splitPaths(continents);
	const stars = createStars(180);

	let selectedLocation: Location | null = null;
	let hoveredLocation: Location | null = null;
	let ambientLocation: Location | null = null;
	let rotation = 35;
	let targetRotation: number | null = null;
	let isDragging = false;
	let activePointerId: number | null = null;
	let lastMouseX = 0;
	let dragDistance = 0;
	let lastAmbientSwitchAt = 0;
	let zoomLevel = 1;
	let canvasWidth = 0;
	let canvasHeight = 0;

	const minZoom = 0.88;
	const maxZoom = 1.35;
	const ambientSwitchInterval = 2600;

	function splitPaths(points: Array<GeoPoint | null>): GeoPoint[][] {
		const paths: GeoPoint[][] = [];
		let currentPath: GeoPoint[] = [];

		for (const point of points) {
			if (point === null) {
				if (currentPath.length > 1) {
					paths.push(currentPath);
				}
				currentPath = [];
				continue;
			}

			currentPath.push(point);
		}

		if (currentPath.length > 1) {
			paths.push(currentPath);
		}

		return paths;
	}

	function createStars(count: number): Star[] {
		return Array.from({ length: count }, (_, index) => {
			const seed = index + 1;
			return {
				x: pseudoRandom(seed * 11.17),
				y: pseudoRandom(seed * 7.13),
				radius: 0.4 + pseudoRandom(seed * 3.97) * 1.7,
				alpha: 0.22 + pseudoRandom(seed * 5.71) * 0.6,
				twinkle: 0.8 + pseudoRandom(seed * 9.19) * 2.8
			};
		});
	}

	function pseudoRandom(seed: number): number {
		const value = Math.sin(seed * 43758.5453123) * 143758.5453;
		return value - Math.floor(value);
	}

	function degToRad(deg: number): number {
		return (deg * Math.PI) / 180;
	}

	function clamp(value: number, min: number, max: number): number {
		return Math.min(max, Math.max(min, value));
	}

	function normalizeRotation(value: number): number {
		let normalized = value;
		while (normalized > 180) normalized -= 360;
		while (normalized < -180) normalized += 360;
		return normalized;
	}

	function shortestRotationDelta(current: number, target: number): number {
		return normalizeRotation(target - current);
	}

	function hexWithAlpha(hex: string, alpha: number): string {
		const sanitized = hex.replace('#', '');
		const normalized = sanitized.length === 3
			? sanitized.split('').map((part) => part + part).join('')
			: sanitized;
		const channel = Math.round(clamp(alpha, 0, 1) * 255)
			.toString(16)
			.padStart(2, '0');
		return `#${normalized}${channel}`;
	}

	function getGlobeMetrics() {
		const centerX = canvasWidth / 2;
		const centerY = canvasHeight * 0.53;
		const radius = Math.min(canvasWidth, canvasHeight) * 0.465 * zoomLevel;
		return { centerX, centerY, radius };
	}

	function zoomIn() {
		if (zoomLevel < maxZoom) {
			zoomLevel = Math.min(maxZoom, zoomLevel + 0.12);
		}
	}

	function zoomOut() {
		if (zoomLevel > minZoom) {
			zoomLevel = Math.max(minZoom, zoomLevel - 0.12);
		}
	}

	function focusLocation(location: Location) {
		selectedLocation = location;
		hoveredLocation = null;
		targetRotation = normalizeRotation(-location.lng - 90);
		zoomLevel = Math.max(zoomLevel, 1.02);
	}

	function clearSelection() {
		selectedLocation = null;
		targetRotation = null;
	}

	function latLngToXY(lat: number, lng: number, radius: number, rotationValue: number = 0): { x: number; y: number; z: number } {
		const phi = degToRad(90 - lat);
		const theta = degToRad(-lng - rotationValue);

		const x = radius * Math.sin(phi) * Math.cos(theta);
		const y = radius * Math.cos(phi);
		const z = radius * Math.sin(phi) * Math.sin(theta);

		return { x, y, z };
	}

	function projectTo2D(
		x: number,
		y: number,
		z: number,
		centerX: number,
		centerY: number,
		radius: number
	): { x: number; y: number; visible: boolean } {
		const perspective = radius * 1.55;
		const distance = radius * 3.45;

		const projectedX = centerX + (x * perspective) / (distance + z);
		const projectedY = centerY - (y * perspective) / (distance + z);

		return {
			x: projectedX,
			y: projectedY,
			visible: z > -radius * 0.12
		};
	}

	function projectPoint(point: GeoPoint, radius: number, centerX: number, centerY: number) {
		const position = latLngToXY(point.lat, point.lng, radius, rotation);
		const projected = projectTo2D(position.x, position.y, position.z, centerX, centerY, radius);

		return {
			x: projected.x,
			y: projected.y,
			z: position.z,
			visible: projected.visible
		};
	}

	function getProjectedLocations(centerX: number, centerY: number, radius: number): ProjectedLocation[] {
		return locations.map((location) => {
			const position = latLngToXY(location.lat, location.lng, radius, rotation);
			const projected = projectTo2D(position.x, position.y, position.z, centerX, centerY, radius);
			const depth = (position.z + radius) / (radius * 2);

			return {
				location,
				x: projected.x,
				y: projected.y,
				z: position.z,
				visible: projected.visible,
				depth,
				size: 3.7 + depth * 3.6
			};
		});
	}

	function syncAmbientLocation(projectedLocations: ProjectedLocation[]) {
		if (hoveredLocation || selectedLocation) return;

		if (projectedLocations.length === 0) {
			ambientLocation = null;
			return;
		}

		const now = Date.now();
		const byProminence = [...projectedLocations].sort((left, right) => right.depth - left.depth);
		const currentProjection = ambientLocation
			? byProminence.find((location) => location.location === ambientLocation)
			: null;
		const topProjection = byProminence[0];

		if (!currentProjection) {
			ambientLocation = topProjection.location;
			lastAmbientSwitchAt = now;
			return;
		}

		if (currentProjection.location === topProjection.location) return;

		const hasWaitedLongEnough = now - lastAmbientSwitchAt > ambientSwitchInterval;
		const topIsMeaningfullyCloser = topProjection.depth - currentProjection.depth > 0.08;

		if (hasWaitedLongEnough && topIsMeaningfullyCloser) {
			ambientLocation = topProjection.location;
			lastAmbientSwitchAt = now;
		}
	}

	function drawProjectedLine(points: GeoPoint[], radius: number, centerX: number, centerY: number) {
		let drawing = false;
		ctx.beginPath();

		for (const point of points) {
			const projected = projectPoint(point, radius, centerX, centerY);

			if (!projected.visible) {
				drawing = false;
				continue;
			}

			if (!drawing) {
				ctx.moveTo(projected.x, projected.y);
				drawing = true;
			} else {
				ctx.lineTo(projected.x, projected.y);
			}
		}

		ctx.stroke();
	}

	function drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
		const corner = Math.min(radius, width / 2, height / 2);
		ctx.beginPath();
		ctx.moveTo(x + corner, y);
		ctx.lineTo(x + width - corner, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + corner);
		ctx.lineTo(x + width, y + height - corner);
		ctx.quadraticCurveTo(x + width, y + height, x + width - corner, y + height);
		ctx.lineTo(x + corner, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - corner);
		ctx.lineTo(x, y + corner);
		ctx.quadraticCurveTo(x, y, x + corner, y);
		ctx.closePath();
	}

	function drawBackdrop() {
		const stageGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
		stageGradient.addColorStop(0, '#020611');
		stageGradient.addColorStop(0.38, '#07152a');
		stageGradient.addColorStop(1, '#02040a');
		ctx.fillStyle = stageGradient;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		const tealBloom = ctx.createRadialGradient(
			canvasWidth * 0.18,
			canvasHeight * 0.12,
			0,
			canvasWidth * 0.18,
			canvasHeight * 0.12,
			canvasWidth * 0.55
		);
		tealBloom.addColorStop(0, 'rgba(45, 212, 191, 0.16)');
		tealBloom.addColorStop(0.45, 'rgba(56, 189, 248, 0.07)');
		tealBloom.addColorStop(1, 'rgba(2, 6, 23, 0)');
		ctx.fillStyle = tealBloom;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		const cyanBloom = ctx.createRadialGradient(
			canvasWidth * 0.82,
			canvasHeight * 0.26,
			0,
			canvasWidth * 0.82,
			canvasHeight * 0.26,
			canvasWidth * 0.48
		);
		cyanBloom.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
		cyanBloom.addColorStop(0.55, 'rgba(14, 116, 144, 0.06)');
		cyanBloom.addColorStop(1, 'rgba(2, 6, 23, 0)');
		ctx.fillStyle = cyanBloom;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		const twinkleTime = Date.now() * 0.001;
		for (const [index, star] of stars.entries()) {
			const alpha = clamp(
				star.alpha + Math.sin(twinkleTime * star.twinkle + index * 0.7) * 0.12,
				0.05,
				0.95
			);
			ctx.beginPath();
			ctx.arc(star.x * canvasWidth, star.y * canvasHeight, star.radius, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`;
			ctx.fill();
		}
	}

	function drawCallout(projectedLocation: ProjectedLocation) {
		const direction = projectedLocation.x >= canvasWidth / 2 ? 1 : -1;
		const label = projectedLocation.location.name;
		const boxHeight = 34;

		ctx.font = '600 13px "Segoe UI", sans-serif';
		const textWidth = ctx.measureText(label).width;
		const boxWidth = textWidth + 28;
		const connectorStartX = projectedLocation.x + direction * (projectedLocation.size + 8);
		const desiredBoxX = direction > 0
			? connectorStartX + 14
			: connectorStartX - boxWidth - 14;
		const boxX = clamp(desiredBoxX, 18, canvasWidth - boxWidth - 18);
		const boxY = clamp(projectedLocation.y - boxHeight * 0.8, 18, canvasHeight - boxHeight - 18);
		const connectorEndX = direction > 0 ? boxX : boxX + boxWidth;
		const connectorEndY = boxY + boxHeight / 2;

		ctx.beginPath();
		ctx.moveTo(projectedLocation.x, projectedLocation.y);
		ctx.lineTo(connectorStartX, projectedLocation.y);
		ctx.lineTo(connectorEndX, connectorEndY);
		ctx.strokeStyle = hexWithAlpha(projectedLocation.location.color, 0.68);
		ctx.lineWidth = 1.4;
		ctx.stroke();

		drawRoundedRect(boxX, boxY, boxWidth, boxHeight, 17);
		ctx.fillStyle = 'rgba(5, 15, 30, 0.9)';
		ctx.fill();
		ctx.strokeStyle = hexWithAlpha(projectedLocation.location.color, 0.8);
		ctx.lineWidth = 1.2;
		ctx.stroke();

		ctx.fillStyle = '#f8fafc';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'middle';
		ctx.fillText(label, boxX + 14, boxY + boxHeight / 2);
	}

	function drawGlobe() {
		if (!ctx || !canvas || canvasWidth === 0 || canvasHeight === 0) return;

		const devicePixelRatio = window.devicePixelRatio || 1;
		ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		drawBackdrop();

		const { centerX, centerY, radius } = getGlobeMetrics();
		const pulse = (Math.sin(Date.now() * 0.008) + 1) / 2;

		const shadowGradient = ctx.createRadialGradient(
			centerX,
			centerY + radius * 0.22,
			radius * 0.48,
			centerX,
			centerY + radius * 0.22,
			radius * 1.1
		);
		shadowGradient.addColorStop(0, 'rgba(3, 7, 18, 0.82)');
		shadowGradient.addColorStop(1, 'rgba(3, 7, 18, 0)');
		ctx.beginPath();
		ctx.ellipse(centerX, centerY + radius * 0.24, radius * 0.96, radius * 0.26, 0, 0, Math.PI * 2);
		ctx.fillStyle = shadowGradient;
		ctx.fill();

		ctx.beginPath();
		ctx.arc(centerX, centerY, radius * 1.08, 0, Math.PI * 2);
		const atmosphere = ctx.createRadialGradient(
			centerX - radius * 0.18,
			centerY - radius * 0.3,
			radius * 0.28,
			centerX,
			centerY,
			radius * 1.12
		);
		atmosphere.addColorStop(0, 'rgba(103, 232, 249, 0.18)');
		atmosphere.addColorStop(0.55, 'rgba(59, 130, 246, 0.09)');
		atmosphere.addColorStop(1, 'rgba(2, 6, 23, 0)');
		ctx.fillStyle = atmosphere;
		ctx.fill();

		ctx.save();
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
		ctx.clip();

		const oceanGradient = ctx.createRadialGradient(
			centerX - radius * 0.32,
			centerY - radius * 0.42,
			radius * 0.08,
			centerX,
			centerY,
			radius * 1.05
		);
		oceanGradient.addColorStop(0, '#38bdf8');
		oceanGradient.addColorStop(0.22, '#0f8fc5');
		oceanGradient.addColorStop(0.58, '#0b3c6f');
		oceanGradient.addColorStop(1, '#031523');
		ctx.fillStyle = oceanGradient;
		ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

		const specular = ctx.createLinearGradient(
			centerX - radius * 1.05,
			centerY - radius * 0.48,
			centerX + radius * 0.9,
			centerY + radius * 0.6
		);
		specular.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
		specular.addColorStop(0.35, 'rgba(255, 255, 255, 0.03)');
		specular.addColorStop(1, 'rgba(0, 0, 0, 0.38)');
		ctx.fillStyle = specular;
		ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

		ctx.strokeStyle = 'rgba(148, 210, 245, 0.14)';
		ctx.lineWidth = 1;
		for (let lng = -180; lng <= 180; lng += 20) {
			const meridian: GeoPoint[] = [];
			for (let lat = -90; lat <= 90; lat += 4) {
				meridian.push({ lat, lng });
			}
			drawProjectedLine(meridian, radius, centerX, centerY);
		}

		for (let lat = -60; lat <= 60; lat += 20) {
			const parallel: GeoPoint[] = [];
			for (let lng = -180; lng <= 180; lng += 4) {
				parallel.push({ lat, lng });
			}
			drawProjectedLine(parallel, radius, centerX, centerY);
		}

		ctx.strokeStyle = 'rgba(110, 231, 183, 0.95)';
		ctx.lineWidth = 1.6;
		ctx.shadowColor = 'rgba(45, 212, 191, 0.34)';
		ctx.shadowBlur = 14;
		for (const continentPath of continentPaths) {
			drawProjectedLine(continentPath, radius, centerX, centerY);
		}
		ctx.shadowBlur = 0;

		ctx.strokeStyle = 'rgba(244, 255, 248, 0.22)';
		ctx.lineWidth = 0.7;
		for (const continentPath of continentPaths) {
			drawProjectedLine(continentPath, radius, centerX, centerY);
		}

		const terminator = ctx.createRadialGradient(
			centerX + radius * 0.28,
			centerY + radius * 0.04,
			radius * 0.12,
			centerX + radius * 0.2,
			centerY,
			radius * 1.06
		);
		terminator.addColorStop(0, 'rgba(0, 0, 0, 0)');
		terminator.addColorStop(0.6, 'rgba(0, 0, 0, 0.16)');
		terminator.addColorStop(1, 'rgba(0, 0, 0, 0.42)');
		ctx.fillStyle = terminator;
		ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
		ctx.restore();

		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
		ctx.strokeStyle = 'rgba(125, 211, 252, 0.28)';
		ctx.lineWidth = 1.1;
		ctx.shadowColor = 'rgba(56, 189, 248, 0.34)';
		ctx.shadowBlur = 20;
		ctx.stroke();
		ctx.shadowBlur = 0;

		const projectedLocations = getProjectedLocations(centerX, centerY, radius)
			.filter((location) => location.visible)
			.sort((left, right) => left.depth - right.depth);

		syncAmbientLocation(projectedLocations);

		for (const projectedLocation of projectedLocations) {
			const isSelected = selectedLocation === projectedLocation.location;
			const isHovered = hoveredLocation === projectedLocation.location;
			const isAmbient =
				!selectedLocation &&
				!hoveredLocation &&
				ambientLocation === projectedLocation.location;

			ctx.beginPath();
			ctx.arc(projectedLocation.x, projectedLocation.y, projectedLocation.size * 1.9, 0, Math.PI * 2);
			ctx.fillStyle = hexWithAlpha(projectedLocation.location.color, 0.16);
			ctx.fill();

			ctx.beginPath();
			ctx.arc(projectedLocation.x, projectedLocation.y, projectedLocation.size, 0, Math.PI * 2);
			ctx.fillStyle = projectedLocation.location.color;
			ctx.shadowColor = hexWithAlpha(projectedLocation.location.color, 0.85);
			ctx.shadowBlur = 10;
			ctx.fill();
			ctx.shadowBlur = 0;
			ctx.lineWidth = 1.5;
			ctx.strokeStyle = 'rgba(248, 250, 252, 0.92)';
			ctx.stroke();

			if (isSelected || isHovered || isAmbient) {
				ctx.beginPath();
				ctx.arc(
					projectedLocation.x,
					projectedLocation.y,
					projectedLocation.size + 5 + pulse * 2.8,
					0,
					Math.PI * 2
				);
				ctx.strokeStyle = hexWithAlpha(
					projectedLocation.location.color,
					isSelected ? 0.92 : isHovered ? 0.7 : 0.52
				);
				ctx.lineWidth = isSelected ? 2.2 : isHovered ? 1.6 : 1.25;
				ctx.stroke();
			}
		}

		const activeLocation = hoveredLocation ?? selectedLocation ?? ambientLocation;
		if (activeLocation) {
			const projectedLocation = projectedLocations.find(
				(location) => location.location === activeLocation
			);
			if (projectedLocation) {
				drawCallout(projectedLocation);
			}
		}
	}

	function animate() {
		if (!isDragging) {
			if (targetRotation !== null) {
				const delta = shortestRotationDelta(rotation, targetRotation);
				rotation = normalizeRotation(rotation + delta * 0.085);

				if (Math.abs(delta) < 0.18) {
					rotation = targetRotation;
					targetRotation = null;
				}
			} else if (!selectedLocation && !hoveredLocation) {
				rotation = normalizeRotation(rotation + 0.12);
			}
		}

		drawGlobe();
		animationId = requestAnimationFrame(animate);
	}

	function updateCursor() {
		if (!canvas) return;
		canvas.style.cursor = isDragging ? 'grabbing' : hoveredLocation ? 'pointer' : 'grab';
	}

	function getLocationAtPoint(mouseX: number, mouseY: number): Location | null {
		const { centerX, centerY, radius } = getGlobeMetrics();
		let closestLocation: Location | null = null;
		let minDistance = Infinity;

		for (const projectedLocation of getProjectedLocations(centerX, centerY, radius)) {
			if (!projectedLocation.visible) continue;

			const distance = Math.hypot(mouseX - projectedLocation.x, mouseY - projectedLocation.y);
			const hitRadius = Math.max(14, projectedLocation.size + 10);

			if (distance < hitRadius && distance < minDistance) {
				closestLocation = projectedLocation.location;
				minDistance = distance;
			}
		}

		return closestLocation;
	}

	function getPointerPosition(event: MouseEvent | PointerEvent) {
		const rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}

	function handlePointerDown(event: PointerEvent) {
		if (!canvas) return;

		activePointerId = event.pointerId;
		isDragging = true;
		lastMouseX = event.clientX;
		dragDistance = 0;
		canvas.setPointerCapture(event.pointerId);
		updateCursor();
	}

	function handlePointerMove(event: PointerEvent) {
		if (!canvas) return;

		if (isDragging && activePointerId === event.pointerId) {
			const deltaX = event.clientX - lastMouseX;
			rotation = normalizeRotation(rotation + deltaX * 0.42);
			lastMouseX = event.clientX;
			dragDistance += Math.abs(deltaX);
			hoveredLocation = null;
			updateCursor();
			return;
		}

		if (event.pointerType === 'mouse') {
			const { x, y } = getPointerPosition(event);
			hoveredLocation = getLocationAtPoint(x, y);
			updateCursor();
		}
	}

	function releasePointer(event: PointerEvent) {
		if (!canvas) return;

		if (canvas.hasPointerCapture(event.pointerId)) {
			canvas.releasePointerCapture(event.pointerId);
		}

		activePointerId = null;
		isDragging = false;

		if (event.pointerType === 'mouse') {
			const { x, y } = getPointerPosition(event);
			hoveredLocation = getLocationAtPoint(x, y);
		}

		updateCursor();
	}

	function handlePointerLeave() {
		if (!isDragging) {
			hoveredLocation = null;
			updateCursor();
		}
	}

	function handleCanvasClick(event: MouseEvent) {
		if (!canvas || dragDistance > 6) {
			dragDistance = 0;
			return;
		}

		const { x, y } = getPointerPosition(event);
		const clickedLocation = getLocationAtPoint(x, y);

		if (clickedLocation) {
			focusLocation(clickedLocation);
		} else {
			clearSelection();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === '+' || event.key === '=') {
			event.preventDefault();
			zoomIn();
		} else if (event.key === '-') {
			event.preventDefault();
			zoomOut();
		} else if (event.key === 'Escape') {
			clearSelection();
		}
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();
		if (event.deltaY < 0) {
			zoomIn();
		} else {
			zoomOut();
		}
	}

	function resizeCanvas() {
		if (!canvas || !ctx) return;

		const container = canvas.parentElement;
		if (!container) return;

		canvasWidth = container.clientWidth;
		canvasHeight = window.innerWidth < 760
			? Math.min(canvasWidth * 1.02, 620)
			: Math.min(Math.max(canvasWidth * 0.78, 560), 760);

		const devicePixelRatio = window.devicePixelRatio || 1;
		canvas.width = Math.round(canvasWidth * devicePixelRatio);
		canvas.height = Math.round(canvasHeight * devicePixelRatio);
		canvas.style.width = `${canvasWidth}px`;
		canvas.style.height = `${canvasHeight}px`;
		ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
		drawGlobe();
	}

	onMount(() => {
		if (browser && canvas) {
			ctx = canvas.getContext('2d')!;
			resizeCanvas();
			updateCursor();
			animate();

			window.addEventListener('resize', resizeCanvas);
			window.addEventListener('keydown', handleKeyDown);
			canvas.addEventListener('wheel', handleWheel, { passive: false });

			return () => {
				if (animationId) {
					cancelAnimationFrame(animationId);
				}
				window.removeEventListener('resize', resizeCanvas);
				window.removeEventListener('keydown', handleKeyDown);
				canvas.removeEventListener('wheel', handleWheel);
			};
		}
	});
</script>

<svelte:head>
	<title>Atlas | Places I've Called Home</title>
	<meta
		name="description"
		content="Interactive globe showing the places where Zuo has lived, studied, and built across the world"
	/>
</svelte:head>

<div class="world-map-container">
	<header class="hero">
		<p class="eyebrow">Journey Atlas</p>
		<h1>Places I've Called Home</h1>
	</header>

	<section class="globe-shell">
		<div class="stage-toolbar">
			<div class="stage-pill">Interactive globe</div>
			<div class="zoom-controls" aria-label="zoom controls">
				<button type="button" class="zoom-button" on:click={zoomOut} aria-label="Zoom out">-</button>
				<button type="button" class="zoom-button" on:click={zoomIn} aria-label="Zoom in">+</button>
			</div>
		</div>

		<div class="globe-stage">
			<canvas
				bind:this={canvas}
				aria-label="Rotating globe showing places Zuo has called home"
				on:pointerdown={handlePointerDown}
				on:pointermove={handlePointerMove}
				on:pointerup={releasePointer}
				on:pointercancel={releasePointer}
				on:pointerleave={handlePointerLeave}
				on:click={handleCanvasClick}
			></canvas>
		</div>

		<div class="stage-footer">
			<span>{(hoveredLocation ?? selectedLocation ?? ambientLocation)?.name ?? 'A moving record of where I have lived and built'}</span>
			<span>{(hoveredLocation ?? selectedLocation ?? ambientLocation)?.description ?? 'Across North America, Europe, and Asia'}</span>
		</div>
	</section>

	<div class="info-grid">
		<section
			class="location-info"
			style="--accent: {selectedLocation ? selectedLocation.color : '#5eead4'}"
		>
			{#if selectedLocation}
				<p class="section-label">Selected City</p>
				<h2>{selectedLocation.name}</h2>
				<p>{selectedLocation.description}</p>
				<button type="button" class="secondary-button" on:click={clearSelection}>Clear selection</button>
			{:else}
				<p class="section-label">Select A City</p>
				<h2>Pick a stop on the map</h2>
				<p>Its details will show up here.</p>
			{/if}
		</section>

		<aside class="legend">
			<div class="legend-heading">
				<p class="section-label">Stops</p>
				<h2>Every place on the route</h2>
			</div>
			<div class="legend-items">
				{#each locations as location}
					<button
						type="button"
						class:selected={selectedLocation === location}
						class="legend-item"
						on:click={() => focusLocation(location)}
						aria-pressed={selectedLocation === location}
					>
						<div class="legend-dot" style="background-color: {location.color}"></div>
						<div class="legend-copy">
							<span class="legend-name">{location.name}</span>
							<span class="legend-note">{location.description}</span>
						</div>
					</button>
				{/each}
			</div>
		</aside>
	</div>

	<footer class="instructions-footnote">Explore the map and follow the route from city to city.</footer>
</div>

<style>
	.world-map-container {
		--surface: rgba(255, 255, 255, 0.78);
		--surface-border: rgba(15, 23, 42, 0.09);
		--ink: #0f172a;
		--muted: #475569;
		max-width: 1100px;
		margin: 0 auto;
		padding: 1.5rem 1rem 2.5rem;
		color: var(--ink);
		font-family: var(--font-body);
	}

	.hero {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.eyebrow {
		margin: 0 0 0.75rem;
		color: #0f766e;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	.hero h1 {
		margin: 0;
		font-size: clamp(2.4rem, 7vw, 4.6rem);
		line-height: 0.95;
		letter-spacing: -0.04em;
		background: linear-gradient(135deg, #0f766e 0%, #0891b2 52%, #0f172a 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.globe-shell {
		position: relative;
		padding: 1rem;
		border-radius: 2rem;
		background:
			linear-gradient(135deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.08)),
			linear-gradient(135deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.02));
		border: 1px solid rgba(255, 255, 255, 0.35);
		box-shadow:
			0 24px 60px rgba(2, 6, 23, 0.14),
			inset 0 1px 0 rgba(255, 255, 255, 0.45);
		backdrop-filter: blur(20px);
		overflow: hidden;
	}

	.globe-shell::before {
		content: '';
		position: absolute;
		inset: auto 12% -22% auto;
		width: 16rem;
		height: 16rem;
		border-radius: 999px;
		background: radial-gradient(circle, rgba(45, 212, 191, 0.22), rgba(45, 212, 191, 0));
		filter: blur(18px);
		pointer-events: none;
	}

	.stage-toolbar,
	.stage-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		position: relative;
		z-index: 1;
	}

	.stage-toolbar {
		padding: 0 0.15rem 0.85rem;
	}

	.stage-footer {
		padding: 0.95rem 0.15rem 0.1rem;
		color: rgba(15, 23, 42, 0.78);
		font-size: 0.92rem;
	}

	.stage-footer span:last-child {
		text-align: right;
	}

	.stage-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 0.8rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(15, 23, 42, 0.08);
		color: #0f172a;
		font-size: 0.88rem;
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	.globe-stage {
		position: relative;
		border-radius: 1.45rem;
		overflow: hidden;
		background: #020611;
		border: 1px solid rgba(125, 211, 252, 0.12);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.03),
			0 18px 45px rgba(2, 6, 23, 0.28);
	}

	canvas {
		display: block;
		width: 100%;
		height: auto;
		cursor: grab;
		background: transparent;
		touch-action: pan-y;
	}

	.zoom-controls {
		display: flex;
		gap: 0.5rem;
	}

	.zoom-button,
	.secondary-button,
	.legend-item {
		font: inherit;
	}

	.zoom-button {
		width: 2.5rem;
		height: 2.5rem;
		border: 0;
		border-radius: 999px;
		background: rgba(15, 23, 42, 0.88);
		color: white;
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.22);
		cursor: pointer;
		transition: transform 0.2s ease, background-color 0.2s ease;
	}

	.zoom-button:hover {
		transform: translateY(-1px);
		background: rgba(8, 47, 73, 0.95);
	}

	.info-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(320px, 0.95fr);
		gap: 1.1rem;
		margin-top: 1.25rem;
		align-items: start;
	}

	.location-info,
	.legend {
		position: relative;
		background: var(--surface);
		border: 1px solid var(--surface-border);
		border-radius: 1.5rem;
		padding: 1.4rem;
		box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
		backdrop-filter: blur(18px);
	}

	.location-info {
		align-self: start;
	}

	.location-info::before {
		content: '';
		position: absolute;
		inset: 1rem auto 1rem 0.95rem;
		width: 0.28rem;
		border-radius: 999px;
		background: var(--accent);
	}

	.section-label {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: #0f766e;
	}

	.location-info h2,
	.legend h2 {
		margin: 0.55rem 0 0.75rem;
		font-size: clamp(1.45rem, 3vw, 2rem);
		line-height: 1.05;
		letter-spacing: -0.03em;
	}

	.location-info p,
	.legend-heading p {
		margin: 0;
		color: var(--muted);
		line-height: 1.65;
	}

	.secondary-button {
		margin-top: 1.2rem;
		padding: 0.75rem 1rem;
		border-radius: 999px;
		border: 1px solid rgba(15, 23, 42, 0.08);
		background: rgba(15, 23, 42, 0.92);
		color: white;
		cursor: pointer;
		transition: transform 0.2s ease, opacity 0.2s ease;
	}

	.secondary-button:hover {
		transform: translateY(-1px);
		opacity: 0.94;
	}

	.legend-heading {
		margin-bottom: 1rem;
	}

	.legend-items {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}

	.legend-item {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: 0.85rem;
		width: 100%;
		padding: 0.9rem;
		border-radius: 1rem;
		border: 1px solid transparent;
		background: rgba(255, 255, 255, 0.56);
		cursor: pointer;
		text-align: left;
		transition:
			transform 0.2s ease,
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.legend-item:hover {
		transform: translateX(4px);
		background: rgba(255, 255, 255, 0.86);
		border-color: rgba(15, 23, 42, 0.08);
	}

	.legend-item.selected {
		background: rgba(15, 23, 42, 0.92);
		border-color: rgba(255, 255, 255, 0.06);
		box-shadow: 0 18px 28px rgba(15, 23, 42, 0.18);
	}

	.legend-item.selected .legend-name,
	.legend-item.selected .legend-note {
		color: white;
	}

	.legend-dot {
		width: 0.95rem;
		height: 0.95rem;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.92);
		box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.06);
	}

	.legend-copy {
		display: grid;
		gap: 0.18rem;
	}

	.legend-name {
		color: #0f172a;
		font-weight: 600;
	}

	.legend-note {
		color: #475569;
		font-size: 0.88rem;
		line-height: 1.4;
	}

	.instructions-footnote {
		text-align: center;
		margin-top: 1.25rem;
		color: rgba(15, 23, 42, 0.72);
		font-size: 0.92rem;
		letter-spacing: -0.01em;
	}

	@media (max-width: 768px) {
		.world-map-container {
			padding: 1rem 0 2rem;
		}

		.hero {
			margin-bottom: 1.1rem;
		}

		.globe-shell {
			padding: 0.85rem;
		}

		.stage-toolbar,
		.stage-footer {
			flex-direction: column;
			align-items: stretch;
			text-align: center;
		}

		.stage-footer span:last-child {
			text-align: center;
		}

		.info-grid {
			grid-template-columns: 1fr;
		}

		.location-info,
		.legend {
			padding: 1.2rem;
		}

		.location-info::before {
			inset: 0.85rem auto 0.85rem 0.8rem;
		}
	}
</style>
