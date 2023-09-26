import * as THREE from 'three'

export const printingCanvas = (sceneObject) => {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const onPointerMove = (event) => {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  }

  
  canvas.addEventListener("mousemove", (e) => {
    const geometry = new THREE.PlaneGeometry( 1, 1 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    console.log("x: ", e.clientX);
    console.log("y: ", e.clientY);
    // plane.position.x = e.clientX
    // plane.position.y = e.clientY
    // plane.position.z = 0
    sceneObject.scene.add( plane );
    // const mesh 
    // e.x
  })
}
