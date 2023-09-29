import "./UI/Menu"

import * as THREE from 'three'
import { Scene } from "./scene"
import { World } from "./world"
import { onPointerDown, onPointerMove, raycasterIntersections } from "./raycasting"
import Stats from 'three/examples/jsm/libs/stats.module'

// Performance monitor
const stats = new Stats()
document.body.appendChild(stats.dom)


// MODES
const modes = { edit: "edit", paint: "paint", view: "view", play: "play"}
let currentMode = modes.edit

const sceneObject = new Scene(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const worldObject = new World(sceneObject)
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const animate = () => {
  // Request next frame
  requestAnimationFrame(animate)

  // Calculate the elapsed time since the last frame
  const currentTime = performance.now();
  const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds

  // Update game objects based on deltaTime
  worldObject.update(deltaTime)
  raycasterIntersections(currentMode, raycaster, pointer, sceneObject, worldObject)

  // Render the scene
  sceneObject.renderer.render(sceneObject.scene, sceneObject.camera)

  // Store the current time for the next frame
  previousTime = currentTime;

  stats.update()
}

let previousTime = performance.now();

animate()

// REMEMBER TO REMOVE EVENT LISTENERS ON DIFFERENT MODES
if (currentMode === modes.edit) {
  window.addEventListener("pointermove", event => {
    onPointerMove(event, pointer, worldObject)
  })

  window.addEventListener("pointerdown", (e) => onPointerDown(e, pointer, raycaster, sceneObject, worldObject))
}

window.addEventListener('resize', () => {
  sceneObject.camera.aspect = window.innerWidth / window.innerHeight;
  sceneObject.camera.updateProjectionMatrix();
  sceneObject.renderer.setSize(window.innerWidth, window.innerHeight);
})

