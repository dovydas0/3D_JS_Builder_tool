import * as THREE from 'three'
import { Cube } from './objects/interactive/Cube';
import { Sphere } from './objects/interactive/Sphere';
import { Cylinder } from './objects/interactive/Cylinder';



export const onPointerDown = (e, pointer, raycaster, worldObject, menu, outline, selectedObjects, addSelectedObject) => {
  if (menu.currentMode === "editor") {
    const initialPos = { x: e.clientX, y: e.clientY }
  
    let movedDuringClick = false;
  
    const moveListener = (moveEvent) => {
      // Calculate the distance moved during the click
      const deltaX = Math.abs(moveEvent.clientX - initialPos.x);
      const deltaY = Math.abs(moveEvent.clientY - initialPos.y);
  
      // If the mouse has moved more than a certain threshold, set the flag
      if (deltaX > 1.5 || deltaY > 1.5) {
        document.getElementsByTagName("body")[0].style.cursor = "crosshair"
        movedDuringClick = true;
      }
    };
  
    const upListener = () => {
      document.getElementsByTagName("body")[0].style.cursor = "default"
      // Remove the move and up listeners
      window.removeEventListener("pointermove", moveListener);
      window.removeEventListener("pointerup", upListener);

  
      if (!movedDuringClick) {
        // Mouse was clicked without movement
        handlePointerUp();
      }
    };
  
    const handlePointerUp = () => {
      raycaster.setFromCamera(pointer, worldObject.camera)
  
      const intersects = raycaster.intersectObjects(menu.currentWorld.raycastableObjects, false)
  
      if (intersects.length > 0) {
        const intersect = intersects[0]
        // const selectedObject = intersects[0].object
        // addSelectedObject( selectedObject );
        // outline.selectedObjects = selectedObjects;
          
        let intersectLoc = intersect.point
        // Slight change in parameters to prevent visual inadequacy
        intersectLoc.y += 0.0000001

        // ~~~ IMPLEMENT A CHECK FOR EXISTING BLOCKS IN THE PLACEHOLDER'S AREA
        // Step 1: Iterate through every object in the world
        // Step 2: check if object's x, y, z locations aren't within intersectLoc locations

        if (e.shiftKey) {
          // Removing an object
          if (intersect.object.name.includes('object')) {
            menu.currentWorld.removeObject(intersect.object)

            menu.currentWorld.raycastableObjects.forEach((el, index) => {
              if (el === intersect.object) {
                menu.currentWorld.raycastableObjects.splice(index, 1)
                menu.removeFromMenuScene(el.uuid)
              }
            })
          }
        } else if (e.ctrlKey) {
          if (intersect.object.name.includes('object')) {
            menu.highlightObjectInMenu(intersect.object.uuid)

            menu.currentWorld.raycastableObjects.forEach(object => {
              object.material = new THREE.MeshLambertMaterial({ color: object.material.color.getHex() })

              if (object.uuid === intersect.object.uuid) {
                // GREEN CUBE OUTLINE
                // const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
                // const outlineMaterial2 = new THREE.MeshBasicMaterial( { color: 0x41fdfe, side: THREE.BackSide } );
                // const outlineMesh2 = new THREE.Mesh( cubeGeometry, outlineMaterial2 );
                // outlineMesh2.position.set(object.position.x, object.position.y, object.position.z)
                // outlineMesh2.scale.multiplyScalar(1.05);
                // this.currentWorld.addObject( outlineMesh2 );
    
                object.material = new THREE.MeshBasicMaterial({ color: object.material.color.getHex(), opacity: 0.85, transparent: true })
                menu.selectedObject = object
              } else {
                menu.selectedObject = null
              }
            })
            console.log(intersect);
          }
        } else {
          // deselecting objects

          // Adding an object
          let newObject

          switch(menu.currentObject.mesh.geometry.type) {
            case "BoxGeometry":
              const currentObject = {
                depth: Math.floor(menu.currentObject.geometry.parameters.depth),
                height: Math.floor(menu.currentObject.geometry.parameters.height),
                width: Math.floor(menu.currentObject.geometry.parameters.width)
              }
              newObject = new Cube("object-Cube", currentObject.width, currentObject.depth, currentObject.height, menu.currentObjectColor, "Lambert")
              break;
            case "SphereGeometry":
              newObject = new Sphere("object-Sphere", menu.currentObject.radius, menu.currentObjectColor, "Lambert", false, 32, 16)
              break;
            case "CylinderGeometry":
              // newObject = new Cylinder("object-Cylinder", menu.currentObject.radius, 0x5544AA, "Lambert", false, 32, 16)
              break;
          }

          if (newObject?.mesh) {
            const positionVector = new THREE.Vector3( Math.floor(worldObject.placeholderObject.geometry.parameters.width) / 2, Math.floor(worldObject.placeholderObject.geometry.parameters.height) / 2, Math.floor(worldObject.placeholderObject.geometry.parameters.depth) / 2)
            newObject.mesh.position.copy( intersectLoc )

            switch (newObject.geometry.type) {
              case "BoxGeometry":
                newObject.mesh.position.divideScalar(1).floor()
                .add(positionVector)
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

                newObject.mesh.position.divideScalar(1).floor()
                .add(new THREE.Vector3(0.5, worldObject.placeholderObject.radius, 0.5))
                break;
              case "CylinderGeometry":                  
                // newObject.mesh.position.divideScalar(1).floor()
                // .add(new THREE.Vector3(0.5, worldObject.placeholderObject.radius, 0.5))
                break;
            }
            menu.currentWorld.addRaycastableObject(newObject.mesh)
            menu.addToMenuScene(newObject.mesh)
          }
        }
      }
    }
    
    window.addEventListener("pointermove", moveListener);
    window.addEventListener("pointerup", upListener);
  }
}


export const onPointerMove = (event, pointer) => {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

export const raycasterIntersections = (currentMode, raycaster, pointer, worldObject) => {  
  if (currentMode === "editor") {
    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera( pointer, worldObject.camera );

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( worldObject.raycastableObjects, false );

    if (intersects.length > 0) {

      const intersect = intersects[0]
      
      // adjusting the point to exactly match mouse pointer position
      let intersectLoc = intersect.point
      intersectLoc.y += 0.0000001

      // Rendering different object's placeholder
      worldObject.placeholderObject.mesh.position.copy( intersectLoc )

      switch (worldObject.placeholderObject.geometry.type) {
        case "BoxGeometry":
          worldObject.placeholderObject.mesh.position.divideScalar(1).floor()
          .add(new THREE.Vector3( Math.floor(worldObject.placeholderObject.geometry.parameters.width) / 2, Math.floor(worldObject.placeholderObject.geometry.parameters.height) / 2, Math.floor(worldObject.placeholderObject.geometry.parameters.depth) / 2))
          break;
        case "SphereGeometry":
          worldObject.placeholderObject.mesh.position.divideScalar(1).floor()
          .add(new THREE.Vector3(0.5, worldObject.placeholderObject.radius, 0.5))
          break;
        case "CylinderGeometry":

          break;
      }
    }
  }
}
