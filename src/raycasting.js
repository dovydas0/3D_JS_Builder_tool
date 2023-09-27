import * as THREE from 'three'

export const onPointerUp = (e, pointer, raycaster, sceneObject, worldObject) => {
  const initialPos = { x: e.clientX, y: e.clientY }

  console.log('click');

  let movedDuringClick = false;

  const moveListener = (moveEvent) => {
    // Calculate the distance moved during the click
    const deltaX = Math.abs(moveEvent.clientX - initialPos.x);
    const deltaY = Math.abs(moveEvent.clientY - initialPos.y);

    // If the mouse has moved more than a certain threshold, set the flag
    if (deltaX > 5 || deltaY > 5) {
      console.log('moving');
      movedDuringClick = true;
    }
  };

  const upListener = () => {
    // Remove the move and up listeners
    window.removeEventListener("pointermove", moveListener);
    window.removeEventListener("pointerup", upListener);

    if (!movedDuringClick) {
      // Mouse was clicked without movement
      console.log('click released');
      pointerUpEvent();
    }
  };

  const pointerUpEvent = () => {
    raycaster.setFromCamera(pointer, sceneObject.camera)

    console.log('click up executed');

    const intersects = raycaster.intersectObjects(worldObject.buildableObjects, false)

    if (intersects.length > 0) {
      const intersect = intersects[0]
        
      // adjusting the point to exactly match mouse pointer position
      let intersectLoc = intersect.point
      intersectLoc.y += 0.5
      intersectLoc.z -= 1

      // Adding a block
      
      const rollGeo = new THREE.BoxGeometry( 1, 1, 1 );
      const rollMaterial = new THREE.MeshBasicMaterial( { color: 0x5544AA, opacity: 1 } );
      const rollMesh = new THREE.Mesh( rollGeo, rollMaterial );
      // rollMesh.position.addScalar(0.5)

      rollMesh.position.copy( intersectLoc ).add( intersect.face.normal );
      rollMesh.position.divideScalar(1).floor().multiplyScalar(1).addScalar( 0.5 )
      worldObject.addBuildableObject(rollMesh)
    }
  }
  
  window.addEventListener("pointermove", moveListener);
  window.addEventListener("pointerup", upListener);
}


export const onPointerMove = (event, pointer) => {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

export const raycasterIntersections = (currentMode, raycaster, pointer, sceneObject, worldObject) => {
  if (currentMode === "edit") {
    worldObject.rollOverMaterial.opacity = 0.5
  
    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera( pointer, sceneObject.camera );

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( worldObject.buildableObjects, false );

    
    if (intersects.length > 0) {
      const intersect = intersects[0]
      
      // adjusting the point to exactly match mouse pointer position
      let intersectLoc = intersect.point
      intersectLoc.y += 0.5
      intersectLoc.z -= 1

      // Rendering block's placeholder
      worldObject.rollOverMesh.position.copy( intersectLoc ).add( intersect.face.normal );
      worldObject.rollOverMesh.position.divideScalar(1).floor().addScalar( 0.5 )
    }
  } else {
    worldObject.rollOverMaterial.opacity = 0
  }
}
