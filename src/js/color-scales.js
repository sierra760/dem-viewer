/**
 * Color scale functions for different visualization schemes
 */
export const colorScales = {
    viridis: (t) => {
        // Approximation of the viridis color scheme
        const r = Math.max(0, Math.min(255, Math.floor(68.5 - 4.5 * t + 387.9 * t * t - 630.9 * t * t * t + 348.8 * t * t * t * t)));
        const g = Math.max(0, Math.min(255, Math.floor(84.5 + 8.3 * t + 79.2 * t * t - 168.7 * t * t * t + 76.7 * t * t * t * t)));
        const b = Math.max(0, Math.min(255, Math.floor(134.3 + 19.3 * t - 98.8 * t * t + 26.5 * t * t * t + 20.2 * t * t * t * t)));
        return `rgb(${r}, ${g}, ${b})`;
    },
    plasma: (t) => {
        // Approximation of the plasma color scheme
        const r = Math.max(0, Math.min(255, Math.floor(12.9 + 481.1 * t - 645.7 * t * t + 423.4 * t * t * t - 72.8 * t * t * t * t)));
        const g = Math.max(0, Math.min(255, Math.floor(11.1 + 151.4 * t - 317.2 * t * t + 222.9 * t * t * t - 38.6 * t * t * t * t)));
        const b = Math.max(0, Math.min(255, Math.floor(132.1 + 59.8 * t - 287.1 * t * t + 211.0 * t * t * t - 113.5 * t * t * t * t)));
        return `rgb(${r}, ${g}, ${b})`;
    },
    inferno: (t) => {
        // Approximation of the inferno color scheme
        const r = Math.max(0, Math.min(255, Math.floor(0.9 + 24.7 * t + 606.6 * t * t - 1110.0 * t * t * t + 527.8 * t * t * t * t)));
        const g = Math.max(0, Math.min(255, Math.floor(26.5 - 24.9 * t + 288.8 * t * t - 309.2 * t * t * t + 103.6 * t * t * t * t)));
        const b = Math.max(0, Math.min(255, Math.floor(130.4 - 266.8 * t + 161.2 * t * t + 1.6 * t * t * t - 26.4 * t * t * t * t)));
        return `rgb(${r}, ${g}, ${b})`;
    },
    magma: (t) => {
        // Approximation of the magma color scheme
        const r = Math.max(0, Math.min(255, Math.floor(3.5 + 52.9 * t + 378.7 * t * t - 739.8 * t * t * t + 357.8 * t * t * t * t)));
        const g = Math.max(0, Math.min(255, Math.floor(18.9 - 14.3 * t + 213.8 * t * t - 274.9 * t * t * t + 125.6 * t * t * t * t)));
        const b = Math.max(0, Math.min(255, Math.floor(97.0 - 96.6 * t + 42.4 * t * t + 14.9 * t * t * t - 3.9 * t * t * t * t)));
        return `rgb(${r}, ${g}, ${b})`;
    },
    terrain: (t) => {
        let r, g, b;
        if (t < 0.25) {
            r = 0;
            g = 0.5 + t * 2;
            b = 0;
        } else if (t < 0.5) {
            r = (t - 0.25) * 4;
            g = 1;
            b = 0;
        } else if (t < 0.75) {
            r = 1;
            g = 1 - (t - 0.5) * 4;
            b = (t - 0.5) * 4;
        } else {
            r = 1 - (t - 0.75) * 4;
            g = 0;
            b = 1;
        }
        r = Math.max(0, Math.min(1, r)) * 255;
        g = Math.max(0, Math.min(1, g)) * 255;
        b = Math.max(0, Math.min(1, b)) * 255;
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    },
    rainbow: (t) => {
        // Rainbow color scheme
        const a = (1 - t) * 5;
        const X = Math.floor(a);
        const Y = Math.floor(255 * (a - X));
        let r, g, b;
        switch (X) {
            case 0: r = 255; g = Y; b = 0; break;
            case 1: r = 255 - Y; g = 255; b = 0; break;
            case 2: r = 0; g = 255; b = Y; break;
            case 3: r = 0; g = 255 - Y; b = 255; break;
            case 4: r = Y; g = 0; b = 255; break;
            case 5: r = 255; g = 0; b = 255; break;
        }
        return `rgb(${r}, ${g}, ${b})`;
    },
    gray: (t) => {
        // Grayscale
        const val = Math.floor(t * 255);
        return `rgb(${val}, ${val}, ${val})`;
    }
};