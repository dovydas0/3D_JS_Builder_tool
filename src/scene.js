import * as THREE from 'three';

export class Scene {
  #cameraHelper = null;
  
  constructor(fov, aspect, near, far) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xf0f0f0 );
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // Helpers
    this.gridHelper = new THREE.GridHelper(200, 200)
    this.axesHelper = new THREE.AxesHelper(10)
    this.cameraHelper = new THREE.CameraHelper( this.camera );
    
    // Renderer config
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    // this.renderer.shadowMap.type = THREE.BasicShadowMap
    // this.renderer.shadowMap.type = THREE.VSMShadowMap
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  initScene() {
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
  }

  addObject(object) {
    this.scene.add(object)
  }
  
  removeObject(object) {
    this.scene.remove(object)
  }
}
