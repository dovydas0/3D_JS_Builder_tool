import * as THREE from 'three'

export class Canvas {
  constructor(fov, aspect, near, far) {
    // this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // this.cameraHelper = new THREE.CameraHelper( this.camera );

    // Renderer config
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    // this.renderer.shadowMap.type = THREE.BasicShadowMap
    // this.renderer.shadowMap.type = THREE.VSMShadowMap
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
  }

}