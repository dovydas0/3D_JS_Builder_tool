import * as THREE from 'three'
import { Menu } from "./UI/Menu"
import { Scene } from "./scene"
import { World } from "./world"
import { onPointerDown, onPointerMove, raycasterIntersections } from "./raycasting"
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



// UI EVENT LISTENERS

document.getElementById('dimension-inputs').addEventListener('input', e => {
  e.target.value <= 0 ? e.target.value = 1 : null
  e.target.value >= 50 ? e.target.value = 50 : null
    
  menu.action({ 
    name: "dimensions", 
    checked: null,
    value: e.target.value,
  }, worldObject);
}) 

document.getElementById('menu-ui').addEventListener('click', (e) => {
  // IF NOT ROBUST ENOUGH ADD AN HTML TAG CHECK BEFORE PASSING INFO

  if (e.target.name !== "dimensions") {
    menu.action({ 
      name: e.target.name, 
      checked: e.target.checked,
      value: e.target.value,
    }, worldObject);
  }
})

document.getElementById('mode-ui').addEventListener('click', (e) => {
  e.target.parentNode.childNodes.forEach(element => {
    element.className = ''
  })
  e.target.className = "selected-mode"
  
  // Changing the mode
  menu.modeChange(e.target.id, studyScene)

  // Adding/removing placeholder block depending on the selected mode
  if (e.target.id === "editor") {
    menu.action({name: "objects"}, worldObject);
  } else {
    sceneObject.removeObject(worldObject.placeholderObject.mesh)
  }
})

window.addEventListener('resize', () => {
  sceneObject.camera.aspect = window.innerWidth / window.innerHeight;
  sceneObject.camera.updateProjectionMatrix();
  sceneObject.renderer.setSize(window.innerWidth, window.innerHeight);
})

