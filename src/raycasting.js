import * as THREE from 'three'

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
