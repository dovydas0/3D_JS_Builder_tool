import * as THREE from 'three'
import { Menu } from "./UI/Menu.js"
import { Scene } from "./scene"
import { World } from "./worlds/world"
import { onPointerDown, onPointerMove, raycasterIntersections } from "./raycasting"
import { eventListeners } from './utilities/populateEventListeners'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Canvas } from './canvas'
import { EditorWorld } from './worlds/editorWorld'
import { StudyWorld } from './worlds/studyWorld'
import { CraftWorld } from './worlds/craftWorld'
import { Cube } from './objects/interactive/Cube'

// Performance monitor
const stats = new Stats()
document.body.appendChild(stats.dom)

// MODES
const modes = { editor: "editor", study: "study", play: "play", craft: "craft"}

const initplaceholderObject = new Cube("object", 1, 1, 1, 0x5544AA, "Basic", true)
const initPlaceholderObjectArr = {
  object: initplaceholderObject,
  color: 0x5544AA,
}
const canvas = new Canvas(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const editorWorld = new EditorWorld(canvas, initplaceholderObject)
const studyWorld = new StudyWorld(canvas)
const craftWorld = new CraftWorld(canvas)
const worlds = {
  study: studyWorld,
  editor: editorWorld,
  play: editorWorld,
  craft: craftWorld
}

const menu = new Menu(worlds.editor, initPlaceholderObjectArr)
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

editorWorld.initWorld(editorWorld, menu, canvas)
studyWorld.initWorld(studyWorld, menu, canvas)
craftWorld.initWorld(craftWorld, menu, canvas)

const animate = () => {
  // Request next frame
  requestAnimationFrame(animate)

  // Calculate the elapsed time since the last frame
  const currentTime = performance.now();
  const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds

  // Update game objects based on deltaTime
  if (menu.currentMode === modes.editor) {
    raycasterIntersections(menu.currentMode, raycaster, pointer, menu.currentWorld)
  }
  if (studyWorld.controls.autoRotate) {
    studyWorld.update()
  }
  editorWorld.updateControls(deltaTime)

  // Render the scene
  canvas.renderer.render(menu.currentScene, menu.currentWorld.camera)

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
    onPointerDown(e, pointer, raycaster, menu.currentWorld, menu)
  })
}

eventListeners(menu, canvas, worlds)
