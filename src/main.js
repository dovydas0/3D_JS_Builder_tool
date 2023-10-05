import * as THREE from 'three'
import { Menu } from "./UI/Menu"
import { Scene } from "./scene"
import { World } from "./world"
import { onPointerDown, onPointerMove, raycasterIntersections } from "./raycasting"
import populateEventListeners from './utilities/populateEventListeners'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Canvas } from './canvas'

// Performance monitor
const stats = new Stats()
document.body.appendChild(stats.dom)

// MODES
const modes = { editor: "editor", study: "study", play: "play", craft: "craft"}

const canvas = new Canvas(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const editorScene = new Scene("editor")
const studyScene = new Scene("study")
const craftScene = new Scene("craft")
const scenes = {
  study: studyScene,
  editor: editorScene,
  play: editorScene,
  craft: craftScene
}
const menu = new Menu(scenes.editor)
const worldObject = new World(canvas, menu)
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

worldObject.initWorld(scenes.study)
worldObject.initWorld(scenes.editor)
// worldObject.initWorld(scenes.craft)

const animate = () => {
  // Request next frame
  requestAnimationFrame(animate)

  // Calculate the elapsed time since the last frame
  const currentTime = performance.now();
  const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds

  // Update game objects based on deltaTime
  if (menu.currentMode === modes.editor) {
    raycasterIntersections(menu.currentMode, raycaster, pointer, canvas, worldObject)
  }

  // CALL UPDATE CONTROLS AFTER ANY MANUAL CAMERA TRANSFORM
  worldObject.updateControls(deltaTime)

  // Render the scene
  canvas.renderer.render(menu.currentScene.scene, canvas.camera)

  // Store the current time for the next frame
  previousTime = currentTime;

  stats.update()
}

let previousTime = performance.now();

animate()



// EVENT LISTENERS FOR INTERACTIONS

// REMEMBER TO REMOVE EVENT LISTENERS ON DIFFERENT MODES
if (menu.currentMode === modes.editor) {
  canvas.renderer.domElement.addEventListener("pointermove", event => {
    onPointerMove(event, pointer)
  })

  canvas.renderer.domElement.addEventListener("pointerdown", (e) => {
    onPointerDown(e, pointer, raycaster, canvas, worldObject, menu)
  })
}

populateEventListeners(menu, worldObject, canvas, scenes)
