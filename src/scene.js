import * as THREE from 'three';

export class Scene {  
  constructor(name) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xf0f0f0 );
    this.scene.name = name
    // Helpers
    this.gridHelper = new THREE.GridHelper(200, 200)
    this.axesHelper = new THREE.AxesHelper(10)
  }

  addObject(object) {
    // console.log("adding: ", object);
    this.scene.add(object)
  }
  
  removeObject(object) {
    this.scene.remove(object)
  }
}
