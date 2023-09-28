import * as THREE from 'three';

export class Scene {
  #axesHelper = new THREE.AxesHelper(10)
  #gridHelper = new THREE.GridHelper(200, 200)
  #cameraHelper = null;
  
  constructor(fov, aspect, near, far) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xf0f0f0 );
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.#cameraHelper = new THREE.CameraHelper( this.camera );

    this.renderer.shadowMap.enabled = true
    // this.renderer.shadowMap.type = THREE.BasicShadowMap
    // this.renderer.shadowMap.type = THREE.VSMShadowMap
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.shadowMap.type = THREE.PCFShadowMap
  }

  initScene() {
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
  }

  addObject(object) {
    this.scene.add(object)
  }

  axesHelper() {
    this.addObject(this.#axesHelper)
  }

  cameraHelper() {
    this.addObject(this.#cameraHelper)
  }

  gridHelper() {
    this.addObject(this.#gridHelper)
  }
}
