import * as THREE from "three";
import _ from "lodash";
import { CompressedArrayTexture } from "three/src/textures/CompressedArrayTexture";
import { Cube } from "../objects/interactive/Cube";
import { Cylinder } from "../objects/interactive/Cylinder";
import { Sphere } from "../objects/interactive/Sphere";
import { Capsule } from "../objects/interactive/Capsule";
import { changeInfo } from "./changeInfo";
import { changeMenu } from "./changeMenu";
import { changeSceneMenu } from "./changeSceneMenu";
import { changeObjectMenu } from "./changeObjectMenu";
import { reassigningObjectEventListeners } from "../utilities/populateEventListeners";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { nameConverter } from "../utilities/nameConverter";
import { gltfObject } from "../importers/gltfObject";
import { objObject } from "../importers/objObject";
import { EditorWorld } from "../worlds/editorWorld";
import { modelLoader, modelSaver } from "../utilities/modelLoader";
import { nonRepeatingName } from "../utilities/nonRepeatingName";
import { BoxHelper } from "../helpers/boxHelper";
import {
  grabPredefinedData,
  populatePredefinedModels,
} from "../utilities/populatePredefinedModels";

export class Menu {
  constructor(worldObject, placeholderObject, newEditor, boxHelper, modelData) {
    // STORE ALL BLOCKS IN AN ARRAY HERE
    this.modelData = modelData;
    this.savedModel = [];
    this.newEditor = newEditor;
    this.gltfObj = new gltfObject();
    this.objObj = new objObject();
    this.currentMode = "editor";
    this.currentWorld = worldObject;
    this.menuParameterCapture = {
      study: {},
      editor: {},
      play: {},
      craft: {},
    };

    this.boxHelper = boxHelper;
    this.currentObject = placeholderObject.object;
    this.currentObjectColor = placeholderObject.color;
    this.selectedObjects = [];

    // Accessing all necessary handles in the menu
    this.floorTiles = document.getElementById("floor-tile").checked;
    this.axisHelper = document.getElementById("axis-helper").checked;

    const initColor = document.getElementById("color-input");
    this.colorBeforeSelectionEditor = initColor.value;
    this.colorBeforeSelectionStudy = initColor.value;

    if (this.floorTiles) {
      this.currentWorld.addObject(this.currentWorld.gridHelper);
    }
    if (this.axisHelper) {
      this.currentWorld.addObject(this.currentWorld.axesHelper);
    }
  }

  modeChange(mode, world) {
    const previousWorld = this.currentWorld;

    this.previousModeSnapshot(previousWorld.scene.name);

    // Enabling/disabling camera controls AND top menu-bar
    if (previousWorld.scene.name === "editor" && mode !== "editor") {
      this.currentWorld.controls.enabled = false;
      document.getElementById("menu-bar").style.display = "none";
    } else if (mode === "editor") {
      world.controls.enabled = true;
      document.getElementById("menu-bar").style.display = "flex";
    }

    this.currentMode = mode;
    this.currentWorld = world;
    changeMenu(mode, this.menuParameterCapture);
    changeSceneMenu(mode, this.menuParameterCapture);
    changeInfo(mode);
    this.deselectObjects();

    // Removing transform controls on selected object
    if (this.currentWorld.transformControls) {
      this.currentWorld.transformControls.enabled = false;
      this.currentWorld.removeObject(this.currentWorld.transformControls);
    }

    if (mode === "editor") {
      // Adding/removing placeholder block depending on the selected mode
      this.action({ name: "objects", value: "cube" }, world);

      // populating predefined models section
      this.modelData = populatePredefinedModels();
    } else {
      if (previousWorld?.placeholderObject?.mesh) {
        previousWorld.removeObject(previousWorld.placeholderObject.mesh);
      }
    }

    // Resetting study object (do we need to reset an object??)
    if (mode === "study") {
      // If first switch to study mode
      if (this.menuParameterCapture[mode].sceneObjects === undefined) {
        this.addToMenuScene(world.studyObject.mesh);
      }
    }
  }

  deselectObjects(objects) {
    this.selectedObjects = [];

    if (objects) {
      // If object is a group
      objects.children.forEach((object) => {
        if (object.type !== "Mesh" && object.isGroup) {
          this.deselectObjects(object);
        }

        // If object is tracked in the scene restore it's material
        if (object.name.includes("object")) {
          object.material = new THREE.MeshLambertMaterial({
            color: object.material.color.getHex(),
            side: THREE.DoubleSide,
          });
        }

        // removing yellow bounding box around selected objects
        this.boxHelper.removeHelper(this);
      });
    } else {
      // if object is a mesh
      // If object is tracked in the scene restore it's material
      this.currentWorld.scene.children.forEach((object) => {
        if (object.type !== "Mesh" && object.isGroup) {
          this.deselectObjects(object);
        }

        if (object.name.includes("object")) {
          object.material = new THREE.MeshLambertMaterial({
            color: object.material.color.getHex(),
            side: THREE.DoubleSide,
          });
        }

        // removing yellow bounding box around selected objects
        this.boxHelper.removeHelper(this);
      });
    }

    changeObjectMenu("", this.currentMode, this.menuParameterCapture);
    this.DeselectObjectInMenu();
  }

  previousModeSnapshot(prevMode) {
    switch (prevMode) {
      case "editor":
        const floorTilesEditor = document.getElementById("floor-tile")?.checked;
        const axisHelperEditor =
          document.getElementById("axis-helper")?.checked;
        const gridSnapEditor = document.getElementById("grid-snap")?.checked;
        const colorEditor = document.getElementById("color-input")?.value;

        const objectsEditor = document.getElementById("scene-objects");
        const sceneObjectsEditor = Array.from(objectsEditor.children);

        this.menuParameterCapture[prevMode] = {
          floorTiles: floorTilesEditor,
          axisHelper: axisHelperEditor,
          gridSnap: gridSnapEditor,
          color: colorEditor,
          sceneObjects: sceneObjectsEditor,
        };

        break;
      case "study":
        const rotationStudy = document.getElementById("rotation");
        const axisHelperStudy = document.getElementById("axis-helper");
        const eyeXStudy = Number(document.getElementById("eye-x")?.value);
        const eyeYStudy = Number(document.getElementById("eye-y")?.value);
        const eyeZStudy = Number(document.getElementById("eye-z")?.value);
        const objectStudy = document.getElementById("objects")?.value;
        const transformXStudy = Number(
          document.getElementById("transform-x")?.value
        );
        const transformYStudy = Number(
          document.getElementById("transform-y")?.value
        );
        const transformZStudy = Number(
          document.getElementById("transform-z")?.value
        );
        const colorStudy = document.getElementById("color-input")?.value;
        const objectsStudy = document.getElementById("scene-objects");
        const sceneObjectsStudy = Array.from(objectsStudy.children);

        this.menuParameterCapture[prevMode] = {
          rotation: rotationStudy?.checked,
          axisHelper: axisHelperStudy?.checked,
          object: objectStudy,
          color: colorStudy,
          eye: {
            x: eyeXStudy,
            y: eyeYStudy,
            z: eyeZStudy,
          },
          transform: {
            x: transformXStudy,
            y: transformYStudy,
            z: transformZStudy,
          },
          sceneObjects: sceneObjectsStudy,
        };

        break;
    }
  }

  showInfo() {
    const infoWindow = document.getElementById("info-window");

    if (infoWindow.classList.contains("invisible")) {
      infoWindow.classList.remove("invisible");
    } else {
      infoWindow.classList.add("invisible");
    }
  }

  addObjectFully(objectToAdd, levelDepth, prevId) {
    let sceneObjects = document.getElementById("scene-objects");
    let groupDiv;
    let depth = levelDepth ? levelDepth : 0;

    // accessing the correct div depending on the level
    if (objectToAdd.type !== "Mesh" && depth === 0) {
      groupDiv = document.createElement("div");
      groupDiv.id = "group-wrapper";
      groupDiv.style.padding = 0;
      groupDiv.dataset.objectId = objectToAdd.uuid;
      sceneObjects.appendChild(groupDiv);
      sceneObjects = groupDiv;
    } else if (depth > 0) {
      groupDiv = document.querySelector(`[data-object-id="${prevId}"]`);
      sceneObjects = groupDiv;
    }

    // let objName = objectToAdd.name.split("object-")[1];
    let objName = objectToAdd.name;
    objName = nonRepeatingName(objName, this, sceneObjects);

    // populating div with appropriate data
    if (
      objectToAdd.children.length > 1 ||
      objectToAdd.type === "Group" ||
      objectToAdd.type.toLowerCase().includes("object")
    ) {
      sceneObjects.innerHTML += `
        <div data-obj="${objName}" id="${
        objectToAdd.uuid
      }" class="group-depth-${depth} scene-menu-obj" ${
        depth > 0 ? "style=display:none;" : ""
      }><span data-name="expand-shrink" id="group-opener-${depth}" class="expand-shrink">+</span> ${objName}</div>
      `;
    } else {
      sceneObjects.innerHTML += `
        <div data-obj="${objName}" class="group-depth-${depth}" id="${
        objectToAdd.uuid
      }" ${depth > 0 ? "style=display:none" : ""}>${objName}</div>
      `;
    }

    // recursively repeating the object addition if group/more children exists
    if (
      objectToAdd.children.length > 1 ||
      objectToAdd.type === "Group" ||
      objectToAdd.type.toLowerCase().includes("object")
    ) {
      objectToAdd.children.forEach((object) => {
        this.addObjectFully(object, depth + 1, objectToAdd.uuid);
      });
    } else {
      this.currentWorld.raycastableObjects.push(objectToAdd);
    }
  }

  addToMenuScene(objectToAdd, levelDepth, hidden) {
    let sceneObjects = document.getElementById("scene-objects");
    let groupDiv;
    let depth = levelDepth ? levelDepth : 0;
    let nameRepetitions = -1;

    if (objectToAdd.type !== "Mesh" && depth === 0) {
      groupDiv = document.createElement("div");
      groupDiv.id = "group-wrapper";
      sceneObjects.appendChild(groupDiv);
      sceneObjects = groupDiv;
    } else if (depth > 0) {
      groupDiv = document.getElementById("group-wrapper");
      sceneObjects = groupDiv;
    }

    let objName = objectToAdd.name;

    objName = nonRepeatingName(objName, this, sceneObjects);

    if (
      objectToAdd.children.length > 1 ||
      objectToAdd.type === "Group" ||
      objectToAdd.type.toLowerCase().includes("object")
    ) {
      sceneObjects.innerHTML += `
        <div data-obj="${objName}" id="${
        objectToAdd.uuid
      }" class="group-depth-${depth} scene-menu-obj" ${
        depth > 0 ? "style=display:none;" : ""
      }><span data-name="expand-shrink" id="group-opener-${depth}">+</span> ${objName}</div>
      `;
    } else {
      sceneObjects.innerHTML += `
        <div data-obj="${objName}" class="group-depth-${depth}" id="${
        objectToAdd.uuid
      }" ${depth > 0 ? "style=display:none" : ""}>${objName}</div>
      `;
    }

    if (
      objectToAdd.children.length > 1 ||
      objectToAdd.type === "Group" ||
      objectToAdd.type.toLowerCase().includes("object")
    ) {
      objectToAdd.children.forEach((object) => {
        this.addToMenuScene(object, depth + 1);
      });
    }
  }

  #removeObjectInGroup(object, id) {
    for (const child of object.children) {
      if (child.id === "group-wrapper") {
        this.#removeObjectInGroup(object, id);
      }
      if (child.id === id) {
        if (child.dataset.obj.includes("group")) {
          object.remove();
        } else {
          object.removeChild(child);
        }
      }
    }
  }

  removeFromMenuScene(id) {
    const sceneObjects = document.getElementById("scene-objects");

    for (const object of sceneObjects.children) {
      if (object.id === "group-wrapper") {
        this.#removeObjectInGroup(object, id);
      }
      if (object.id === id) {
        sceneObjects.removeChild(object);
      }
    }
  }

  #highlightObjectInGroup(objects, group) {
    for (const child of group.children) {
      child.classList.remove("selected");

      if (
        child.dataset.obj?.includes("object") ||
        child.dataset.obj?.includes("group")
      ) {
        // selecting multiple objects
        objects?.forEach((object) => {
          if (child.id === object.uuid) {
            child.classList.add("selected");
          }
        });
      }

      if (
        child.children.length > 0 &&
        child.children[0].dataset.name !== "expand-shrink"
      ) {
        // Recursive call for nested groups
        this.#highlightObjectInGroup(objects, child);
      }
    }
  }

  #highlightSingleObject(objects, obj) {
    // selecting multiple objects
    objects?.forEach((object) => {
      if (obj.id === object.uuid) {
        obj.classList.add("selected");
      }
    });
  }

  highlightObjectInMenu(objects, parent) {
    if (!parent) {
      parent = document.getElementById("scene-objects");
    }

    for (const obj of parent.children) {
      obj.classList.remove("selected");

      if (obj.id === "group-wrapper") {
        this.#highlightObjectInGroup(objects, obj);
      } else {
        this.#highlightSingleObject(objects, obj);
      }
    }

    // Adding remove/group buttons on selection
    if (this.selectedObjects.length > 0) {
      const groupBtn = document.getElementById("scene-group-btn");
      const removeBtn = document.getElementById("scene-remove-btn");

      groupBtn.textContent = "Group";

      if (this.selectedObjects[0].isGroup) {
        groupBtn.textContent = "Ungroup";
      }

      groupBtn.hidden = false;
      removeBtn.hidden = false;
    }
  }

  #deselectObjectInGroup(group) {
    for (const child of group.children) {
      child.classList.remove("selected");

      if (
        child.children.length > 0 &&
        child.children[0].dataset.name !== "expand-shrink"
      ) {
        // Recursive call for nested groups
        this.#deselectObjectInGroup(child);
      }
    }
  }

  DeselectObjectInMenu() {
    const sceneObjects = document.getElementById("scene-objects");

    for (const obj of sceneObjects.children) {
      obj.classList.remove("selected");

      if (obj.id === "group-wrapper") {
        this.#deselectObjectInGroup(obj);
      }
    }

    // Hiding buttons
    const groupBtn = document.getElementById("scene-group-btn");
    const removeBtn = document.getElementById("scene-remove-btn");

    if (groupBtn && removeBtn) {
      groupBtn.hidden = true;
      removeBtn.hidden = true;
    }
  }

  action(eventData) {
    switch (eventData.name) {
      case "predefined-model":
        const modelData = grabPredefinedData(eventData.value);

        if (modelData) {
          modelLoader(modelData[0].data, this);
        }

        break;
      case "rotation":
        eventData.checked === true
          ? (this.currentWorld.controls.autoRotate = true)
          : (this.currentWorld.controls.autoRotate = false);
        this.currentWorld.camera.rotation.set(-0.642, 0, 0);
        const EyeX = Number(document.getElementById("eye-x").value);
        const EyeY = Number(document.getElementById("eye-y").value);
        const EyeZ = Number(document.getElementById("eye-z").value);

        this.currentWorld.camera.position.set(EyeX, EyeY, EyeZ);
        break;
      case "floor-grid":
        eventData.checked === true
          ? this.currentWorld.addObject(this.currentWorld.gridHelper)
          : this.currentWorld.removeObject(this.currentWorld.gridHelper);
        break;
      case "axis-helper":
        eventData.checked === true
          ? this.currentWorld.addObject(this.currentWorld.axesHelper)
          : this.currentWorld.removeObject(this.currentWorld.axesHelper);
        break;
      case "grid-snap":
        eventData.checked === true
          ? (this.currentWorld.transformControls.translationSnap = 0.5)
          : (this.currentWorld.transformControls.translationSnap = null);
        break;
      case "dimensions":
        let newCubeDim;
        const xDim = Math.floor(Number(document.getElementById("x-dim").value));
        const yDim = Math.floor(Number(document.getElementById("y-dim").value));
        const zDim = Math.floor(Number(document.getElementById("z-dim").value));

        // Creating a new object and placing it into the grid, on the floor
        newCubeDim = new Cube(
          "void-obj-placeholder-obj",
          xDim,
          yDim,
          zDim,
          this.currentObjectColor,
          "Basic",
          true
        );

        // If new object created successfully
        if (newCubeDim?.mesh) {
          // Removing old placeholder object and adding a new one
          this.currentWorld.scene.remove(
            this.currentWorld.placeholderObject.mesh
          );

          this.currentWorld.updatePlaceholderObject(newCubeDim);
          this.currentWorld.scene.add(newCubeDim.mesh);
          this.currentObject = newCubeDim;
        }
        break;
      case "selected-dimensions":
        const xDimSel = Math.floor(
          Number(document.getElementById("selected-x-dim").value)
        );
        const yDimSel = Math.floor(
          Number(document.getElementById("selected-y-dim").value)
        );
        const zDimSel = Math.floor(
          Number(document.getElementById("selected-z-dim").value)
        );

        const xDifference =
          Math.floor(this.selectedObjects[0].geometry.parameters.width) -
          xDimSel;
        const yDifference =
          Math.floor(this.selectedObjects[0].geometry.parameters.height) -
          yDimSel;
        const zDifference =
          Math.floor(this.selectedObjects[0].geometry.parameters.depth) -
          zDimSel;

        const newGeometry = new THREE.BoxGeometry(
          xDimSel + 0.00006,
          yDimSel + 0.00006,
          zDimSel + 0.00006
        );

        this.selectedObjects[0].geometry = newGeometry;

        this.selectedObjects[0].position.x -= xDifference / 2;
        this.selectedObjects[0].position.y -= yDifference / 2;
        this.selectedObjects[0].position.z -= zDifference / 2;
        break;
      case "radius":
        let newSphereRad;
        const sphereRad = Number(document.getElementById("radius").value);
        const segmentsW = Number(
          document.getElementById("segments-width")?.value
        );
        const segmentsH = Number(
          document.getElementById("segments-height")?.value
        );
        const thetaL = Number(document.getElementById("theta-length")?.value);

        // Creating a new object and placing it into the grid, on the floor
        newSphereRad = new Sphere(
          "void-obj-placeholder-obj",
          sphereRad,
          this.currentObjectColor,
          "Basic",
          true,
          segmentsW,
          segmentsH,
          thetaL
        );

        // If new object created successfully
        if (newSphereRad?.mesh) {
          // Removing old placeholder object and adding a new one
          this.currentWorld.scene.remove(
            this.currentWorld.placeholderObject.mesh
          );

          this.currentWorld.updatePlaceholderObject(newSphereRad);
          this.currentWorld.scene.add(newSphereRad.mesh);
          this.currentObject = newSphereRad;
        }
        break;
      case "selected-radius":
        const sphereRadius = Number(
          document.getElementById("selected-radius").value
        );
        const sphereWidthSeg = Number(
          document.getElementById("selected-segments-width")?.value
        );
        const sphereHeightSeg = Number(
          document.getElementById("selected-segments-height")?.value
        );
        const thetaLen = Number(
          document.getElementById("selected-theta-length").value
        );

        this.selectedObjects[0].geometry = new THREE.SphereGeometry(
          sphereRadius,
          sphereWidthSeg,
          sphereHeightSeg,
          undefined,
          undefined,
          undefined,
          thetaLen
        );
        break;
      case "cylinder":
        let newCylinder;
        const radiusTop = Number(document.getElementById("radiusTop").value);
        const radiusBottom = Number(
          document.getElementById("radiusBottom").value
        );
        const height = Number(document.getElementById("height").value);
        const radialSegments = Math.floor(
          Number(document.getElementById("radialSegments").value)
        );
        const openEnded = document.getElementById("openEnded").checked;

        // Creating a new object and placing it into the grid, on the floor
        newCylinder = new Cylinder(
          "void-obj-placeholder-obj",
          radiusTop,
          radiusBottom,
          height,
          this.currentObjectColor,
          "Basic",
          true,
          radialSegments,
          openEnded
        );

        // If new object created successfully
        if (newCylinder?.mesh) {
          // Removing old placeholder object and adding a new one
          this.currentWorld.scene.remove(
            this.currentWorld.placeholderObject.mesh
          );

          this.currentWorld.updatePlaceholderObject(newCylinder);
          this.currentWorld.scene.add(newCylinder.mesh);
          this.currentObject = newCylinder;
        }
        break;
      case "selected-cylinder":
        const radiusTopSelected = Number(
          document.getElementById("selected-radiusTop").value
        );
        const radiusBottomSelected = Number(
          document.getElementById("selected-radiusBottom").value
        );
        const heightSelected = Number(
          document.getElementById("selected-height").value
        );
        const radialSegmentsSelected = Math.floor(
          Number(document.getElementById("selected-radialSegments").value)
        );
        const openEndedSelected =
          document.getElementById("selected-openEnded").checked;

        const heightDifference =
          this.selectedObjects[0].geometry.parameters.height - heightSelected;

        // Creating a new object and placing it into the grid, on the floor
        this.selectedObjects[0].geometry = new THREE.CylinderGeometry(
          radiusTopSelected,
          radiusBottomSelected,
          heightSelected,
          radialSegmentsSelected < 3 ? 3 : radialSegmentsSelected,
          1,
          openEndedSelected
        );

        this.selectedObjects[0].position.y -= heightDifference / 2;
        break;
      case "capsule":
        let newCapsule;
        const radiusCap = Number(document.getElementById("radiusCap").value);
        const lengthCap = Number(document.getElementById("lengthCap").value);
        const segmentsCap = Math.floor(
          Number(document.getElementById("capSegmentsCap").value)
        );
        const radialSegmentsCap = Math.floor(
          Number(document.getElementById("radialSegmentsCap").value)
        );

        // Creating a new object and placing it into the grid, on the floor
        newCapsule = new Capsule(
          "void-obj-placeholder-obj",
          radiusCap,
          lengthCap,
          this.currentObjectColor,
          "Basic",
          true,
          segmentsCap,
          radialSegmentsCap
        );

        // If new object created successfully
        if (newCapsule?.mesh) {
          // Removing old placeholder object and adding a new one
          this.currentWorld.scene.remove(
            this.currentWorld.placeholderObject.mesh
          );

          this.currentWorld.updatePlaceholderObject(newCapsule);
          this.currentWorld.scene.add(newCapsule.mesh);
          this.currentObject = newCapsule;
        }
        break;
      case "selected-capsule":
        const radiusCapSelected = Number(
          document.getElementById("selected-radiusCap").value
        );
        const lengthCapSelected = Number(
          document.getElementById("selected-lengthCap").value
        );
        const segmentsCapSelected = Math.floor(
          Number(document.getElementById("selected-capSegmentsCap").value)
        );
        const radialSegmentsCapSelected = Math.floor(
          Number(document.getElementById("selected-radialSegmentsCap").value)
        );

        const radiusDifference =
          this.selectedObjects[0].geometry.parameters.radius -
          radiusCapSelected;

        const lengthDifference =
          this.selectedObjects[0].geometry.parameters.length -
          lengthCapSelected;

        // Creating a new object and placing it into the grid, on the floor
        this.selectedObjects[0].geometry = new THREE.CapsuleGeometry(
          radiusCapSelected,
          lengthCapSelected,
          segmentsCapSelected < 1 ? 1 : segmentsCapSelected,
          radialSegmentsCapSelected < 3 ? 3 : radialSegmentsCapSelected
        );

        this.selectedObjects[0].position.y -= lengthDifference / 2;
        this.selectedObjects[0].position.y -= radiusDifference;
        break;
      case "objects":
        if (this.currentMode === "editor") {
          let newObject;

          switch (eventData.value) {
            case "cube":
              // Changing the menu UI and reading the inputs
              changeObjectMenu(
                eventData.value,
                this.currentMode,
                this.menuParameterCapture,
                null,
                "object"
              );
              const x = Math.floor(
                Number(document.getElementById("x-dim").value)
              );
              const y = Math.floor(
                Number(document.getElementById("y-dim").value)
              );
              const z = Math.floor(
                Number(document.getElementById("z-dim").value)
              );

              // Creating a new object and placing it into the grid, on the floor
              newObject = new Cube(
                "void-obj-placeholder-obj",
                x,
                y,
                z,
                this.currentObjectColor,
                "Basic",
                true
              );
              break;
            case "sphere":
              // Changing the menu UI and reading the inputs
              changeObjectMenu(
                eventData.value,
                this.currentMode,
                this.menuParameterCapture,
                null,
                "object"
              );
              const radius = Number(document.getElementById("radius").value);

              // Creating a new object and placing it into the grid, on the floor
              newObject = new Sphere(
                "void-obj-placeholder-obj",
                radius,
                this.currentObjectColor,
                "Basic",
                true
              );

              break;
            case "cylinder":
              changeObjectMenu(
                eventData.value,
                this.currentMode,
                this.menuParameterCapture,
                null,
                "object"
              );

              const radiusTop = Number(
                document.getElementById("radiusTop").value
              );
              const radiusBottom = Number(
                document.getElementById("radiusBottom").value
              );
              const height = Number(document.getElementById("height").value);
              const radialSegments = Math.floor(
                Number(document.getElementById("radialSegments").value)
              );
              const openEnded = document.getElementById("openEnded").checked;

              newObject = new Cylinder(
                "void-obj-placeholder-obj",
                radiusTop,
                radiusBottom,
                height,
                this.currentObjectColor,
                "Basic",
                true,
                radialSegments,
                openEnded
              );

              break;
            case "capsule":
              changeObjectMenu(
                eventData.value,
                this.currentMode,
                this.menuParameterCapture,
                null,
                "object"
              );

              const radiusCap = Number(
                document.getElementById("radiusCap").value
              );
              const lengthCap = Number(
                document.getElementById("lengthCap").value
              );
              const segmentsCap = Math.floor(
                Number(document.getElementById("capSegmentsCap").value)
              );
              const radialSegmentsCap = Math.floor(
                Number(document.getElementById("radialSegmentsCap").value)
              );

              newObject = new Capsule(
                "void-obj-placeholder-obj",
                radiusCap,
                lengthCap,
                this.currentObjectColor,
                "Basic",
                true,
                segmentsCap,
                radialSegmentsCap
              );

              break;
          }
          newObject.mesh.position.set(0.5, 0.5, 0.5);

          // If new object created successfully
          if (newObject?.mesh) {
            // Removing old placeholder object and adding a new one
            this.currentWorld.scene.remove(
              this.currentWorld.placeholderObject.mesh
            );

            this.currentWorld.updatePlaceholderObject(newObject);
            this.currentWorld.scene.add(newObject.mesh);
            this.currentObject = newObject;
          }
        }
        break;
      case "eye":
        const xEye = Number(document.getElementById("eye-x").value);
        const yEye = Number(document.getElementById("eye-y").value);
        const zEye = Number(document.getElementById("eye-z").value);

        this.currentWorld.camera.position.set(xEye, yEye, zEye);
        break;
      case "color-picker":
        const colorInput = document.getElementById("color-input");

        if (this.selectedObjects.length > 0) {
          this.selectedObjects.forEach((selected) => {
            if (selected.isGroup) {
              this.#recursiveObjectColoring(selected, eventData.value);
            } else {
              selected.material.color.set(eventData.value);
            }
          });
        } else {
          this.colorBeforeSelectionEditor = eventData.value;
          this.currentObject.material.color.set(eventData.value);
          this.currentObjectColor = eventData.value;
        }

        colorInput.value = eventData.value;
        break;
      case "color-picker-study":
        const colorInputStudy = document.getElementById("color-input");

        if (this.selectedObjects.length > 0) {
          this.selectedObjects.forEach((object) => {
            object.material.color.set(eventData.value);
          });
        } else {
          this.colorBeforeSelectionStudy = eventData.value;
          this.currentObject.material.color.set(eventData.value);
        }

        colorInputStudy.value = eventData.value;
        break;

      // case "segments":
      //   const segmentWidth = document.getElementById(
      //     "selected-segments-width"
      //   )?.value;
      //   const segmentHeight = document.getElementById(
      //     "selected-segments-height"
      //   )?.value;
      //   const thetaLength = document.getElementById(
      //     "selected-theta-length"
      //   )?.value;

      //   this.selectedObjects[0].geometry = new THREE.SphereGeometry(
      //     this.selectedObjects[0].geometry.parameters.radius,
      //     segmentWidth,
      //     segmentHeight,
      //     undefined,
      //     undefined,
      //     undefined,
      //     thetaLength
      //   );

      //   break;
      case "add-object":
        const objectToAdd = document.getElementById("objects").value;
        const selectedColor = document.getElementById("color-input").value;
        let addObject;

        // Creating a new object and placing it into the grid, on the floor
        switch (objectToAdd) {
          case "cube":
            addObject = new Cube(
              "object-cube",
              1,
              1,
              1,
              selectedColor,
              "Lambert"
            );
            addObject.mesh.position.set(0.5, 0.5, 0.5);
            break;
          case "sphere":
            addObject = new Sphere(
              "object-sphere",
              0.5,
              selectedColor,
              "Lambert"
            );
            addObject.mesh.position.set(0.5, 0.5, 0.5);
            break;
          case "cylinder":
            addObject = new Cylinder(
              "object-cylinder",
              0.5,
              0.5,
              1,
              selectedColor,
              "Lambert"
            );
            addObject.mesh.position.set(0.5, 0.5, 0.5);
            break;
          case "capsule":
            addObject = new Capsule(
              "object-Capsule",
              0.5,
              1,
              selectedColor,
              "Lambert",
              false,
              6,
              12
            );
            addObject.mesh.position.set(0.5, 1, 0.5);
            break;
        }

        // If new object created successfully
        if (addObject?.mesh) {
          this.currentWorld.addRaycastableObject(addObject.mesh);
          this.addToMenuScene(addObject.mesh);
        }

        break;
      case "menu-bar":
        let cleanScene;

        switch (eventData.value) {
          case "new":
            if (
              window.confirm(
                "Any unsaved data will be lost. Are you sure you want to do this?"
              )
            ) {
              this.deselectObjects();
              this.newEditor();
            }

            break;
          case "export GLTF":
            cleanScene = _.cloneDeep(this.currentWorld.scene);

            const childrenGltf = cleanScene.children.filter(
              (object) => !object.name.includes("void-obj")
            );

            cleanScene.children = childrenGltf;

            this.gltfObj.exportScene(cleanScene);
            break;
          case "export OBJ":
            cleanScene = _.cloneDeep(this.currentWorld.scene);

            const childrenObj = cleanScene.children.filter(
              (object) => !object.name.includes("void-obj")
            );

            cleanScene.children = childrenObj;

            this.objObj.exportScene(cleanScene);
            break;
          case "import GLTF/OBJ":
            let gltf = false;
            const input = document.createElement("input");
            const allowedTypes = [".gltf", ".glb", ".obj"];
            input.type = "file";

            input.click();

            input.onchange = (e) => {
              const file = e.target.files[0];

              // if file is not of gltf/obj format
              if (!allowedTypes.some((type) => file.name.includes(type))) {
                return;
              }

              // if file is of gltf format
              if (file.name.includes(".gltf") || file.name.includes(".glb")) {
                gltf = true;
              }

              // setting up the reader
              const reader = new FileReader();

              if (file) {
                reader.readAsDataURL(file);
              }

              reader.onload = () => {
                if (gltf) {
                  this.gltfObj.importObject(reader.result, this);
                } else {
                  this.objObj.importObject(reader.result, this);
                }
              };
            };

            break;

          case "save model":
            let modelAlone;

            // SELECTED GROUP ~~~~~~~~~~~~~~~~~~~~~~~~
            if (
              this.selectedObjects.length === 1 &&
              this.selectedObjects[0].isGroup
            ) {
              // Remove all static elements in the world
              modelAlone = this.selectedObjects[0].children.filter(
                (object) => !object.name.includes("void-obj")
              );
            }

            // WHOLE SCENE (no selections) ~~~~~~~~~~~
            else if (this.selectedObjects.length === 0) {
              // If there's any groups in the scene The saving is not executed
              if (
                this.currentWorld.scene.children.some(
                  (object) => object.isGroup
                )
              ) {
                alert(
                  "Please select a group of the model you wish to save, or ungroup all objects from the scene."
                );
              } else {
                // Remove all static elements in the world
                modelAlone = this.currentWorld.scene.children.filter(
                  (object) => !object.name.includes("void-obj")
                );
              }
            } else {
              alert(
                "Please select a group of the model you wish to save,\nor deselect everything to save the whole scene."
              );
            }

            if (modelAlone) {
              const modelArray = modelSaver(modelAlone);

              // SAVING TO JSON FILE ~~~~~~~~~~~~~~~
              const output = JSON.stringify(modelArray, null, 2);

              const blob = new Blob([output], { type: "application/json" });

              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "model.json";
              link.click();
            }
            break;

          case "load model":
            // FROM JSON FILE ~~~~~~~~~~~~~~~~
            const inputEl = document.createElement("input");
            inputEl.accept = ".json";
            inputEl.type = "file";
            inputEl.click();

            inputEl.onchange = (e) => {
              const file = e.target.files[0];

              if (file.type !== "application/json") {
                return;
              }

              // setting up the reader
              const reader = new FileReader();

              if (file) {
                reader.readAsText(file);
              }

              reader.onload = () => {
                const data = JSON.parse(reader.result);

                modelLoader(data, this);
              };
            };
            break;
        }

        break;
      case "scene":
        if (eventData.type === "obj-action") {
          const groupBtn = document.getElementById("scene-group-btn");

          if (this.currentMode === "editor") {
            this.currentWorld.removeObject(this.currentWorld.transformControls);
            this.currentWorld.transformControls.enabled = false;
          }

          //  If remove button clicked - removes selected elements
          if (eventData.id === "scene-remove-btn") {
            // removing yellow bounding box around selected objects
            this.selectedObjects.forEach((object) => {
              if (object.isGroup) {
                this.#recursiveObjectDeletion(object);
              } else {
                this.currentWorld.raycastableObjects.forEach((el, index) => {
                  if (el === object) {
                    this.currentWorld.raycastableObjects.splice(index, 1);
                    this.removeFromMenuScene(object.uuid);
                  }
                });

                // removing yellow bounding box around selected objects
                this.boxHelper.removeHelper(this);
              }

              this.currentWorld.removeObject(object);
            });
            this.deselectObjects();
          }

          if (eventData.id === "scene-group-btn") {
            // if group button clicked - groups selected elements
            if (groupBtn.textContent.toLowerCase() === "group") {
              const group = new THREE.Group();
              this.selectedObjects.forEach((object) => {
                if (object.type === "Mesh") {
                  const obj = object.clone();
                  group.add(obj);

                  this.currentWorld.raycastableObjects.forEach((el, index) => {
                    if (el === object) {
                      this.currentWorld.raycastableObjects.splice(index, 1);
                      this.currentWorld.removeObject(object);
                      this.removeFromMenuScene(el.uuid);
                    }
                  });

                  // removing yellow bounding box around selected objects
                  this.boxHelper.removeHelper(this);
                }
              });

              group.name = "group";
              this.currentWorld.addObject(group);
              this.addObjectFully(group);

              this.deselectObjects();
            }

            // if ungroup button clicked - ungroups selected group
            if (groupBtn.textContent.toLowerCase() === "ungroup") {
              this.selectedObjects.forEach((object) => {
                this.#recursiveObjectUngroup(object);

                // Removing the whole group object
                this.currentWorld.removeObject(object);
                this.removeFromMenuScene(object.uuid);
              });
              // removing yellow bounding box around selected objects
              this.boxHelper.removeHelper(this);

              this.deselectObjects();
            }
          }

          break;
        }

        if (eventData.dataset?.name === "expand-shrink") {
          const depth = eventData.value.slice(-1);
          const parentElement = eventData.element.parentElement.parentElement;
          const children = [];

          parentElement.childNodes.forEach((child) => {
            if (
              child.id === eventData.element.parentElement.id ||
              child.tagName !== "DIV"
            ) {
              return;
            }

            children.push(child);
          });

          eventData.element.textContent === "+"
            ? (eventData.element.textContent = "-")
            : (eventData.element.textContent = "+");

          children.forEach((child) => {
            if (child.style.display === "none") {
              const padding = ((Number(depth) + 1) * 16).toString() + "px";

              child.style.display = "block";
              child.style.paddingLeft = padding;
            } else {
              child.style.display = "none";
            }
          });
        } else {
          const colorIn = document.getElementById("color-input");
          let selectedObj = null;

          // console.log(this.currentWorld.transformControls);
          // console.log(this.currentWorld.scene.children);
          // this.currentWorld.scene.children.forEach((child) => {
          //   if (child.isGroup) {
          //     child.position.x = 5;
          //   }
          // });

          // Grabbing selected object in the scene
          this.currentWorld.scene.children.forEach((object) => {
            if (
              object.type !== "Mesh" &&
              object.children.length > 0 &&
              !object.name.includes("void-obj")
            ) {
              const obj = this.#traverseScene(object, eventData.value);
              obj ? (object = obj) : null;
            }

            // If object is tracked in the scene restore it's material
            if (object.name.includes("object")) {
              // console.log("selected color not working on imported objects");
              object.material = new THREE.MeshLambertMaterial({
                color: object.material?.color?.getHex(),
                opacity: 1,
                side: THREE.DoubleSide,
              });
            }

            // removing yellow bounding box around selected objects
            this.boxHelper.removeHelper(this);

            // If it is the selected object
            if (object.uuid === eventData.value) {
              selectedObj = object;
            }
          });

          // populating global selected objects array
          // Multiple objects selection
          if (eventData.ctrl && selectedObj !== null) {
            let addFlag = true;

            // preventing double/group <-> object selection
            this.selectedObjects.forEach((selected) => {
              if (selected.uuid === selectedObj.uuid) {
                addFlag = false;
              }
              if (selected.isMesh === selectedObj.isGroup) {
                addFlag = false;
              }
              if (selected.isGroup) {
                addFlag = false;
              }
            });

            if (addFlag) {
              this.selectedObjects.push(selectedObj);

              changeObjectMenu(
                "multiple",
                this.currentMode,
                this.menuParameterCapture
              );

              if (this.currentMode === "editor") {
                colorIn.value = this.colorBeforeSelectionEditor;

                if (this.selectedObjects.length === 1) {
                  this.currentWorld.transformControls.attach(selectedObj);
                  this.currentWorld.transformControls.name =
                    "void-obj-transform-controls";

                  this.currentWorld.addObject(
                    this.currentWorld.transformControls
                  );
                  this.currentWorld.transformControls.enabled = true;
                } else {
                  this.currentWorld.removeObject(
                    this.currentWorld.transformControls
                  );
                  this.currentWorld.transformControls.enabled = false;
                }
              } else if (this.currentMode === "study") {
                colorIn.value = this.colorBeforeSelectionStudy;
              }
            }
          }

          // Single object selection
          else if (selectedObj !== null) {
            this.selectedObjects = [selectedObj];

            if (this.selectedObjects[0].isGroup) {
              changeObjectMenu(
                "multiple",
                this.currentMode,
                this.menuParameterCapture
              );

              colorIn.value = this.colorBeforeSelectionEditor;
            } else {
              changeObjectMenu(
                nameConverter(this.selectedObjects[0].geometry.type),
                this.currentMode,
                this.menuParameterCapture,
                this.selectedObjects[0]
              );

              colorIn.value = "#" + selectedObj.material.color.getHexString();
            }

            if (this.currentMode === "editor") {
              this.currentWorld.transformControls.attach(selectedObj);
              this.currentWorld.transformControls.name =
                "void-obj-transform-controls";

              this.currentWorld.addObject(this.currentWorld.transformControls);
              this.currentWorld.transformControls.enabled = true;
            }
          }

          // Press on the scene div (not on object)
          else {
            this.selectedObjects = [];
            this.DeselectObjectInMenu();

            changeObjectMenu("", this.currentMode, this.menuParameterCapture);

            if (this.currentMode === "editor") {
              colorIn.value = this.colorBeforeSelectionEditor;

              this.currentWorld.removeObject(
                this.currentWorld.transformControls
              );
              this.currentWorld.transformControls.enabled = false;
            } else if (this.currentMode === "study") {
              colorIn.value = this.colorBeforeSelectionStudy;
            }
          }

          // Painting all selected objects
          this.selectedObjects?.forEach((object) => {
            if (object.isGroup) {
              this.recursiveObjectPaint(object);
              this.boxHelper.setObject(object);
              this.currentWorld.addObject(this.boxHelper.bbox);
            } else {
              object.material = new THREE.MeshBasicMaterial({
                color: object.material.color.getHex(),
                opacity: 0.6,
                transparent: true,
                side: THREE.DoubleSide,
              });

              this.boxHelper.setObject(object);
              this.currentWorld.addObject(this.boxHelper.bbox);
            }
          });

          // Reassinging parameter buttons event listeners
          reassigningObjectEventListeners(this);

          // Highlighting selected objects in menu
          this.highlightObjectInMenu(this.selectedObjects);
        }
        break;
    }
  }

  #recursiveObjectColoring(object, color) {
    object.children.forEach((el) => {
      if (el.isGroup) {
        this.#recursiveObjectColoring(el, color);
      } else {
        el.material.color.set(color);
      }
    });
  }

  #recursiveObjectUngroup(object) {
    object.children.forEach((element) => {
      if (element.isGroup) {
        this.#recursiveObjectUngroup(element);
      } else {
        // getting position/rotation/scale from the object
        const posV = new THREE.Vector3();
        const quatV = new THREE.Quaternion();
        const scaleV = new THREE.Vector3();
        element.matrixWorld.decompose(posV, quatV, scaleV);

        const newObj = element.clone();

        // Setting position/rotation/scale together with parent object parameter changes
        newObj.position.set(...posV);
        newObj.setRotationFromQuaternion(quatV);
        newObj.scale.set(...scaleV);

        // Removing object from raycastable array
        this.currentWorld.raycastableObjects.forEach((el, index) => {
          if (el === element) {
            this.currentWorld.raycastableObjects.splice(index, 1);
          }
        });

        // Adding the single objects
        this.currentWorld.addObject(newObj);
        this.addObjectFully(newObj);
        // newObj.matrixAutoUpdate = true;
      }
    });
  }

  #recursiveObjectDeletion(object) {
    object.children.forEach((element) => {
      if (element.isGroup) {
        this.#recursiveObjectDeletion(element);
      } else {
        this.currentWorld.raycastableObjects.forEach((el, index) => {
          if (el === element) {
            this.currentWorld.raycastableObjects.splice(index, 1);
          }
        });
      }
    });
    this.removeFromMenuScene(object.uuid);
  }

  #checkSelectedInGroup(selected, selectedObj) {
    let addFlag = true;
    selected.children.forEach((object) => {
      if (object.isGroup) {
        const selected = this.#checkSelectedInGroup(object);
        addFlag = selected;
      }

      if (object.uuid === selectedObj.uuid) {
        addFlag = false;
      }
    });
    return addFlag;
  }

  recursiveObjectPaint(object) {
    object.children.forEach((child) => {
      if (child.isGroup) {
        this.recursiveObjectPaint(child);
      } else {
        child.material = new THREE.MeshBasicMaterial({
          color: child.material.color.getHex(),
          opacity: 0.6,
          transparent: true,
          side: THREE.DoubleSide,
        });
      }
    });
  }

  #traverseScene(objects, elemId) {
    let returnVal = null;

    objects.children.forEach((object) => {
      if (object.type !== "Mesh") {
        this.#traverseScene(object, elemId);
      }

      // If object is tracked in the scene restore it's material
      if (object.name.includes("object")) {
        // console.log("selected color not working on imported objects");
        object.material = new THREE.MeshLambertMaterial({
          color: object.material?.color?.getHex(),
          side: THREE.DoubleSide,
        });
      }

      // If it is the selected object
      if (object.uuid === elemId) {
        returnVal = object;
      }
    });

    return returnVal;
  }
}
