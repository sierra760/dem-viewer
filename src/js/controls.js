import * as THREE from 'three';

/**
 * Camera and interaction controls for the 3D view
 */
export class Controls {
    constructor(renderer3d) {
        this.renderer3d = renderer3d;
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false
        };
        
        this.mouseDown = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        // Set up control handlers once the 3D renderer is initialized
        const checkRendererInterval = setInterval(() => {
            if (this.renderer3d.renderer && this.renderer3d.camera) {
                this.setupKeyboardControls();
                this.setupMouseControls();
                clearInterval(checkRendererInterval);
            }
        }, 100);
    }

    /**
     * Set up keyboard controls (WASD)
     */
    setupKeyboardControls() {
        // Add key event listeners
        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key.toLowerCase())) {
                this.keys[e.key.toLowerCase()] = true;
                e.preventDefault(); // Prevent default browser behaviors like scrolling
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key.toLowerCase())) {
                this.keys[e.key.toLowerCase()] = false;
            }
        });
        
        // Add update function to window for the animation loop
        window.updateCamera = () => {
            if (!this.renderer3d.camera) return;
            
            const camera = this.renderer3d.camera;
            const speed = Math.max(5, camera.position.length() * 0.01);
            
            if (this.keys.w || this.keys.s || this.keys.a || this.keys.d) {
                // Get camera direction vectors
                const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
                const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
                
                // Ensure movement is parallel to XZ plane
                forward.y = 0;
                forward.normalize();
                right.y = 0;
                right.normalize();
                
                // Create movement vector
                const moveDir = new THREE.Vector3(0, 0, 0);
                
                if (this.keys.w) moveDir.add(forward);
                if (this.keys.s) moveDir.sub(forward);
                if (this.keys.a) moveDir.sub(right);
                if (this.keys.d) moveDir.add(right);
                
                // Normalize if moving in multiple directions
                if (moveDir.length() > 0) moveDir.normalize();
                
                // Move camera
                camera.position.addScaledVector(moveDir, speed);
            }
        };
    }

    /**
     * Set up mouse controls (rotation and zoom)
     */
    setupMouseControls() {
        const renderer = this.renderer3d.renderer;
        const camera = this.renderer3d.camera;
        
        // Mouse movement for rotation
        renderer.domElement.addEventListener('mousedown', (e) => {
            this.mouseDown = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });
        
        window.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });
        
        window.addEventListener('mousemove', (e) => {
            if (this.mouseDown) {
                const deltaX = e.clientX - this.lastMouseX;
                const deltaY = e.clientY - this.lastMouseY;
                
                // Rotate the camera around the target point
                const rotationSpeed = 0.005;
                
                // Create a temporary vector to store camera position
                const position = new THREE.Vector3().copy(camera.position);
                
                // Rotate around Y axis (left/right)
                position.sub(new THREE.Vector3(0, 0, 0)); // Subtract target position
                position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -deltaX * rotationSpeed);
                position.add(new THREE.Vector3(0, 0, 0)); // Add target position back
                
                // Rotate around X axis (up/down)
                const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
                position.sub(new THREE.Vector3(0, 0, 0));
                position.applyAxisAngle(right, -deltaY * rotationSpeed);
                position.add(new THREE.Vector3(0, 0, 0));
                
                camera.position.copy(position);
                camera.lookAt(new THREE.Vector3(0, 0, 0));
                
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
            }
        });
        
        // Zoom with mouse wheel
        renderer.domElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            // Zoom speed factor
            const zoomFactor = 0.1;
            
            // Zoom direction
            const direction = new THREE.Vector3().subVectors(
                new THREE.Vector3(0, 0, 0), // Target point
                camera.position
            ).normalize();
            
            // Move camera closer or further based on wheel direction
            if (e.deltaY > 0) {
                // Zoom out
                camera.position.addScaledVector(direction, -zoomFactor * camera.position.length());
            } else {
                // Zoom in
                camera.position.addScaledVector(direction, zoomFactor * camera.position.length());
            }
        });
    }
}