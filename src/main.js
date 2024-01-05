import * as THREE from "three";
import { Menu } from "./UI/Menu.js";
import {
  onPointerDown,
  onPointerMove,
  raycasterIntersections,
} from "./raycasting";
import {
  eventListeners,
  removeEventListeners,
} from "./utilities/populateEventListeners";
import Stats from "three/examples/jsm/libs/stats.module";
import { Canvas } from "./canvas";
import { EditorWorld } from "./worlds/editorWorld";
import { StudyWorld } from "./worlds/studyWorld";
import { CraftWorld } from "./worlds/craftWorld";
import { Cube } from "./objects/interactive/Cube";
import { populatePredefinedModels } from "./utilities/populatePredefinedModels.js";
import { BoxHelper } from "./helpers/boxHelper.js";

// Performance monitor
const stats = new Stats();
stats.dom.classList.add("stats-data");
document.body.appendChild(stats.dom);

populatePredefinedModels();

// MODES
const modes = {
  editor: "editor",
  study: "study",
  play: "play",
  craft: "craft",
};

const initplaceholderObject = new Cube(
  "void-obj-placeholder-obj",
  1,
  1,
  1,
  0x5544aa,
  "Basic",
  true
);

const initPlaceholderObjectArr = {
  object: initplaceholderObject,
  color: 0x5544aa,
};

const canvas = new Canvas(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const boxHelper = new BoxHelper();

const editorWorld = new EditorWorld(canvas, initplaceholderObject);
const studyWorld = new StudyWorld(canvas);
const craftWorld = new CraftWorld(canvas);
let worlds = {
  study: studyWorld,
  editor: editorWorld,
  play: editorWorld,
  craft: craftWorld,
};

// Reinitializing editor world and menu on "new" click in the top menu-bar
const newEditor = () => {
  removeEventListeners(menu);

  const sceneObjects = document.getElementById("scene-objects");
  sceneObjects.innerHTML = "";

  const editorWorld = new EditorWorld(canvas, initplaceholderObject);
  worlds = {
    study: studyWorld,
    editor: editorWorld,
    play: editorWorld,
    craft: craftWorld,
  };

  menu = new Menu(editorWorld, initPlaceholderObjectArr, newEditor, boxHelper);

  editorWorld.initWorld();

  // Reassigning event listeners to the new world
  eventListeners(menu, canvas, worlds);
};

let menu = new Menu(
  worlds.editor,
  initPlaceholderObjectArr,
  newEditor,
  boxHelper
);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

worlds.editor.initWorld();
worlds.study.initWorld(menu, canvas);
worlds.craft.initWorld(menu, canvas);

const animate = () => {
  // Request next frame
  requestAnimationFrame(animate);

  // Calculate the elapsed time since the last frame
  const currentTime = performance.now();
  const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds

  // Update game objects based on deltaTime
  raycasterIntersections(
    menu.currentMode,
    raycaster,
    pointer,
    menu.currentWorld
  );

  // updating controls to allow auto rotate functionality
  if (worlds.study.controls.autoRotate) {
    worlds.study.update();
  }
  boxHelper.update(menu);
  worlds.editor.updateControls(deltaTime);

  render();

  // Store the current time for the next frame
  previousTime = currentTime;

  stats.update();
};

const render = () => {
  // Render the scene
  canvas.renderer.render(menu.currentWorld.scene, menu.currentWorld.camera);
};

let previousTime = performance.now();

animate();

// EVENT LISTENERS FOR INTERACTIONS
menu.currentWorld.transformControls.addEventListener("change", render);

// REMEMBER TO REMOVE EVENT LISTENERS ON DIFFERENT MODES
if (menu.currentMode === modes.editor || menu.currentMode === modes.study) {
  canvas.renderer.domElement.addEventListener("pointermove", (event) => {
    onPointerMove(event, pointer);
  });

  canvas.renderer.domElement.addEventListener("pointerdown", (event) => {
    onPointerDown(event, pointer, raycaster, menu);
  });
}

eventListeners(menu, canvas, worlds);
