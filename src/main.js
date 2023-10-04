import * as THREE from 'three'
import { Menu } from "./UI/Menu"
import { Scene } from "./scene"
import { World } from "./world"
import { onPointerDown, onPointerMove, raycasterIntersections } from "./raycasting"
import populateEventListeners from './utilities/populateEventListeners'
import Stats from 'three/examples/jsm/libs/stats.module'

// Performance monitor
const stats = new Stats()
document.body.appendChild(stats.dom)

// MODES
const modes = { editor: "editor", study: "study", play: "play", craft: "craft"}

const sceneObject = new Scene(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const studyScene = new Scene(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const menu = new Menu(sceneObject)
const worldObject = new World(sceneObject, menu)
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
  raycasterIntersections(menu.currentMode, raycaster, pointer, sceneObject, worldObject)

  // Render the scene
  menu.currentScene.renderer.render(menu.currentScene.scene, menu.currentScene.camera)

  // Store the current time for the next frame
  previousTime = currentTime;

  stats.update()
}

let previousTime = performance.now();

animate()



// EVENT LISTENERS FOR INTERACTIONS

// REMEMBER TO REMOVE EVENT LISTENERS ON DIFFERENT MODES
if (menu.currentMode === modes.editor) {
  sceneObject.renderer.domElement.addEventListener("pointermove", event => {
    onPointerMove(event, pointer)
  })

  sceneObject.renderer.domElement.addEventListener("pointerdown", (e) => {
    onPointerDown(e, pointer, raycaster, sceneObject, worldObject, menu)
  })
}

populateEventListeners(menu, worldObject, sceneObject, studyScene)
