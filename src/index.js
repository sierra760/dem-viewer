// Import styles
import './css/styles.css';

// Import external libraries
import * as THREE from 'three';
import * as GeoTIFF from 'geotiff';

// Make libraries available globally for modules that expect them
window.THREE = THREE;
window.GeoTIFF = GeoTIFF;

// Import application modules
import { colorScales } from './js/color-scales';
import { DEMProcessor } from './js/dem-processor';
import { Renderer2D } from './js/2d-renderer';
import { Renderer3D } from './js/3d-renderer';
import { Controls } from './js/controls';

// Log libraries to confirm they're loaded
console.log('THREE.js loaded:', THREE.REVISION);
console.log('GeoTIFF loaded:', GeoTIFF);
console.log('Application modules loaded');

/**
 * Main application entry point
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing application...');
    
    // Initialize libraries check
    checkLibraries();
    
    // Initialize the DEM processor
    const demProcessor = new DEMProcessor();
    
    // Initialize renderers
    const renderer2d = new Renderer2D(demProcessor);
    const renderer3d = new Renderer3D(demProcessor);
    
    // Initialize controls
    const controls = new Controls(renderer3d);
    
    // Set up the drag and drop zone
    setupDragAndDrop(demProcessor, renderer2d, renderer3d);
    
    console.log('Application initialized successfully');
});

/**
 * Check if required libraries are loaded
 */
function checkLibraries() {
    console.log("Checking libraries...");
    
    // Check THREE.js
    if (typeof window.THREE === 'undefined') {
        console.error("THREE.js library not loaded!");
        alert("Error: THREE.js library not loaded. Please check your internet connection and try again.");
    } else {
        console.log("THREE.js loaded successfully:", window.THREE.REVISION);
    }
    
    // Check GeoTIFF.js
    if (typeof window.GeoTIFF === 'undefined') {
        console.error("GeoTIFF.js library not loaded!");
        alert("Error: GeoTIFF.js library not loaded. Please check your internet connection and try again.");
    } else {
        console.log("GeoTIFF.js loaded successfully");
    }
}

/**
 * Set up drag and drop functionality
 */
function setupDragAndDrop(demProcessor, renderer2d, renderer3d) {
    const dropZone = document.getElementById('dropZone');
    const loading2d = document.getElementById('loading2d');
    const loading3d = document.getElementById('loading3d');
    
    if (!dropZone) {
        console.error("Drop zone element not found!");
        return;
    }
    
    console.log("Setting up drag and drop handlers");
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('active-drop');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('active-drop');
    });
    
    dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.classList.remove('active-drop');
        
        console.log("File dropped");
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            console.log("Processing file:", file.name);
            
            if (file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff')) {
                loading2d.style.display = 'block';
                loading3d.style.display = 'block';
                
                try {
                    // Process the GeoTIFF file
                    await demProcessor.processGeoTIFF(file);
                    
                    // Update views
                    renderer2d.render();
                    renderer3d.initialize();
                    
                } catch (error) {
                    console.error('Error processing GeoTIFF:', error);
                    alert('Error processing GeoTIFF file: ' + error.message);
                } finally {
                    loading2d.style.display = 'none';
                    loading3d.style.display = 'none';
                }
            } else {
                alert('Please drop a GeoTIFF file.');
            }
        }
    });
    
    console.log("Drag and drop handlers set up successfully");
}