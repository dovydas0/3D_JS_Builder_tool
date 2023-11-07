import * as THREE from "three";
import { Cube } from "./objects/interactive/Cube";
import { Sphere } from "./objects/interactive/Sphere";
import { Cylinder } from "./objects/interactive/Cylinder";
import { changeObjectMenu } from "./UI/changeObjectMenu";
import { reassigningObjectEventListeners } from "./utilities/populateEventListeners";
import { nameConverter } from "./utilities/nameConverter";
import { Capsule } from "./objects/interactive/Capsule";

export const onPointerDown = (
  event,
  pointer,
  raycaster,
  menu,
  outline,
  selectedObjects,
  addSelectedObject
) => {
  const initialPos = { x: event.clientX, y: event.clientY };

  let movedDuringClick = false;

  const moveListener = (moveEvent) => {
    // Calculate the distance moved during the click
    const deltaX = Math.abs(moveEvent.clientX - initialPos.x);
    const deltaY = Math.abs(moveEvent.clientY - initialPos.y);

    // If the mouse has moved more than a certain threshold, set the flag
    if ((deltaX > 1.5 || deltaY > 1.5) && menu.currentMode === "editor") {
      document.getElementsByTagName("body")[0].style.cursor = "crosshair";
      movedDuringClick = true;
    }
  };

  const upListener = () => {
    document.getElementsByTagName("body")[0].style.cursor = "default";
    // Remove the move and up listeners
    window.removeEventListener("pointermove", moveListener);
    window.removeEventListener("pointerup", upListener);

    if (!movedDuringClick) {
      // Mouse was clicked without movement
      handlePointerUp();
    }
  };

  const handlePointerUp = () => {
    raycaster.setFromCamera(pointer, menu.currentWorld.camera);

    const intersects = raycaster.intersectObjects(
      menu.currentWorld.raycastableObjects,
      false
    );

    if (intersects.length > 0) {
      const intersect = intersects[0];
      // const selectedObject = intersects[0].object
      // addSelectedObject( selectedObject );
      // outline.selectedObjects = selectedObjects;

      let intersectLoc = intersect.point;
      // Slight change in parameters to prevent visual inadequacy
      intersectLoc.y += 0.0000001;

      // ~~~ IMPLEMENT A CHECK FOR EXISTING BLOCKS IN THE PLACEHOLDER'S AREA
      // Step 1: Iterate through every object in the world
      // Step 2: check if object's x, y, z locations aren't within intersectLoc locations

      if (event.shiftKey) {
        // Removing an object
        if (intersect.object.name.includes("object")) {
          menu.currentWorld.removeObject(intersect.object);

          menu.currentWorld.raycastableObjects.forEach((el, index) => {
            if (el === intersect.object) {
              menu.currentWorld.raycastableObjects.splice(index, 1);
              menu.removeFromMenuScene(el.uuid);
            }

            menu.selectedObjects.forEach((obj) => {
              if (obj.uuid === intersect.object.uuid) {
                menu.deselectObjects();
              }
            });
          });
        }
      } else if (event.ctrlKey) {
        if (intersect.object.name.includes("object")) {
          selectObjects(intersect.object, menu);

          // Changing parameter value to selected object
          const colorInput = document.getElementById("color-input");
          colorInput.value =
            "#" + intersect.object.material.color.getHexString();

          if (menu.selectedObjects.length === 0) {
            changeObjectMenu("", menu.currentMode, menu.menuParameterCapture);
          }

          if (menu.selectedObjects.length === 1) {
            changeObjectMenu(
              nameConverter(menu.selectedObjects[0].geometry.type),
              menu.currentMode,
              menu.menuParameterCapture,
              menu.selectedObjects[0]
            );
          }

          if (menu.selectedObjects.length > 1) {
            changeObjectMenu(
              "multiple",
              menu.currentMode,
              menu.menuParameterCapture,
              menu.selectedObjects[0]
            );

            if (menu.currentMode === "editor") {
              colorInput.value = menu.colorBeforeSelectionEditor;
            } else if (menu.currentMode === "study") {
              colorInput.value = menu.colorBeforeSelectionStudy;
            }
          }
          // Reassinging parameter buttons event listeners
          reassigningObjectEventListeners(menu);
        }
      } else if (menu.currentMode === "editor") {
        // deselecting objects
        selectObjects(null, menu);

        // Adding an object
        let newObject;

        switch (menu.currentObject.mesh.geometry.type) {
          case "BoxGeometry":
            const currentObject = {
              depth: Math.floor(menu.currentObject.geometry.parameters.height),
              height: Math.floor(menu.currentObject.geometry.parameters.depth),
              width: Math.floor(menu.currentObject.geometry.parameters.width),
            };
            newObject = new Cube(
              "object-Cube",
              currentObject.width,
              currentObject.depth,
              currentObject.height,
              menu.currentObjectColor,
              "Lambert"
            );
            break;
          case "SphereGeometry":
            newObject = new Sphere(
              "object-Sphere",
              menu.currentObject.radius,
              menu.currentObjectColor,
              "Lambert",
              false,
              32,
              16
            );
            break;
          case "CylinderGeometry":
            newObject = new Cylinder(
              "object-Cylinder",
              menu.currentObject.geometry.parameters.radiusTop,
              menu.currentObject.geometry.parameters.radiusBottom,
              menu.currentObject.geometry.parameters.height,
              menu.currentObjectColor,
              "Lambert",
              false,
              menu.currentObject.geometry.parameters.radialSegments,
              menu.currentObject.geometry.parameters.openEnded
            );
            break;
          case "CapsuleGeometry":
            newObject = new Capsule(
              "object-Capsule",
              menu.currentObject.geometry.parameters.radius,
              menu.currentObject.geometry.parameters.length,
              menu.currentObjectColor,
              "Lambert",
              false,
              menu.currentObject.geometry.parameters.capSegments,
              menu.currentObject.geometry.parameters.radialSegments
            );
            break;
        }

        if (newObject?.mesh) {
          const positionVector = new THREE.Vector3(
            Math.floor(
              menu.currentWorld.placeholderObject.geometry.parameters.width
            ) / 2,
            Math.floor(
              menu.currentWorld.placeholderObject.geometry.parameters.height
            ) / 2,
            Math.floor(
              menu.currentWorld.placeholderObject.geometry.parameters.depth
            ) / 2
          );
          newObject.mesh.position.copy(intersectLoc);

          switch (newObject.geometry.type) {
            case "BoxGeometry":
              newObject.mesh.position
                .divideScalar(1)
                .floor()
                .add(positionVector);
              break;
            case "SphereGeometry":
              // INVISIBLE CUBE FOR BETTER OBJECT PLACEMENT AROUND SPHERE

              // const size = menu.currentObject.radius
              // const hiddenNewObject = new Cube("object", size * 2, size * 2, size * 2, 0x5544AA, "Lambert")
              // const hiddenPositionVector = new THREE.Vector3( 0.5, size, 0.5)

              // hiddenNewObject.mesh.position.copy(intersectLoc)
              // hiddenNewObject.mesh.position.divideScalar(1).floor().add(hiddenPositionVector)
              // hiddenNewObject.mesh.visible = false
              // menu.currentWorld.addRaycastableObject(hiddenNewObject.mesh)

              newObject.mesh.position
                .divideScalar(1)
                .floor()
                .add(
                  new THREE.Vector3(
                    0.5,
                    menu.currentWorld.placeholderObject.radius,
                    0.5
                  )
                );
              break;
            case "CylinderGeometry":
              // INVISIBLE CUBE FOR BETTER OBJECT PLACEMENT AROUND SPHERE

              // const size = menu.currentObject.radius
              // const hiddenNewObject = new Cube("object", size * 2, size * 2, size * 2, 0x5544AA, "Lambert")
              // const hiddenPositionVector = new THREE.Vector3( 0.5, size, 0.5)

              // hiddenNewObject.mesh.position.copy(intersectLoc)
              // hiddenNewObject.mesh.position.divideScalar(1).floor().add(hiddenPositionVector)
              // hiddenNewObject.mesh.visible = false
              // menu.currentWorld.addRaycastableObject(hiddenNewObject.mesh)

              newObject.mesh.position
                .divideScalar(1)
                .floor()
                .add(
                  new THREE.Vector3(
                    0.5,
                    menu.currentWorld.placeholderObject.geometry.parameters
                      .height / 2,
                    0.5
                  )
                );
              break;
            case "CapsuleGeometry":
              // INVISIBLE CUBE FOR BETTER OBJECT PLACEMENT AROUND SPHERE

              // const size = menu.currentObject.radius
              // const hiddenNewObject = new Cube("object", size * 2, size * 2, size * 2, 0x5544AA, "Lambert")
              // const hiddenPositionVector = new THREE.Vector3( 0.5, size, 0.5)

              // hiddenNewObject.mesh.position.copy(intersectLoc)
              // hiddenNewObject.mesh.position.divideScalar(1).floor().add(hiddenPositionVector)
              // hiddenNewObject.mesh.visible = false
              // menu.currentWorld.addRaycastableObject(hiddenNewObject.mesh)

              newObject.mesh.position
                .divideScalar(1)
                .floor()
                .add(
                  new THREE.Vector3(
                    0.5,
                    menu.currentWorld.placeholderObject.geometry.parameters
                      .radius +
                      menu.currentWorld.placeholderObject.geometry.parameters
                        .length /
                        2,
                    0.5
                  )
                );
              break;
          }
          menu.currentWorld.addRaycastableObject(newObject.mesh);
          menu.addToMenuScene(newObject.mesh);
        }
      }
    } else if (menu.currentMode === "study") {
      selectObjects(null, menu);
      changeObjectMenu(
        "",
        menu.currentMode,
        menu.menuParameterCapture,
        menu.selectedObjects[0]
      );

      // Reassinging parameter buttons event listeners
      reassigningObjectEventListeners(menu);
    }
  };

  window.addEventListener("pointermove", moveListener);
  window.addEventListener("pointerup", upListener);
};

export const onPointerMove = (event, pointer) => {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

export const raycasterIntersections = (
  currentMode,
  raycaster,
  pointer,
  worldObject
) => {
  if (currentMode === "editor") {
    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, worldObject.camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(
      worldObject.raycastableObjects,
      false
    );

    if (intersects.length > 0) {
      const intersect = intersects[0];

      // adjusting the point to exactly match mouse pointer position
      let intersectLoc = intersect.point;
      intersectLoc.y += 0.0000001;

      // Rendering different object's placeholder
      worldObject.placeholderObject.mesh.position.copy(intersectLoc);

      switch (worldObject.placeholderObject.geometry.type) {
        case "BoxGeometry":
          worldObject.placeholderObject.mesh.position
            .divideScalar(1)
            .floor()
            .add(
              new THREE.Vector3(
                Math.floor(
                  worldObject.placeholderObject.geometry.parameters.width
                ) / 2,
                Math.floor(
                  worldObject.placeholderObject.geometry.parameters.height
                ) / 2,
                Math.floor(
                  worldObject.placeholderObject.geometry.parameters.depth
                ) / 2
              )
            );
          break;
        case "SphereGeometry":
          worldObject.placeholderObject.mesh.position
            .divideScalar(1)
            .floor()
            .add(
              new THREE.Vector3(0.5, worldObject.placeholderObject.radius, 0.5)
            );
          break;
        case "CylinderGeometry":
          // console.log(worldObject.placeholderObject.geometry.parameters);
          worldObject.placeholderObject.mesh.position
            .divideScalar(1)
            .floor()
            .add(
              new THREE.Vector3(
                0.5,
                worldObject.placeholderObject.geometry.parameters.height / 2,
                0.5
              )
            );
          break;
        case "CapsuleGeometry":
          // console.log(worldObject.placeholderObject.geometry.parameters);
          worldObject.placeholderObject.mesh.position
            .divideScalar(1)
            .floor()
            .add(
              new THREE.Vector3(
                0.5,
                worldObject.placeholderObject.geometry.parameters.radius +
                  worldObject.placeholderObject.geometry.parameters.length / 2,
                0.5
              )
            );
          break;
      }
    }
  }
};

const selectObjects = (selected, menu) => {
  // Grabbing selected object in the scene
  menu.currentWorld.raycastableObjects.forEach((object) => {
    if (object.name !== "void-obj-floor") {
      object.material = new THREE.MeshLambertMaterial({
        color: object.material.color.getHex(),
        side: THREE.DoubleSide,
      });
    }
  });

  const colorInput = document.getElementById("color-input");
  if (menu.currentMode === "editor") {
    colorInput.value = menu.colorBeforeSelectionEditor;
  } else if (menu.currentMode === "study") {
    colorInput.value = menu.colorBeforeSelectionStudy;
  }

  // Removing specific object tools
  changeObjectMenu("", menu.currentMode, menu.menuParameterCapture);

  // populating global selected objects array
  if (selected) {
    let addFlag = true;

    // preventing double selection
    menu.selectedObjects?.forEach((selectedObj) => {
      if (selectedObj.uuid === selected.uuid) {
        addFlag = false;
      }
    });

    if (addFlag) {
      menu.selectedObjects.push(selected);
    }
  } else {
    menu.selectedObjects = [];
  }

  // Painting all selected objects
  menu.selectedObjects?.forEach((object) => {
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

  // Highlighting selected objects in menu
  menu.highlightObjectInMenu(menu.selectedObjects);
};
