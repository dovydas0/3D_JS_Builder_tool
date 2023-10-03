import * as THREE from 'three'
import { Block } from "./objects/interactive/block"
import { Floor } from './objects/non-interactive/floor'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export class World {
  constructor(sceneObject, menu) {
    // Initializing world objects
    this.raycastableObjects = []
    this.sceneObject = sceneObject
    this.menu = menu
    this.placeholderBlock = menu.currentBlock
    this.floorObject = new Floor(200, 200)
    this.floorObject.mesh.name = "floor"
    this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 6)
    this.dirLight = new THREE.DirectionalLight(0xFFFFFF, 3)
    this.controls = new OrbitControls(sceneObject.camera, sceneObject.renderer.domElement)
    this.lightHelper = new THREE.CameraHelper(this.dirLight.shadow.camera)
    
    // EXAMPLE OBJECTS
    // this.blockObject = new Block(null, null, 10, 10, 10, 0x5511AA, "Lambert")
    // this.blockObject2 = new Block(5, 5, 10, 2, 5, 0xFF11AA, "Basic")
    // sceneObject.addObject(this.blockObject.mesh)
    // sceneObject.addObject(this.blockObject2.mesh)

    // adjusting objects
    this.dirLight.position.set(300, 300, 30)
    this.dirLight.target.position.set(0, 0, 0)
    this.dirLight.castShadow = true
    this.dirLight.shadow.mapSize = new THREE.Vector2(2048, 2048)
    this.dirLight.shadow.camera.top = 130
    this.dirLight.shadow.camera.bottom = -130
    this.dirLight.shadow.camera.left = -130
    this.dirLight.shadow.camera.right = 130
    this.placeholderBlock.mesh.visible = false
    // this.controls.enableDamping = true
    // this.controls.dampingFactor = 0.2

    // Initial camera position
    sceneObject.camera.position.z = 10
    sceneObject.camera.position.y = 10
    sceneObject.camera.rotation.x = -0.8

    // Initializing the scene
    sceneObject.initScene()

    // Placing initial objects in the scene
    sceneObject.addObject(this.floorObject.mesh)
    sceneObject.addObject(this.placeholderBlock.mesh)
    
    // Placing light
    sceneObject.addObject(this.dirLight)
    sceneObject.addObject(this.ambientLight)

    // constructing array of objects which will be scanned by raycaster
    this.raycastableObjects.push(this.floorObject.mesh)
  }

  addRaycastableObject(object) {
    this.sceneObject.addObject(object)
    this.raycastableObjects.push(object)
  }

  getRaycastableObjectArr() {
    return this.raycastableObjects
  }

  updatePlaceholderBlock(block) {
    this.placeholderBlock = block
  }

  update(deltaTime) {
    this.controls.update()
    // this.blockObject.update(deltaTime)
  }
}