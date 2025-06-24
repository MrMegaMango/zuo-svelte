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

	// Places where Zuo has lived/worked - based on resume
	const locations = [
		{ name: 'Mountain View, CA', lat: 37.3861, lng: -122.0839, color: '#FF3E00', description: 'Atlassian - Software Engineer' },
		{ name: 'Shanghai, CN', lat: 31.2304, lng: 121.4737, color: '#40B3FF', description: 'Tesla Gigafactory - Senior Software Engineer' },
		{ name: 'Austin, TX', lat: 30.2672, lng: -97.7431, color: '#4ECB71', description: 'Tesla Gigafactory - Senior Software Engineer' },
		{ name: 'London, UK', lat: 51.5074, lng: -0.1278, color: '#FF6B6B', description: 'Samaya AI - Member of Technical Staff' },
		{ name: 'Baltimore, MD', lat: 39.2904, lng: -76.6122, color: '#9B59B6', description: 'Johns Hopkins University - MS Information Security' },
		{ name: 'Rochester, NY', lat: 43.1566, lng: -77.6088, color: '#E67E22', description: 'University of Rochester - BS ECE' },
		{ name: 'Wenzhou', lat: 27.9994, lng: 120.6668, color: '#f97316', description: 'Birthplace 🏠' },
		{ name: 'Shenyang', lat: 41.7922, lng: 123.4328, color: '#ec4899', description: 'Childhood 🧸' },
		{ name: 'Virginia Beach, VA', lat: 36.8631, lng: -76.0158, color: '#10b981', description: 'Cape Henry Collegiate 🎓' },
		{ name: 'Shenzhen', lat: 22.5429, lng: 114.0630, color: '#e11d48', description: 'Married 💒' },
		{ name: 'Barcelona', lat: 41.3902, lng: 2.1540, color: '#f59e0b', description: 'Favorite place to chill 🍤' }
	];

	let selectedLocation: typeof locations[0] | null = null;
	let rotation = 90; // Start with Americas facing forward
	let isDragging = false;
	let lastMouseX = 0;
	let zoomLevel = 1; // Default zoom level
	const minZoom = 0.5;
	const maxZoom = 3;

	function degToRad(deg: number): number {
		return (deg * Math.PI) / 180;
	}

	function zoomIn() {
		if (zoomLevel < maxZoom) {
			zoomLevel = Math.min(maxZoom, zoomLevel + 0.2);
		}
	}

	function zoomOut() {
		if (zoomLevel > minZoom) {
			zoomLevel = Math.max(minZoom, zoomLevel - 0.2);
		}
	}

	function latLngToXY(lat: number, lng: number, radius: number, rotation: number = 0): { x: number; y: number; z: number } {
		const phi = degToRad(90 - lat);
		const theta = degToRad(-lng - rotation); 
		
		const x = radius * Math.sin(phi) * Math.cos(theta);
		const y = radius * Math.cos(phi);
		const z = radius * Math.sin(phi) * Math.sin(theta);
		
		return { x, y, z };
	}

	function projectTo2D(x: number, y: number, z: number, centerX: number, centerY: number): { x: number; y: number; visible: boolean } {
		const perspective = 400;
		const distance = 800;
		
		const projectedX = centerX + (x * perspective) / (distance + z);
		const projectedY = centerY - (y * perspective) / (distance + z);
		
		return {
			x: projectedX,
			y: projectedY,
			visible: z > -100
		};
	}

	function drawGlobe() {
		if (!ctx || !canvas) return;
		
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const baseRadius = Math.min(canvas.width, canvas.height) * 0.45;
		const radius = baseRadius * zoomLevel;
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		// Draw globe background with enhanced visuals
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
		
		// Create ocean gradient
		const oceanGradient = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.3, 0, centerX, centerY, radius);
		oceanGradient.addColorStop(0, '#1e40af');
		oceanGradient.addColorStop(0.4, '#1e3a8a');
		oceanGradient.addColorStop(0.8, '#1e293b');
		oceanGradient.addColorStop(1, '#0f172a');
		ctx.fillStyle = oceanGradient;
		ctx.fill();
		
		// Add subtle outer glow only
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
		ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
		ctx.lineWidth = 1;
		ctx.shadowColor = '#3b82f6';
		ctx.shadowBlur = 6;
		ctx.stroke();
		ctx.shadowBlur = 0;
		
		// Draw grid lines
		ctx.strokeStyle = '#3d3d5d';
		ctx.lineWidth = 1;
		
		// Longitude lines
		for (let lng = -180; lng <= 180; lng += 30) {
			ctx.beginPath();
			for (let lat = -90; lat <= 90; lat += 5) {
				const pos = latLngToXY(lat, lng, radius, rotation);
				const projected = projectTo2D(pos.x, pos.y, pos.z, centerX, centerY);
				
				if (projected.visible) {
					if (lat === -90) {
						ctx.moveTo(projected.x, projected.y);
					} else {
						ctx.lineTo(projected.x, projected.y);
					}
				}
			}
			ctx.stroke();
		}
		
		// Latitude lines
		for (let lat = -60; lat <= 60; lat += 30) {
			ctx.beginPath();
			for (let lng = -180; lng <= 180; lng += 5) {
				const pos = latLngToXY(lat, lng, radius, rotation);
				const projected = projectTo2D(pos.x, pos.y, pos.z, centerX, centerY);
				
				if (projected.visible) {
					if (lng === -180) {
						ctx.moveTo(projected.x, projected.y);
					} else {
						ctx.lineTo(projected.x, projected.y);
					}
				}
			}
			ctx.stroke();
		}
		
		// Draw continent outlines with enhanced visuals
		ctx.strokeStyle = '#34d399';
		ctx.lineWidth = 2;
		
		// Create gradient for continents
		const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
		gradient.addColorStop(0, 'rgba(52, 211, 153, 0.4)');
		gradient.addColorStop(0.7, 'rgba(34, 197, 94, 0.3)');
		gradient.addColorStop(1, 'rgba(21, 128, 61, 0.2)');
		ctx.fillStyle = gradient;
		
		ctx.beginPath();
		let isFirstPoint = true;
		let currentPath: { x: number; y: number; visible: boolean }[] = [];
		
		for (const point of continents) {
			if (point === null) {
				// End current continent and start new one
				if (currentPath.length > 2) {
					// Close the path properly
					ctx.closePath();
					ctx.fill();
					
					// Add glow effect for visible continents
					if (currentPath.some(p => p.visible)) {
						ctx.shadowColor = '#34d399';
						ctx.shadowBlur = 10;
						ctx.stroke();
						ctx.shadowBlur = 0;
					} else {
						ctx.stroke();
					}
				}
				ctx.beginPath();
				isFirstPoint = true;
				currentPath = [];
				continue;
			}
			
			const pos = latLngToXY(point.lat, point.lng, radius, rotation);
			const projected = projectTo2D(pos.x, pos.y, pos.z, centerX, centerY);
			
			currentPath.push({ x: projected.x, y: projected.y, visible: projected.visible });
			
			if (projected.visible) {
				if (isFirstPoint) {
					ctx.moveTo(projected.x, projected.y);
					isFirstPoint = false;
				} else {
					ctx.lineTo(projected.x, projected.y);
				}
			}
		}
		
		// Draw final continent
		if (currentPath.length > 2) {
			ctx.closePath();
			ctx.fill();
			
			// Add glow effect for visible continents
			if (currentPath.some(p => p.visible)) {
				ctx.shadowColor = '#34d399';
				ctx.shadowBlur = 10;
				ctx.stroke();
				ctx.shadowBlur = 0;
			} else {
				ctx.stroke();
			}
		}
		
		// Draw locations
		locations.forEach((location, index) => {
			const pos = latLngToXY(location.lat, location.lng, radius, rotation);
			const projected = projectTo2D(pos.x, pos.y, pos.z, centerX, centerY);
			
			if (projected.visible) {
				// Draw location marker
				ctx.beginPath();
				ctx.arc(projected.x, projected.y, 8, 0, 2 * Math.PI);
				ctx.fillStyle = location.color;
				ctx.fill();
				ctx.strokeStyle = '#ffffff';
				ctx.lineWidth = 2;
				ctx.stroke();
				
				// Draw pulsing effect for selected location
				if (selectedLocation === location) {
					ctx.beginPath();
					const pulseRadius = 8 + Math.sin(Date.now() * 0.01) * 3;
					ctx.arc(projected.x, projected.y, pulseRadius, 0, 2 * Math.PI);
					ctx.strokeStyle = location.color;
					ctx.lineWidth = 3;
					ctx.stroke();
				}
				
				// Draw location label
				ctx.fillStyle = '#ffffff';
				ctx.font = '12px Inter, sans-serif';
				ctx.textAlign = 'center';
				ctx.fillText(location.name, projected.x, projected.y - 15);
			}
		});
	}

	function animate() {
		if (!isDragging) {
			rotation += 0.2;
		}
		drawGlobe();
		animationId = requestAnimationFrame(animate);
	}

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		lastMouseX = event.clientX;
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging) return;
		
		const deltaX = event.clientX - lastMouseX;
		rotation += deltaX * 0.5;
		lastMouseX = event.clientX;
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleCanvasClick(event: MouseEvent) {
		if (!canvas) return;
		
		const rect = canvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const baseRadius = Math.min(canvas.width, canvas.height) * 0.45;
		const radius = baseRadius * zoomLevel;
		
		// Check if click is near any location
		let clickedLocation = null;
		let minDistance = Infinity;
		
		locations.forEach((location) => {
			const pos = latLngToXY(location.lat, location.lng, radius, rotation);
			const projected = projectTo2D(pos.x, pos.y, pos.z, centerX, centerY);
			
			if (projected.visible) {
				const distance = Math.sqrt(
					Math.pow(mouseX - projected.x, 2) + Math.pow(mouseY - projected.y, 2)
				);
				
				if (distance < 20 && distance < minDistance) {
					minDistance = distance;
					clickedLocation = location;
				}
			}
		});
		
		selectedLocation = clickedLocation;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === '+' || event.key === '=') {
			event.preventDefault();
			zoomIn();
		} else if (event.key === '-') {
			event.preventDefault();
			zoomOut();
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
		if (!canvas) return;
		
		const container = canvas.parentElement;
		if (container) {
			canvas.width = container.clientWidth;
			canvas.height = Math.min(container.clientWidth, 700);
		}
		drawGlobe();
	}

	onMount(() => {
		if (browser && canvas) {
			ctx = canvas.getContext('2d')!;
			resizeCanvas();
			animate();
			
			window.addEventListener('resize', resizeCanvas);
			window.addEventListener('keydown', handleKeyDown);
			canvas.addEventListener('wheel', handleWheel);
			
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
	<title>World Map - Places I've Lived</title>
	<meta name="description" content="Interactive globe showing places where Zuo has lived and worked" />
</svelte:head>

<div class="world-map-container">
	<header class="header">
		<h1>🌍 Places I've Called Home</h1>
		<p>Click and drag to rotate the globe. Use zoom controls or mouse wheel to zoom in/out. Click on markers to learn more about each location.</p>
	</header>

	<div class="globe-container">
		<canvas
			bind:this={canvas}
			on:mousedown={handleMouseDown}
			on:mousemove={handleMouseMove}
			on:mouseup={handleMouseUp}
			on:mouseleave={handleMouseUp}
			on:click={handleCanvasClick}
		></canvas>
		
		<!-- Zoom Controls -->
		<div class="zoom-controls">
			<button 
				class="zoom-btn zoom-in" 
				on:click={zoomIn}
				disabled={zoomLevel >= maxZoom}
				title="Zoom In"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8"></circle>
					<path d="m21 21-4.35-4.35"></path>
					<line x1="11" y1="8" x2="11" y2="14"></line>
					<line x1="8" y1="11" x2="14" y2="11"></line>
				</svg>
			</button>
			<button 
				class="zoom-btn zoom-out" 
				on:click={zoomOut}
				disabled={zoomLevel <= minZoom}
				title="Zoom Out"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8"></circle>
					<path d="m21 21-4.35-4.35"></path>
					<line x1="8" y1="11" x2="14" y2="11"></line>
				</svg>
			</button>
			<div class="zoom-level">
				{Math.round(zoomLevel * 100)}%
			</div>
		</div>
	</div>

	{#if selectedLocation}
		<div class="location-info" style="border-left: 4px solid {selectedLocation.color}">
			<h3>{selectedLocation.name}</h3>
			<p>{selectedLocation.description}</p>
		</div>
	{:else}
		<div class="location-info">
			<h3>🗺️ My Journey</h3>
			<p>From Baltimore to London, spanning continents and building amazing technology. Click on any location to learn more!</p>
		</div>
	{/if}

	<div class="legend">
		<h4>Legend</h4>
		<div class="legend-items">
			{#each locations as location}
				<div 
					class="legend-item" 
					on:click={() => selectedLocation = location} 
					on:keydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							selectedLocation = location;
						}
					}}
					role="button" 
					tabindex="0"
				>
					<div class="legend-dot" style="background-color: {location.color}"></div>
					<span>{location.name}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.world-map-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
		font-family: 'Inter', sans-serif;
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.header h1 {
		color: #2c3e50;
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.header p {
		color: #7f8c8d;
		font-size: 1.1rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.globe-container {
		position: relative;
		width: 100%;
		margin: 2rem 0;
		border-radius: 20px;
		background: transparent;
		padding: 20px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	}

	canvas {
		display: block;
		border-radius: 15px;
		cursor: grab;
		background: radial-gradient(circle at 30% 30%, #2c3e50, #1a1a2e);
	}

	canvas:active {
		cursor: grabbing;
	}

	.zoom-controls {
		position: absolute;
		top: 20px;
		right: 20px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		z-index: 10;
	}

	.zoom-btn {
		width: 44px;
		height: 44px;
		border: none;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		color: #2c3e50;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.zoom-btn:hover:not(:disabled) {
		background: rgba(255, 255, 255, 1);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
	}

	.zoom-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.zoom-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: rgba(255, 255, 255, 0.6);
	}

	.zoom-level {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		color: #2c3e50;
		font-size: 12px;
		font-weight: 600;
		padding: 8px 12px;
		border-radius: 6px;
		text-align: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		min-width: 44px;
	}

	.location-info {
		background: white;
		border-radius: 15px;
		padding: 2rem;
		margin: 2rem 0;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.location-info:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
	}

	.location-info h3 {
		color: #2c3e50;
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
	}

	.location-info p {
		color: #7f8c8d;
		margin: 0;
		line-height: 1.6;
		font-size: 1.1rem;
	}

	.legend {
		background: white;
		border-radius: 15px;
		padding: 2rem;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.legend h4 {
		color: #2c3e50;
		margin: 0 0 1rem 0;
		font-size: 1.3rem;
	}

	.legend-items {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.legend-item:hover {
		background: #f8f9fa;
		transform: translateX(5px);
	}

	.legend-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		flex-shrink: 0;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.legend-item span {
		color: #34495e;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.world-map-container {
			padding: 1rem;
		}

		.header h1 {
			font-size: 2rem;
		}

		.legend-items {
			grid-template-columns: 1fr;
		}
	}

	/* Dark mode styles */
	@media (prefers-color-scheme: dark) {
		.header h1 {
			color: #ecf0f1;
		}

		.header p {
			color: #bdc3c7;
		}

		.location-info {
			background: #2c3e50;
			color: #ecf0f1;
		}

		.location-info h3 {
			color: #ecf0f1;
		}

		.location-info p {
			color: #bdc3c7;
		}

		.legend {
			background: #2c3e50;
		}

		.legend h4 {
			color: #ecf0f1;
		}

		.legend-item:hover {
			background: #34495e;
		}

		.legend-item span {
			color: #ecf0f1;
		}
	}
</style>