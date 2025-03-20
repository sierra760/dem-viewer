/**
 * DEM Processor class for handling GeoTIFF data
 */
export class DEMProcessor {
    constructor() {
        this.demData = null;
        this.width = 0;
        this.height = 0;
        this.minValue = 0;
        this.maxValue = 0;
        this.meanValue = 0;
        this.stdDevValue = 0;
        this.noDataValue = null;
    }

    /**
     * Process a GeoTIFF file and extract elevation data
     * @param {File} file - The GeoTIFF file to process
     * @returns {Promise} - Resolves when processing is complete
     */
    async processGeoTIFF(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            
            // Check if GeoTIFF library is loaded
            if (typeof window.GeoTIFF === 'undefined') {
                throw new Error("GeoTIFF library not loaded");
            }
            
            const tiff = await window.GeoTIFF.fromArrayBuffer(arrayBuffer);
            const image = await tiff.getImage();
            
            // Get image dimensions
            this.width = image.getWidth();
            this.height = image.getHeight();
            
            // Read raster data
            const rasterData = await image.readRasters();
            
            // Assuming the first band contains elevation data
            this.demData = rasterData[0];
            
            // Calculate statistics
            this.calculateStatistics();
            
            return {
                width: this.width,
                height: this.height,
                demData: this.demData,
                statistics: {
                    min: this.minValue,
                    max: this.maxValue,
                    mean: this.meanValue,
                    stdDev: this.stdDevValue,
                    noData: this.noDataValue
                }
            };
            
        } catch (error) {
            console.error('Error processing GeoTIFF:', error);
            throw error;
        }
    }

    /**
     * Calculate statistics from the DEM data
     */
    calculateStatistics() {
        if (!this.demData) return;
        
        // Find min and max values
        this.minValue = Infinity;
        this.maxValue = -Infinity;
        let sum = 0;
        let validCount = 0;
        this.noDataValue = null;
        
        // First pass to find min, max, and mean
        for (let i = 0; i < this.demData.length; i++) {
            const value = this.demData[i];
            
            // Skip nodata values (assuming NaN or very negative values are nodata)
            if (isNaN(value) || value < -9000) {
                if (this.noDataValue === null) this.noDataValue = value;
                continue;
            }
            
            this.minValue = Math.min(this.minValue, value);
            this.maxValue = Math.max(this.maxValue, value);
            sum += value;
            validCount++;
        }
        
        this.meanValue = sum / validCount;
        
        // Second pass to calculate standard deviation
        let sumSquaredDiff = 0;
        for (let i = 0; i < this.demData.length; i++) {
            const value = this.demData[i];
            
            // Skip nodata values
            if (isNaN(value) || value < -9000) continue;
            
            sumSquaredDiff += Math.pow(value - this.meanValue, 2);
        }
        
        this.stdDevValue = Math.sqrt(sumSquaredDiff / validCount);
        
        // Update the statistics display
        this.updateStatisticsDisplay();
    }

    /**
     * Update the statistics display in the UI
     */
    updateStatisticsDisplay() {
        document.getElementById('minVal').textContent = this.minValue.toFixed(2);
        document.getElementById('maxVal').textContent = this.maxValue.toFixed(2);
        document.getElementById('meanVal').textContent = this.meanValue.toFixed(2);
        document.getElementById('stdVal').textContent = this.stdDevValue.toFixed(2);
        document.getElementById('noDataVal').textContent = this.noDataValue !== null ? this.noDataValue.toString() : 'None';
        document.getElementById('dimensions').textContent = `${this.width} × ${this.height}`;
    }

    /**
     * Get the normalized value (0-1) for a given elevation
     * @param {number} value - The elevation value
     * @returns {number} - Normalized value between 0 and 1
     */
    getNormalizedValue(value) {
        // Skip nodata values
        if (isNaN(value) || (this.noDataValue !== null && value === this.noDataValue)) {
            return null;
        }
        
        // Normalize value between 0 and 1
        return (value - this.minValue) / (this.maxValue - this.minValue);
    }
}