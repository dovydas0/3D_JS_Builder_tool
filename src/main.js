import * as THREE from "three";
import { Menu } from "./UI/Menu.js";
import {
  onPointerDown,
  onPointerMove,
  raycasterIntersections,
} from "./raycasting";
import { eventListeners } from "./utilities/populateEventListeners";
import Stats from "three/examples/jsm/libs/stats.module";
import { Canvas } from "./canvas";
import { EditorWorld } from "./worlds/editorWorld";
import { StudyWorld } from "./worlds/studyWorld";
import { CraftWorld } from "./worlds/craftWorld";
import { Cube } from "./objects/interactive/Cube";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

// Performance monitor
const stats = new Stats();
stats.dom.classList.add("stats-data");
document.body.appendChild(stats.dom);

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

const editorWorld = new EditorWorld(canvas, initplaceholderObject);
const studyWorld = new StudyWorld(canvas);
const craftWorld = new CraftWorld(canvas);
let worlds = {
  study: studyWorld,
  editor: editorWorld,
  play: editorWorld,
  craft: craftWorld,
};

const newEditor = () => {
  const sceneObjects = document.getElementById("scene-objects");

  sceneObjects.innerHTML = "";
  // sceneObjects.childNodes.forEach((node) => {
  //   console.log(node);
  //   // sceneObjects.removeChild(node);
  // });
  // console.log(sceneObjects.children);
  // Object.keys(sceneObjects.children).forEach((value) => {
  //   console.log(sceneObjects.children[value]);
  // });

  // console.log(sceneObjects);

  // menu.removeFromMenuScene(id)

  const editorWorld = new EditorWorld(canvas, initplaceholderObject);
  worlds = {
    study: studyWorld,
    editor: editorWorld,
    play: editorWorld,
    craft: craftWorld,
  };
  menu = new Menu(worlds.editor, initPlaceholderObjectArr, newEditor);

  editorWorld.initWorld();
  eventListeners(menu, canvas, worlds);
};

let menu = new Menu(worlds.editor, initPlaceholderObjectArr, newEditor);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

worlds.editor.initWorld();
worlds.study.initWorld(menu, canvas);
worlds.craft.initWorld(menu, canvas);

// SELECTING OBJECT TEST
// let selectedObjects = []

// const composer = new EffectComposer(canvas.renderer);

// const renderPass = new RenderPass(menu.currentWorld.scene, menu.currentWorld.camera);

// composer.addPass(renderPass);

// const outline = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), menu.currentWorld.scene, menu.currentWorld.camera);
// outline.edgeThickness = 2.0;
// outline.edgeStrength = 3.0;
// outline.visibleEdgeColor.set(0xff0000);

// composer.addPass(outline);

// const textureLoader = new THREE.TextureLoader();
// textureLoader.load("/tri_pattern.jpg", function(texture){
//     if (texture) {
//         outline.patternTexture = texture;
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;
//     }
// });

// const fxaaShader = new ShaderPass(FXAAShader);
// fxaaShader.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight);
// composer.addPass(fxaaShader);

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
  worlds.editor.updateControls(deltaTime);

  // Render the scene
  canvas.renderer.render(menu.currentWorld.scene, menu.currentWorld.camera);
  // composer.render()

  // Store the current time for the next frame
  previousTime = currentTime;

  stats.update();
};

let previousTime = performance.now();

animate();

// EVENT LISTENERS FOR INTERACTIONS

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

function addSelectedObject(object) {
  selectedObjects = [];
  selectedObjects.push(object);
}
