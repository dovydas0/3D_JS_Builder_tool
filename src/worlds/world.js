import * as THREE from 'three'
import { Floor } from '../objects/non-interactive/floor'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Cube } from '../objects/interactive/Cube'

export class World {
  constructor(canvas) {
    // Initializing world objects
    this.gridHelper = new THREE.GridHelper(200, 200)
    this.axesHelper = new THREE.AxesHelper(10)

    this.canvas = canvas

    // Initial camera position
    // this.canvas.camera.position.z = 10
    // this.canvas.camera.position.y = 10
    // this.canvas.camera.rotation.x = -0.8


    // constructing array of objects which will be scanned by raycaster
    // this.raycastableObjects.push(this.floorObject.mesh)
  }

  addObject(object) {
    this.scene.add(object)
  }
  
  removeObject(object) {
    this.scene.remove(object)
  }

  // initWorld() {
  //   const floorObject = new Floor(200, 200)
  //   const ambientLight = new THREE.AmbientLight(0xFFFFFF, 6)
  //   const dirLight = new THREE.DirectionalLight(0xFFFFFF, 3)
  //   // const controls = new OrbitControls(this.canvas.camera, this.canvas.renderer.domElement)
  //   // const lightHelper = new THREE.CameraHelper(this.dirLight.shadow.camera)
  
  //   // adjusting objects
  //   dirLight.position.set(300, 300, 30)
  //   dirLight.target.position.set(0, 0, 0)
  //   dirLight.castShadow = true
  //   dirLight.shadow.mapSize = new THREE.Vector2(2048, 2048)
  //   dirLight.shadow.camera.top = 130
  //   dirLight.shadow.camera.bottom = -130
  //   dirLight.shadow.camera.left = -130
  //   dirLight.shadow.camera.right = 130

  //   // Placing initial objects in the scene
  //   this.addObject(floorObject.mesh)
    
  //   // Placing light
  //   this.addObject(dirLight)
  //   this.addObject(ambientLight)

  //   this.raycastableObjects.push(floorObject.mesh)
  //   // if (scene.name === "editor"){
  //   //   // constructing array of objects which will be scanned by raycaster
  //   //   this.raycastableObjects.push(floorObject.mesh)
  //   // }
  //   // switch (scene.scene.name) {
  //   //   case "editor":
  //   //     // this.controls.enabled = true;
  //   //     break;

  //   //   case "study":
  //   //     // this.controls.enabled = false;
  //   //     const cube = new Cube("object", 1, 1, 1, 0x5544AA, "Lambert")
  //   //     // console.log(cube);
  //   //     scene.addObject(cube.mesh)
  //   //     break;
  //   // }

  //   // this.initDefaultWorldObjects(scene)
  // }


  // addRaycastableObject(object) {
  //   this.menu.currentScene.addObject(object)
  //   this.raycastableObjects.push(object)
  // }

  // getRaycastableObjectArr() {
  //   return this.raycastableObjects
  // }

  // updatePlaceholderObject(object) {
  //   this.placeholderObject = object
  // }
}