import * as THREE from "three";
import { CompressedArrayTexture } from "three/src/textures/CompressedArrayTexture";
import { Cube } from "../objects/interactive/Cube";
import { Cylinder } from "../objects/interactive/Cylinder";
import { Sphere } from "../objects/interactive/Sphere";
import { changeInfo } from "./changeInfo";
import { changeMenu } from "./changeMenu";
import { changeSceneMenu } from "./changeSceneMenu";
import { changeObjectMenu } from "./changeObjectMenu";
import { reassigningObjectEventListeners } from "../utilities/populateEventListeners";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { nameConverter } from "../utilities/nameConverter";

export class Menu {
  constructor(worldObject, placeholderObject) {
    // STORE ALL BLOCKS IN AN ARRAY HERE
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
    // Set all menu parameters to local variables for easier object manipulation
    // this.currentObjectForm
    // this.currentObjectX
    // this.currentObjectY
    // this.currentObjectZ

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

    // Enabling/disabling camera controls
    if (previousWorld.scene.name === "editor" && mode !== "editor") {
      this.currentWorld.controls.enabled = false;
    } else if (mode === "editor") {
      world.controls.enabled = true;
    }

    this.currentMode = mode;
    this.currentWorld = world;
    changeMenu(mode, this.menuParameterCapture);
    changeSceneMenu(mode, this.menuParameterCapture);
    changeInfo(mode);
    this.deselectObjects();

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
        const colorEditor = document.getElementById("color-input")?.value;

        const objectsEditor = document.getElementById("scene-objects");
        const sceneObjectsEditor = Array.from(objectsEditor.children);

        this.menuParameterCapture[prevMode] = {
          floorTiles: floorTilesEditor,
          axisHelper: axisHelperEditor,
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
          rotation: rotationStudy.checked,
          axisHelper: axisHelperStudy.checked,
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

  addToMenuScene(objectToAdd) {
    const sceneObjects = document.getElementById("scene-objects");
    let nameRepetitions = -1;
    let objName = objectToAdd.name.split("object-")[1];

    // cunstruction of non-repeating name
    if (objectToAdd) {
      for (const object of this.currentWorld.scene.children) {
        if (object.name === objectToAdd.name) {
          nameRepetitions += 1;
        }
      }
    }
    for (const obj of sceneObjects.children) {
      if (obj.dataset.obj === objName + nameRepetitions) {
        nameRepetitions += 1;
      }
    }

    // Assigning number next to name if identical name already exists
    if (nameRepetitions > 0) {
      objName += nameRepetitions;
    }

    sceneObjects.innerHTML += `
      <div data-obj="${objName}" id="${objectToAdd.uuid}">${objName}</div>
    `;
  }

  removeFromMenuScene(id) {
    const sceneObjects = document.getElementById("scene-objects");

    for (const object of sceneObjects.children) {
      if (object.id === id) {
        sceneObjects.removeChild(object);
      }
    }
  }

  highlightObjectInMenu(objects) {
    const sceneObjects = document.getElementById("scene-objects");

    for (const obj of sceneObjects.children) {
      obj.classList.remove("selected");

      // selecting multiple objects
      objects?.forEach((object) => {
        if (obj.id === object.uuid) {
          obj.classList.add("selected");
        }
      });
    }
  }

  DeselectObjectInMenu() {
    const sceneObjects = document.getElementById("scene-objects");

    for (const obj of sceneObjects.children) {
      obj.classList.remove("selected");
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
          Math.floor(this.selectedObjects[0].geometry.parameters.depth) -
          yDimSel;
        const zDifference =
          Math.floor(this.selectedObjects[0].geometry.parameters.height) -
          zDimSel;

        const newGeometry = new THREE.BoxGeometry(
          xDimSel + 0.00006,
          zDimSel + 0.00006,
          yDimSel + 0.00006
        );

        this.selectedObjects[0].geometry = newGeometry;

        this.selectedObjects[0].position.x -= xDifference / 2;
        this.selectedObjects[0].position.z -= yDifference / 2;
        this.selectedObjects[0].position.y -= zDifference / 2;
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

        this.selectedObjects[0].geometry = new THREE.SphereGeometry(
          sphereRadius
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

        console.log(openEndedSelected);

        const heightDifference =
          Math.floor(this.selectedObjects[0].geometry.parameters.height) -
          heightSelected;

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

        // If new object created successfully
        // if (newCylinderGeom?.mesh) {
        //   // Placing the new cylinder into the same position
        //   newCylinderSelected.mesh.position.copy(
        //     this.selectedObjects[0].position
        //   );

        //   // Removing old placeholder object and adding a new one
        //   this.currentWorld.scene.remove(this.selectedObjects[0]);

        //   this.currentWorld.addRaycastableObject(newCylinderSelected.mesh);
        //   this.addToMenuScene(newCylinderSelected);
        //   this.currentObject = newCylinderSelected;
        // }
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
              newObject.mesh.position.set(0.5, 0.5, 0.5);
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
              newObject.mesh.position.set(0.5, 0.5, 0.5);

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

              newObject.mesh.position.set(0.5, 0.5, 0.5);
              break;
          }

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
        }

        // If new object created successfully
        if (addObject?.mesh) {
          this.currentWorld.addRaycastableObject(addObject.mesh);
          this.addToMenuScene(addObject.mesh);
        }

        break;
      case "scene":
        const colorIn = document.getElementById("color-input");
        let selectedObj = null;

        // Grabbing selected object in the scene
        this.currentWorld.scene.children.forEach((object) => {
          // If object is tracked in the scene restore it's material
          if (object.name.includes("object")) {
            object.material = new THREE.MeshLambertMaterial({
              color: object.material.color.getHex(),
              side: THREE.DoubleSide,
            });
          }

          // If it is the selected object
          if (object.uuid === eventData.value) {
            selectedObj = object;
          }
        });

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
          } else if (this.currentMode === "study") {
            colorIn.value = this.colorBeforeSelectionStudy;
          }
        }
        // Single object selection
        else if (selectedObj !== null) {
          this.selectedObjects = [selectedObj];

          changeObjectMenu(
            nameConverter(this.selectedObjects[0].geometry.type),
            this.currentMode,
            this.menuParameterCapture,
            this.selectedObjects[0]
          );

          colorIn.value = "#" + selectedObj.material.color.getHexString();
        }
        // Press on the scene div (not on object)
        else {
          this.selectedObjects = [];

          changeObjectMenu("", this.currentMode, this.menuParameterCapture);

          if (this.currentMode === "editor") {
            colorIn.value = this.colorBeforeSelectionEditor;
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

          object.material = new THREE.MeshBasicMaterial({
            color: object.material.color.getHex(),
            opacity: 0.6,
            transparent: true,
            side: THREE.DoubleSide,
          });
        });

        // Reassinging parameter buttons event listeners
        reassigningObjectEventListeners(this);

        // Highlighting selected objects in menu
        this.highlightObjectInMenu(this.selectedObjects);
        break;
    }
  }
}
