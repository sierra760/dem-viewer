import { colorScales } from './color-scales';

/**
 * Renderer for 2D DEM visualization
 */
export class Renderer2D {
    constructor(demProcessor) {
        this.demProcessor = demProcessor;
        this.colorScheme = document.getElementById('colorScheme2d').value;
        this.container = document.getElementById('dem2d');
        this.loading = document.getElementById('loading2d');
        
        // Set up color scheme change handler
        document.getElementById('colorScheme2d').addEventListener('change', () => {
            this.colorScheme = document.getElementById('colorScheme2d').value;
            this.render();
        });
    }

    /**
     * Render the 2D visualization
     */
    render() {
        if (!this.demProcessor.demData) return;
        
        this.loading.style.display = 'block';
        
        // Use setTimeout to allow the loading indicator to show
        setTimeout(() => {
            this._renderCanvas();
            this.loading.style.display = 'none';
        }, 10);
    }

    /**
     * Internal method to render the canvas
     */
    _renderCanvas() {
        const { width, height, demData } = this.demProcessor;
        const colorScale = colorScales[this.colorScheme];
        
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
        
        // Clear the 2D container and add the canvas
        // Keep the loading div
        const loadingDiv = this.container.querySelector('.loading');
        this.container.innerHTML = '';
        this.container.appendChild(loadingDiv);
        
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.objectFit = 'contain';
        this.container.appendChild(canvas);
    }
}