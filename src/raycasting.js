import * as THREE from 'three'
import { Block } from './objects/interactive/block';

export const onPointerDown = (e, pointer, raycaster, sceneObject, worldObject, menu) => {
  if (menu.currentMode === "editor") {
    const initialPos = { x: e.clientX, y: e.clientY }
  
    let movedDuringClick = false;
  
    const moveListener = (moveEvent) => {
      // Calculate the distance moved during the click
      const deltaX = Math.abs(moveEvent.clientX - initialPos.x);
      const deltaY = Math.abs(moveEvent.clientY - initialPos.y);
  
      // If the mouse has moved more than a certain threshold, set the flag
      if (deltaX > 5 || deltaY > 5) {
        movedDuringClick = true;
      }
    };
  
    const upListener = () => {
      // Remove the move and up listeners
      window.removeEventListener("pointermove", moveListener);
      window.removeEventListener("pointerup", upListener);
  
      if (!movedDuringClick) {
        // Mouse was clicked without movement
        handlePointerUp();
      }
    };
  
    const handlePointerUp = () => {
      raycaster.setFromCamera(pointer, sceneObject.camera)
  
      const intersects = raycaster.intersectObjects(worldObject.raycastableObjects, false)
  
      if (intersects.length > 0) {
        const intersect = intersects[0]
          
        // adjusting the point to exactly match mouse pointer position
        let intersectLoc = intersect.point
        intersectLoc.y += 0.0000001

        // ~~~ IMPLEMENT A CHECK FOR EXISTING BLOCKS IN THE PLACEHOLDER'S AREA
        console.log(intersect);


        // Adding a block
        const currentBlock = {
          depth: Math.floor(menu.currentBlock.geometry.parameters.depth),
          height: Math.floor(menu.currentBlock.geometry.parameters.height),
          width: Math.floor(menu.currentBlock.geometry.parameters.width)
        }
        const newBlock = new Block(null, null, currentBlock.width, currentBlock.depth, currentBlock.height, 0x5544AA, "Lambert")
        const positionVector = new THREE.Vector3( Math.floor(worldObject.placeholderBlock.geometry.parameters.width) / 2, Math.floor(worldObject.placeholderBlock.geometry.parameters.height) / 2, Math.floor(worldObject.placeholderBlock.geometry.parameters.depth) / 2)

        newBlock.mesh.position.copy( intersectLoc )
        newBlock.mesh.position.divideScalar(1).floor().add(positionVector)
  
        worldObject.addRaycastableObject(newBlock.mesh)
      }
    }
    
    window.addEventListener("pointermove", moveListener);
    window.addEventListener("pointerup", upListener);
  }
}


export const onPointerMove = (event, pointer, worldObject) => {
  worldObject.placeholderBlock.mesh.visible = true

  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

export const raycasterIntersections = (currentMode, raycaster, pointer, sceneObject, worldObject) => {
  // console.log(currentMode);
  
  if (currentMode === "editor") {  
    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera( pointer, sceneObject.camera );

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( worldObject.raycastableObjects, false );
    
    if (intersects.length > 0) {

      const intersect = intersects[0]
      
      // adjusting the point to exactly match mouse pointer position
      let intersectLoc = intersect.point
      intersectLoc.y += 0.0000001

      // Rendering block's placeholder
      worldObject.placeholderBlock.mesh.position.copy( intersectLoc )
      worldObject.placeholderBlock.mesh.position.divideScalar(1).floor()
      .add(new THREE.Vector3( Math.floor(worldObject.placeholderBlock.geometry.parameters.width) / 2, Math.floor(worldObject.placeholderBlock.geometry.parameters.height) / 2, Math.floor(worldObject.placeholderBlock.geometry.parameters.depth) / 2))
    }
  } else {
    worldObject.placeholderBlock.mesh.visible = false
  }
}
