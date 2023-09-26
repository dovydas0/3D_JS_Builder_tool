import * as THREE from 'three';

export class Scene {
  #axesHelper = new THREE.AxesHelper( 3 )
  #cameraHelper = null;
  
  constructor(fov, aspect, near, far) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far );
    this.renderer = new THREE.WebGLRenderer();

    this.#cameraHelper = new THREE.CameraHelper( this.camera );
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
}
