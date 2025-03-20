import * as THREE from 'three';
import { colorScales } from './color-scales';

/**
 * Renderer for 3D DEM visualization using Three.js
 */
export class Renderer3D {
    constructor(demProcessor) {
        this.demProcessor = demProcessor;
        this.container = document.getElementById('dem3d');
        this.loading = document.getElementById('loading3d');
        this.colorScheme = document.getElementById('colorScheme3d').value;
        this.verticalScale = 0.1;
        
        // Three.js variables
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.terrain = null;
        
        // Set up color scheme change handler
        document.getElementById('colorScheme3d').addEventListener('change', () => {
            this.colorScheme = document.getElementById('colorScheme3d').value;
            this.updateTerrainMaterial();
        });
        
        // Set up vertical exaggeration handler
        const exaggerationSlider = document.getElementById('verticalExaggeration');
        const exaggerationValue = document.getElementById('exaggerationValue');
        
        exaggerationSlider.addEventListener('input', () => {
            this.verticalScale = parseFloat(exaggerationSlider.value);
            exaggerationValue.textContent = this.verticalScale.toFixed(1) + 'x';
            if (this.terrain) {
                this.updateTerrainGeometry();
            }
        });
    }

    /**
     * Initialize the 3D scene
     */
    initialize() {
        if (!this.demProcessor.demData) return;
        
        this.loading.style.display = 'block';
        
        // Use setTimeout to allow the loading indicator to show
        setTimeout(() => {
            this._initScene();
            this.loading.style.display = 'none';
        }, 10);
    }

    /**
     * Internal method to initialize the Three.js scene
     */
    _initScene() {
        // Clear the container
        const loadingDiv = this.container.querySelector('.loading');
        this.container.innerHTML = '';
        this.container.appendChild(loadingDiv);
        
        // Set up the scene, camera, and renderer
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Set camera position
        this.camera.position.set(0, 500, 1000);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        
        // Create the terrain mesh
        this.createTerrainMesh();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start the render loop
        this.animate();
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        if (!this.renderer || !this.camera) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }

    /**
     * Create the terrain mesh
     */
    createTerrainMesh() {
        if (!this.demProcessor.demData) return;
        
        const { width, height } = this.demProcessor;
        
        // Create a plane geometry
        const geometry = new THREE.PlaneGeometry(
            width, 
            height, 
            width - 1, 
            height - 1
        );
        
        // Update the geometry with elevation data
        this.updateTerrainGeometry(geometry);
        
        // Create a material with the selected color scheme
        const material = this.createTerrainMaterial();
        
        // Create the terrain mesh
        this.terrain = new THREE.Mesh(geometry, material);
        
        // Center the terrain
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.position.set(-width / 2, 0, -height / 2);
        
        this.scene.add(this.terrain);
    }

    /**
     * Update the terrain geometry with elevation data
     */
    updateTerrainGeometry(geometry) {
        if (!this.demProcessor.demData) return;
        
        const { width, height, demData, noDataValue } = this.demProcessor;
        
        // Use existing geometry if not provided
        const geom = geometry || this.terrain.geometry;
        
        // Set up vertices based on DEM data
        const vertices = geom.attributes.position.array;
        
        for (let i = 0; i < vertices.length / 3; i++) {
            const x = i % (width);
            const y = Math.floor(i / (width));
            
            if (x < width && y < height) {
                const index = y * width + x;
                let elevation = demData[index];
                
                // Handle nodata values
                if (isNaN(elevation) || (noDataValue !== null && elevation === noDataValue)) {
                    elevation = 0;
                }
                
                // Apply vertical exaggeration
                vertices[i * 3 + 2] = elevation * this.verticalScale;
            }
        }
        
        geom.attributes.position.needsUpdate = true;
        geom.computeVertexNormals();
        
        return geom;
    }

    /**
     * Create a material for the terrain using the selected color scheme
     */
    createTerrainMaterial() {
        if (!this.demProcessor.demData) return null;
        
        const { width, height, demData } = this.demProcessor;
        const colorScale = colorScales[this.colorScheme];
        
        // Create a canvas for the texture
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        const imgData = ctx.createImageData(width, height);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = y * width + x;
                const pixelIndex = index * 4;
                
                const value = demData[index];
                const normalizedValue = this.demProcessor.getNormalizedValue(value);
                
                // Skip nodata values
                if (normalizedValue === null) {
                    imgData.data[pixelIndex] = 0;
                    imgData.data[pixelIndex + 1] = 0;
                    imgData.data[pixelIndex + 2] = 0;
                    imgData.data[pixelIndex + 3] = 0; // transparent
                    continue;
                }
                
                // Get color from the selected color scale
                const color = colorScale(normalizedValue);
                const rgb = color.match(/\d+/g).map(Number);
                
                imgData.data[pixelIndex] = rgb[0];
                imgData.data[pixelIndex + 1] = rgb[1];
                imgData.data[pixelIndex + 2] = rgb[2];
                imgData.data[pixelIndex + 3] = 255; // fully opaque
            }
        }
        
        ctx.putImageData(imgData, 0, 0);
        
        // Create a texture from the canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        
        // Create a material with the texture
        return new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
    }

    /**
     * Update the terrain material (for color scheme changes)
     */
    updateTerrainMaterial() {
        if (!this.terrain) return;
        
        const material = this.createTerrainMaterial();
        this.terrain.material.dispose();
        this.terrain.material = material;
    }

    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update camera position based on controls
        if (typeof window.updateCamera === 'function') {
            window.updateCamera();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}