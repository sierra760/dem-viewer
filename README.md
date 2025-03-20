# DEM Viewer

A browser-based application for visualizing Digital Elevation Models (DEMs) from GeoTIFF files.

## Features

- Drag and drop interface for GeoTIFF files
- Split view showing both 2D and 3D visualizations
- Interactive 3D terrain model with WASD navigation and mouse controls
- Multiple color schemes for elevation visualization
- Adjustable vertical exaggeration
- Basic DEM statistics display

## Installation

1. Clone this repository:
```bash
git clone https://github.com/sierra760/dem-viewer.git
cd dem-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Quick Setup

For convenience, you can use the included build script to install, build and run in one step:

```bash
chmod +x build.sh
./build.sh
```

## Development

For development with auto-rebuilding:
```bash
# In one terminal - watch for file changes and rebuild
npm run watch

# In a separate terminal - run the development server 
npm run dev
```

## Debugging

If you encounter issues:

1. Check the browser console for error messages
2. For a development build with more verbose output:
```bash
npm run build:dev
npm start
```

## Project Structure

```
dem-viewer/
├── src/              - Source code
│   ├── index.js      - Main entry point
│   ├── index.html    - HTML template
│   ├── css/          - Stylesheets
│   └── js/           - JavaScript modules
├── public/           - Built application (generated)
├── webpack.config.js - Webpack configuration
└── server.js         - Express server
```

## Usage

1. Drag and drop a GeoTIFF file containing elevation data into the drop zone
2. View the 2D visualization on the left panel
3. Interact with the 3D model on the right panel using:
   - WASD keys to move the camera
   - Click and drag to rotate the view
   - Mouse wheel to zoom in/out
4. Adjust the vertical exaggeration using the slider
5. Change color schemes using the dropdown menus

## Technologies Used

- Node.js and Express for the server
- Three.js for 3D visualization
- GeoTIFF.js for parsing elevation data
- Modern JavaScript (ES6+)

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request