import * as THREE from "three";

let inputClickEventsReference;
let sceneUIEventsReference;
let modeChangeEventsReference;
let infoWindowEventsReference;
let windowResizeEventsReference;
let transformControlEventsReference;
let predefinedModelsEventsReference;

// Removing event listeners
export const removeEventListeners = (menu) => {
  const models = document.getElementById("predefined-models").childNodes;

  // Listens to transform control mouse events on objects
  menu.currentWorld.transformControls.removeEventListener(
    "dragging-changed",
    transformControlEventsReference
  );

  // Covers every input in left menu UI
  document
    .getElementById("menu-ui")
    .removeEventListener("input", inputClickEventsReference);

  // Top menu bar click events
  document
    .getElementById("menu-bar")
    .removeEventListener("click", inputClickEventsReference);

  // Scene UI events
  document
    .getElementById("scene-outline")
    .removeEventListener("click", sceneUIEventsReference);

  // Bottom mode change bar
  document
    .getElementById("mode-ui")
    .removeEventListener("click", modeChangeEventsReference);

  // Info button on the bottom event
  document
    .getElementById("info")
    .removeEventListener("click", infoWindowEventsReference);

  // info component "X" button
  document
    .getElementById("info-close")
    .removeEventListener("click", infoWindowEventsReference);

  // Window resizing event
  window.removeEventListener("resize", windowResizeEventsReference);

  // predefined model section event
  models.forEach((child) => {
    child.removeEventListener("click", predefinedModelsEventsReference);
  });
};

const windowResizeEvents = (menu, canvas) => {
  menu.currentWorld.camera.aspect = window.innerWidth / window.innerHeight;
  menu.currentWorld.camera.updateProjectionMatrix();
  canvas.renderer.setSize(window.innerWidth, window.innerHeight);
};

// Assigning event listeners
export const eventListeners = (menu, canvas, worlds) => {
  const models = document.getElementById("predefined-models").childNodes;

  // function references
  inputClickEventsReference = (e) => inputClickEvents(e, menu);
  sceneUIEventsReference = (e) => sceneUIEvents(e, menu);
  modeChangeEventsReference = (e) => modeChangeEvents(e, menu, worlds);
  infoWindowEventsReference = () => infoWindowEvents(menu);
  windowResizeEventsReference = () => windowResizeEvents(menu, canvas);
  transformControlEventsReference = (e) => transformControlEvents(e, menu);
  predefinedModelsEventsReference = (e) => predefinedModelsEvents(e, menu);

  // Listens to transform control mouse events on objects
  menu.currentWorld.transformControls.addEventListener(
    "dragging-changed",
    transformControlEventsReference
  );

  // Covers every input in left menu UI
  document
    .getElementById("menu-ui")
    .addEventListener("input", inputClickEventsReference);

  // Top menu bar click events
  document
    .getElementById("menu-bar")
    .addEventListener("click", inputClickEventsReference);

  // Scene UI events
  document
    .getElementById("scene-outline")
    .addEventListener("click", sceneUIEventsReference);

  // Bottom mode change bar
  document
    .getElementById("mode-ui")
    .addEventListener("click", modeChangeEventsReference);

  // info button on the bottom
  document
    .getElementById("info")
    .addEventListener("click", infoWindowEventsReference);

  // info component "X" button
  document
    .getElementById("info-close")
    .addEventListener("click", infoWindowEventsReference);

  // window resizing event
  window.addEventListener("resize", windowResizeEventsReference);

  // predefined model section event
  models.forEach((child) => {
    child.addEventListener("click", predefinedModelsEventsReference);
  });
};

export const reassigningModeEventListeners = (menu) => {
  if (menu.currentMode === "editor") {
    const models = document.getElementById("predefined-models").childNodes;

    // readding predefined model section event
    models.forEach((child) => {
      child.addEventListener("click", predefinedModelsEventsReference);
    });
  }

  // Readding info window close event listener
  document.getElementById("info-close")?.addEventListener("click", (e) => {
    menu.showInfo();
  });

  document.getElementById("add-object")?.addEventListener("click", (e) => {
    menu.action({
      name: "add-object",
      value: e.target.id,
      ctrl: e.ctrlKey,
    });
  });
};

export const reassigningObjectEventListeners = (menu) => {
  document.getElementById("btn-translate")?.addEventListener("click", () => {
    const transformX = Number(document.getElementById("transform-x").value);
    const transformY = Number(document.getElementById("transform-y").value);
    const transformZ = Number(document.getElementById("transform-z").value);
    const translate = new THREE.Vector3(transformX, transformY, transformZ);

    if (menu.selectedObjects.length > 0) {
      menu.selectedObjects.forEach((object) => {
        object.position.add(translate);
      });
    }
  });

  document.getElementById("btn-scale")?.addEventListener("click", () => {
    const scaleX = Number(document.getElementById("transform-x").value);
    const scaleY = Number(document.getElementById("transform-y").value);
    const scaleZ = Number(document.getElementById("transform-z").value);
    const scale = new THREE.Vector3(scaleX, scaleY, scaleZ);
    const translate = new THREE.Vector3(scaleX / 2, scaleY / 2, scaleZ / 2);

    if (menu.selectedObjects.length > 0) {
      menu.selectedObjects.forEach((object) => {
        object.scale.add(scale);
        object.position.add(translate);
      });
    }
  });

  document.getElementById("btn-rotate")?.addEventListener("click", (e) => {
    const rotateX = Number(document.getElementById("transform-x").value);
    const rotateY = Number(document.getElementById("transform-y").value);
    const rotateZ = Number(document.getElementById("transform-z").value);
    const valueX = rotateX * (Math.PI / 180);
    const valueY = rotateY * (Math.PI / 180);
    const valueZ = rotateZ * (Math.PI / 180);

    if (menu.selectedObjects.length > 0) {
      menu.selectedObjects.forEach((object) => {
        object.rotateX(valueX);
        object.rotateY(valueY);
        object.rotateZ(valueZ);
      });
    }
  });
};

// Event listener functions
const predefinedModelsEvents = (e, menu) => {
  menu.action({
    name: "predefined-model",
    value: e.currentTarget.id,
  });
};

const transformControlEvents = (e, menu) => {
  menu.currentWorld.controls.enabled = !e.value;
};

const inputClickEvents = (e, menu) => {
  menu.action({
    name: e.target.name,
    checked: e.target.checked,
    value: e.target.value,
  });
};

const sceneUIEvents = (e, menu) => {
  menu.action({
    name: "scene",
    type: e.target?.name,
    id: e.target?.id,
    dataset: e.target.dataset,
    value: e.target.id,
    element: e.target,
    ctrl: e.ctrlKey,
  });
};

const modeChangeEvents = (e, menu, worlds) => {
  const buttonId = e.target.id;

  e.target.parentNode.childNodes.forEach((element) => {
    element.className = "";
  });
  e.target.className = "selected-mode";

  // Changing the mode
  menu.modeChange(buttonId, worlds[buttonId]);

  reassigningModeEventListeners(menu);
  reassigningObjectEventListeners(menu);
};

const infoWindowEvents = (menu) => {
  menu.showInfo();
};
