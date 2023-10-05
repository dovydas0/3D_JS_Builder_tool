import * as THREE from 'three'
import { Cube } from './objects/interactive/Cube';

export const onPointerDown = (e, pointer, raycaster, canvas, worldObject, menu) => {
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
      raycaster.setFromCamera(pointer, canvas.camera)
  
      const intersects = raycaster.intersectObjects(worldObject.raycastableObjects, false)
  
      if (intersects.length > 0) {
        const intersect = intersects[0]
          
        // adjusting the point to exactly match mouse pointer position
        let intersectLoc = intersect.point
        intersectLoc.y += 0.0000001

        // ~~~ IMPLEMENT A CHECK FOR EXISTING BLOCKS IN THE PLACEHOLDER'S AREA
        
        
        if (e.shiftKey) {
          // Removing an object
          if (intersect.object.name === 'object') {
            menu.currentScene.removeObject(intersect.object)

            worldObject.raycastableObjects.forEach((el, index) => {
              if (el === intersect.object) {
                worldObject.raycastableObjects.splice(index, 1)
              }
            })
          }
        } else {
          // Adding an object

          console.log(menu.currentObject);
          const currentObject = {
            depth: Math.floor(menu.currentObject.geometry.parameters.depth),
            height: Math.floor(menu.currentObject.geometry.parameters.height),
            width: Math.floor(menu.currentObject.geometry.parameters.width)
          }
          const newObject = new Cube("object", currentObject.width, currentObject.depth, currentObject.height, 0x5544AA, "Lambert")
          const positionVector = new THREE.Vector3( Math.floor(worldObject.placeholderObject.geometry.parameters.width) / 2, Math.floor(worldObject.placeholderObject.geometry.parameters.height) / 2, Math.floor(worldObject.placeholderObject.geometry.parameters.depth) / 2)
  
          newObject.mesh.position.copy( intersectLoc )
          newObject.mesh.position.divideScalar(1).floor().add(positionVector)
    
          worldObject.addRaycastableObject(newObject.mesh)
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

export const raycasterIntersections = (currentMode, raycaster, pointer, canvas, worldObject) => {  
  if (currentMode === "editor") {  
    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera( pointer, canvas.camera );

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( worldObject.raycastableObjects, false );
    
    if (intersects.length > 0) {

      const intersect = intersects[0]
      
      // adjusting the point to exactly match mouse pointer position
      let intersectLoc = intersect.point
      intersectLoc.y += 0.0000001

      // console.log(worldObject.placeholderObject.mesh.position);

      // Rendering block's placeholder
      worldObject.placeholderObject.mesh.position.copy( intersectLoc )
      worldObject.placeholderObject.mesh.position.divideScalar(1).floor()
      .add(new THREE.Vector3( Math.floor(worldObject.placeholderObject.geometry.parameters.width) / 2, Math.floor(worldObject.placeholderObject.geometry.parameters.height) / 2, Math.floor(worldObject.placeholderObject.geometry.parameters.depth) / 2))
    }
  }
}
