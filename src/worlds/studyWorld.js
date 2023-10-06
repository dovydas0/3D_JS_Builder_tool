import * as THREE from 'three'
import { Floor } from '../objects/non-interactive/floor'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Cube } from '../objects/interactive/Cube'
import { World } from './world'

export class StudyWorld extends World {
  constructor(canvas) {
    super(canvas)
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.controls = new OrbitControls(this.camera, canvas.renderer.domElement)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x2020f0 );
    this.scene.name = "study"
    this.studyObject = new Cube("object", 1, 1, 1, 0x5544AA, "Lambert")

    // constructing array of objects which will be scanned by raycaster
    // this.raycastableObjects.push(this.floorObject.mesh)
  }

  initWorld(world, menu, canvas) {
    const floorObject = new Floor(200, 200)
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 6)
    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 3)
    // const lightHelper = new THREE.CameraHelper(this.dirLight.shadow.camera)
  
    
    // adjusting objects
    dirLight.position.set(300, 300, 30)
    dirLight.target.position.set(0, 0, 0)
    dirLight.castShadow = true
    dirLight.shadow.mapSize = new THREE.Vector2(2048, 2048)
    dirLight.shadow.camera.top = 130
    dirLight.shadow.camera.bottom = -130
    dirLight.shadow.camera.left = -130
    dirLight.shadow.camera.right = 130
    
    this.studyObject.mesh.position.setScalar(0.5)
    this.controls.enabled = false
    this.controls.autoRotate = false
    this.camera.position.set(0, 10, 10)
    this.camera.rotation.set(-0.8, 0, 0)

    // Placing initial objects in the scene
    world.addObject(floorObject.mesh)
    
    // Placing light
    world.addObject(dirLight)
    world.addObject(ambientLight)

    // Placing objects
    world.addObject(this.studyObject.mesh)
  }

  // initDefaultWorldObjects(scene) {
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
  //   scene.addObject(floorObject.mesh)
  //   scene.addObject(this.placeholderObject.mesh)
    
  //   // Placing light
  //   scene.addObject(dirLight)
  //   scene.addObject(ambientLight)

  //   if (scene.scene.name === "editor"){
  //     // constructing array of objects which will be scanned by raycaster
  //     this.raycastableObjects.push(floorObject.mesh)
  //   }
  // }

  // addRaycastableObject(object) {
  //   this.menu.currentScene.addObject(object)
  //   this.raycastableObjects.push(object)
  // }

  // getRaycastableObjectArr() {
  //   return this.raycastableObjects
  // }

  updateStudyObject(object) {
    this.studyObject = object
  }

  update() {
    this.controls.update()
  }

}