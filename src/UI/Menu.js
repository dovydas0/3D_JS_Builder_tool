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

export class Menu {
  constructor(worldObject, placeholderObject, newEditor) {
    // STORE ALL BLOCKS IN AN ARRAY HERE
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

    // Adding/removing placeholder block depending on the selected mode
    if (mode === "editor") {
      this.action({ name: "objects", value: "cube" }, world);
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
      //   const studyObjectColor = this.menuParameterCapture[mode].color
      //     ? this.menuParameterCapture[mode].color
      //     : this.currentWorld.studyObjectColor;
      //   const defaultCube = new Cube(
      //     "object",
      //     1,
      //     1,
      //     1,
      //     studyObjectColor,
      //     "Lambert"
      //   );
      //   if (defaultCube?.mesh) {
      //     defaultCube.mesh.position.set(0.5, 0.5, 0.5);
      //     this.currentWorld.removeObject(this.currentWorld.studyObject.mesh);
      //     this.currentWorld.updateStudyObject(defaultCube);
      //     this.currentWorld.addObject(defaultCube.mesh);
      //   }
    }
  }

  deselectObjects() {
    this.selectedObjects = [];

    // If object is tracked in the scene restore it's material
    this.currentWorld.scene.children.forEach((object) => {
      if (object.name.includes("object")) {
        object.material = new THREE.MeshLambertMaterial({
          color: object.material.color.getHex(),
          side: THREE.DoubleSide,
        });
      }
    });

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

  addObjectFully(objectToAdd, levelDepth, hidden) {
    let sceneObjects = document.getElementById("scene-objects");
    let groupDiv;
    let depth = levelDepth ? levelDepth : 0;

    // accessing the correct div depending on the level
    if (objectToAdd.type !== "Mesh" && depth === 0) {
      groupDiv = document.createElement("div");
      groupDiv.id = "group-wrapper";
      sceneObjects.appendChild(groupDiv);
      sceneObjects = groupDiv;
    } else if (depth > 0) {
      groupDiv = document.getElementById("group-wrapper");
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
      }><span data-name="expand-shrink" id="group-opener-${depth}">+</span> ${objName}</div>
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
        this.addObjectFully(object, depth + 1);
      });
      // console.log("more objects");
    } else {
      // console.log(objectToAdd);
      this.currentWorld.raycastableObjects.push(objectToAdd);
      // this.currentWorld.addRaycastableObject(objectToAdd);
    }
    // sceneObjects.innerHTML += `
    //   <div data-obj="${objName}" id="${objectToAdd.uuid}">${objName}</div>
    // `;
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

    // let objName = objectToAdd.name.split("object-")[1];
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
      // console.log("more objects");
    }
    // sceneObjects.innerHTML += `
    //   <div data-obj="${objName}" id="${objectToAdd.uuid}">${objName}</div>
    // `;
  }

  removeFromMenuScene(id) {
    const sceneObjects = document.getElementById("scene-objects");

    for (const object of sceneObjects.children) {
      if (object.id === id) {
        sceneObjects.removeChild(object);
      }
    }
  }

  #highlightObjectInGroup(objects, group) {
    for (const child of group.children) {
      if (child.dataset.obj?.includes("object")) {
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

    // console.log(objects);

    for (const obj of parent.children) {
      obj.classList.remove("selected");
      // console.log(obj);

      if (obj.id === "group-wrapper") {
        this.#highlightObjectInGroup(objects, obj);
      } else {
        this.#highlightSingleObject(objects, obj);
      }
    }

    // Adding remove/group buttons on selection
    if (
      this.selectedObjects.length > 0 &&
      !document.getElementById("scene-group-btn") &&
      !document.getElementById("scene-remove-btn")
    ) {
      const sceneHeader = document.getElementById("scene-header");
      const groupBtn = document.createElement("button");
      const removeBtn = document.createElement("button");

      groupBtn.id = "scene-group-btn";
      groupBtn.name = "obj-action";
      groupBtn.textContent = "Group";
      groupBtn.classList.add("btn-1");
      removeBtn.id = "scene-remove-btn";
      removeBtn.name = "obj-action";
      removeBtn.textContent = "Remove";
      removeBtn.classList.add("btn-1");

      sceneHeader.appendChild(removeBtn);
      sceneHeader.appendChild(groupBtn);
    } else if (this.selectedObjects.length === 0) {
      const groupBtn = document.getElementById("scene-group-btn");
      const removeBtn = document.getElementById("scene-remove-btn");

      if (groupBtn && removeBtn) {
        groupBtn.remove();
        removeBtn.remove();
      }
    }
  }

  // highlightObjectInMenu(objects) {
  //   const sceneObjects = document.getElementById("scene-objects");

  //   for (const obj of sceneObjects.children) {
  //     obj.classList.remove("selected");

  //     if (obj.id === "group-wrapper") {
  //       Object.keys(obj.children).forEach((value) => {
  //         if (obj.children[value].dataset.obj.includes("object")) {
  //           // selecting multiple objects
  //           objects?.forEach((object) => {
  //             if (obj.children[value].id === object.uuid) {
  //               obj.children[value].classList.add("selected");
  //             }
  //           });
  //         }
  //       });
  //       // obj.children.forEach((element) => {
  //       //   console.log(element.dataset);
  //       // });
  //     } else {
  //       // selecting multiple objects
  //       objects?.forEach((object) => {
  //         if (obj.id === object.uuid) {
  //           obj.classList.add("selected");
  //         }
  //       });
  //     }
  //   }

  //   // Adding remove/group buttons on selection
  //   if (
  //     this.selectedObjects.length > 0 &&
  //     !document.getElementById("scene-group-btn") &&
  //     !document.getElementById("scene-remove-btn")
  //   ) {
  //     const sceneHeader = document.getElementById("scene-header");
  //     const groupBtn = document.createElement("button");
  //     const removeBtn = document.createElement("button");

  //     groupBtn.id = "scene-group-btn";
  //     groupBtn.name = "obj-action";
  //     groupBtn.textContent = "Group";
  //     groupBtn.classList.add("btn-1");
  //     removeBtn.id = "scene-remove-btn";
  //     removeBtn.name = "obj-action";
  //     removeBtn.textContent = "Remove";
  //     removeBtn.classList.add("btn-1");

  //     sceneHeader.appendChild(removeBtn);
  //     sceneHeader.appendChild(groupBtn);
  //   } else if (this.selectedObjects.length === 0) {
  //     const groupBtn = document.getElementById("scene-group-btn");
  //     const removeBtn = document.getElementById("scene-remove-btn");

  //     if (groupBtn && removeBtn) {
  //       groupBtn.remove();
  //       removeBtn.remove();
  //     }
  //   }
  // }

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

  // #deselectSingleObject(obj) {
  //   obj.classList.remove("selected");
  // }

  DeselectObjectInMenu() {
    const sceneObjects = document.getElementById("scene-objects");

    console.log("deselecting objects in menu");

    for (const obj of sceneObjects.children) {
      obj.classList.remove("selected");

      if (obj.id === "group-wrapper") {
        this.#deselectObjectInGroup(obj);
      }
    }

    // Removing buttons
    const groupBtn = document.getElementById("scene-group-btn");
    const removeBtn = document.getElementById("scene-remove-btn");

    if (groupBtn && removeBtn) {
      groupBtn.remove();
      removeBtn.remove();
    }
  }

  action(eventData) {
    switch (eventData.name) {
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

        // Creating a new object and placing it into the grid, on the floor
        newSphereRad = new Sphere(
          "void-obj-placeholder-obj",
          sphereRad,
          this.currentObjectColor,
          "Basic",
          true
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
          document.getElementById("segments-width").value
        );
        const sphereHeightSeg = Number(
          document.getElementById("segments-height").value
        );

        this.selectedObjects[0].geometry = new THREE.SphereGeometry(
          sphereRadius,
          sphereWidthSeg,
          sphereHeightSeg
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
          radialSegmentsSelected,
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
          segmentsCapSelected,
          radialSegmentsCapSelected
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
      case "transform":
        // let newObjectTransform;
        // const xTrans = Number(document.getElementById("transform-x").value);
        // const yTrans = Number(document.getElementById("transform-y").value);
        // const zTrans = Number(document.getElementById("transform-z").value);
        // const objectTransform = document.getElementById("objects").value;
        // console.log("hi");
        // switch (objectTransform) {
        //   case "cube":
        //     newObjectTransform = new Cube(
        //       "object",
        //       xTrans,
        //       yTrans,
        //       zTrans,
        //       this.currentObjectColor,
        //       "Lambert"
        //     );
        //     newObjectTransform.mesh.position.addScalar(0.5);
        //     break;
        //   case "sphere":
        //     newObjectTransform = new Sphere(
        //       "object",
        //       2,
        //       this.currentObjectColor,
        //       "Lambert"
        //     );
        //     // console.log(newObject.mesh.position.x);
        //     // console.log(newObject.mesh.position.y);
        //     // console.log(newObject.mesh.position.z);
        //     break;
        //   case "cylinder":
        //     // newObjectTransform = new Cylinder("object", 1, 1, 1, 0x5544AA, "Basic", true)
        //     break;
        // }

        // // If new object created successfully
        // if (newObjectTransform?.mesh) {
        //   // Removing old object and adding a new one
        //   this.currentWorld.removeObject(this.currentWorld.studyObject.mesh);

        //   this.currentWorld.updateStudyObject(newObjectTransform);
        //   this.currentWorld.addObject(newObjectTransform.mesh);
        // }
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
            selected.material.color.set(eventData.value);
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

      case "segments":
        const segmentWidth = document.getElementById("segments-width")?.value;
        const segmentheight = document.getElementById("segments-height")?.value;

        this.selectedObjects[0].geometry = new THREE.SphereGeometry(
          this.selectedObjects[0].geometry.parameters.radius,
          segmentWidth,
          segmentheight
        );

        break;
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
        this.deselectObjects();

        switch (eventData.value) {
          case "new":
            if (
              window.confirm(
                "Any unsaved data will be lost. Are you sure you want to do this?"
              )
            ) {
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
          case "import":
            let gltf = false;
            const input = document.createElement("input");
            const allowedTypes = [".gltf", ".obj"];
            input.type = "file";

            input.click();

            input.onchange = (e) => {
              const file = e.target.files[0];

              // if file is not of gltf/obj format
              if (!allowedTypes.some((type) => file.name.includes(type))) {
                return;
              }

              // if file is of gltf format
              if (file.name.includes(".gltf")) {
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
            // SELECTED ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            // WHOLE SCENE ~~~~~~~~~~~~~~~~~~~~~~~~~~~

            // Remove all static elements in the world
            const modelAlone = this.currentWorld.scene.children.filter(
              (object) => !object.name.includes("void-obj")
            );

            // console.log(modelAlone);
            const modelArray = modelSaver(modelAlone);

            // SAVING TO JSON FILE ~~~~~~~~~~~~~~~
            const output = JSON.stringify(modelArray, null, 2);

            const blob = new Blob([output], { type: "application/json" });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "model.json";
            link.click();
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
          this.currentWorld.removeObject(this.currentWorld.transformControls);
          this.currentWorld.transformControls.enabled = false;

          if (eventData.id === "scene-remove-btn") {
            this.selectedObjects.forEach((object) => {
              this.currentWorld.raycastableObjects.forEach((el, index) => {
                if (el === object) {
                  this.currentWorld.raycastableObjects.splice(index, 1);
                  this.removeFromMenuScene(el.uuid);
                }
              });
              this.currentWorld.removeObject(object);
            });
            this.deselectObjects();
          }

          if (eventData.id === "scene-group-btn") {
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
              }
            });
            this.deselectObjects();

            group.name = "group";
            this.currentWorld.addObject(group);
            this.addObjectFully(group);
            this.deselectObjects();
          }

          break;
        }

        if (eventData.dataset?.name === "expand-shrink") {
          const depth = eventData.value.slice(-1);
          const parentElement = document.getElementById("group-wrapper");
          const children = document.querySelectorAll(
            `.group-depth-${Number(depth) + 1}`
          );
          let childrenFlag = false;
          let restShow;
          let depthLevel = depth;

          console.log(parentElement);
          console.log(children);

          // Array.prototype.forEach.call(parentElement.children, (child) => {
          //   if (childrenFlag) {
          //     // console.log(child);
          //     if (child.style.display === "block") {
          //       console.log(child);
          //       restShow = "none";
          //     }
          //     if (eventData.element.textContent === "-" && restShow) {
          //       child.style.display = restShow;
          //     }
          //   }
          //   if (eventData.element.parentElement === child) {
          //     childrenFlag = true;
          //   }
          // });
          // console.log(eventData.element.children);

          eventData.element.textContent === "+"
            ? (eventData.element.textContent = "-")
            : (eventData.element.textContent = "+");

          children.forEach((child) => {
            if (child.children.length > 0) {
              // console.log(child.children);
              // child.children.forEach((child) => {
              //   if (child.style.display === "none") {
              //     const padding = ((Number(depth) + 1) * 12).toString() + "px";
              //     child.style.display = "block";
              //     child.style.paddingLeft = padding;
              //   } else {
              //     child.style.display = "none";
              //   }
              // });
            }
            if (child.style.display === "none") {
              const padding = ((Number(depth) + 1) * 12).toString() + "px";

              child.style.display = "block";
              child.style.paddingLeft = padding;
            } else {
              child.style.display = "none";
            }
          });
          // while (depthLevel >= 0) {

          //   console.log(depthLevel);
          //   depthLevel--;
          // }
        } else {
          const colorIn = document.getElementById("color-input");
          let selectedObj = null;

          // Grabbing selected object in the scene
          this.currentWorld.scene.children.forEach((object) => {
            if (
              object.type !== "Mesh" &&
              object.children.length > 0 &&
              !object.name.includes("void-obj")
            ) {
              this.traverseScene(object);
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
            if (object.uuid === eventData.value) {
              selectedObj = object;
            }
          });

          console.log(selectedObj);
          // console.log(eventData.value);
          // console.log(this.currentWorld.scene.children);

          // populating global selected objects array
          // Multiple objects selection
          if (eventData.ctrl && selectedObj !== null) {
            let addFlag = true;

            // preventing double selection
            this.selectedObjects.forEach((selected) => {
              if (selected.uuid === selectedObj.uuid) {
                addFlag = false;
              }
            });

            if (addFlag) {
              this.selectedObjects.push(selectedObj);
            }

            changeObjectMenu(
              "multiple",
              this.currentMode,
              this.menuParameterCapture
            );

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
            // GREEN CUBE OUTLINE
            // const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
            // const outlineMaterial2 = new THREE.MeshBasicMaterial( { color: 0x41fdfe, side: THREE.BackSide } );
            // const outlineMesh2 = new THREE.Mesh( cubeGeometry, outlineMaterial2 );
            // outlineMesh2.position.set(object.position.x, object.position.y, object.position.z)
            // outlineMesh2.scale.multiplyScalar(1.05);
            // this.currentWorld.addObject( outlineMesh2 );

            if (object.isGroup) {
              console.log("is group");
              this.recursiveObjectPaint(object);
            } else {
              object.material = new THREE.MeshBasicMaterial({
                color: object.material.color.getHex(),
                opacity: 0.6,
                transparent: true,
                side: THREE.DoubleSide,
              });
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

  traverseScene(children) {
    console.log(children);
    // children.forEach((object) => {
    //   // If object is tracked in the scene restore it's material
    //   if (object.name.includes("object")) {
    //     // console.log("selected color not working on imported objects");
    //     object.material = new THREE.MeshLambertMaterial({
    //       color: object.material?.color?.getHex(),
    //       side: THREE.DoubleSide,
    //     });
    //   }

    //   if (object.type !== "Mesh") {
    //     traverseScene();
    //   }

    //   // If it is the selected object
    //   if (object.uuid === eventData.value) {
    //     selectedObj = object;
    //   }
    // });
  }
}
