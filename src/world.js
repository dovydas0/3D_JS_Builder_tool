import * as THREE from 'three'
import { Block } from "./objects/interactive/block"
import { Floor } from './objects/non-interactive/floor'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export class World {
  constructor(sceneObject) {
    // Initializing world objects
    this.buildableObjects = []
    this.sceneObject = sceneObject
    this.blockObject = new Block(null, null, 10, 10, 10, 0x5511AA, "Lambert")
    this.blockObject2 = new Block(5, 5, 10, 2, 5, 0xFF11AA, "Basic")
    this.floorObject = new Floor(500, 500, "Basic")
    this.floorObject.mesh.name = "floor"
    this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
    this.spotLight = new THREE.SpotLight(0xFFFFFF, 1000000, 1000000, Math.PI, 1, 2.5)
    this.controls = new OrbitControls(sceneObject.camera, sceneObject.renderer.domElement)
    // this.controls.enableDamping = true
    // this.controls.dampingFactor = 0.2
    
    this.placeholderBlock = new Block(null, null, 1, 1, 1, 0x5544AA, "Basic", true)
    sceneObject.addObject( this.placeholderBlock.mesh );

    // adjusting objects
    this.spotLight.position.set(0, 100, 0)
    // this.spotLight.castShadow = true
    
    // this.spotLight.shadow.mapSize.width = 1024;
    // this.spotLight.shadow.mapSize.height = 1024;

    // this.spotLight.shadow.camera.near = 500;
    // this.spotLight.shadow.camera.far = 4000;
    // this.spotLight.shadow.camera.fov = 30;
    // this.floorObject.mesh.receiveShadow = true
    // this.spotLight.rotateX(10)
    // this.spotLight.rotation.z

    // Initializing the scene
    sceneObject.initScene()

    // Placing initial objects in the scene
    sceneObject.addObject(this.floorObject.mesh)

    // TEST OBJECTS
    // sceneObject.addObject(this.brickObject.mesh)
    // sceneObject.addObject(this.brickObject2.mesh)

    // constructing array of objects which will be scanned by raycaster
    this.buildableObjects.push(this.floorObject.mesh)

    // Placing light
    sceneObject.addObject(this.spotLight)
    sceneObject.addObject(this.ambientLight)

    // Drawing helpers
    // sceneObject.axesHelper()
    sceneObject.gridHelper(this.floorObject)
    
    
    // Initial camera position
    sceneObject.camera.position.z = 10
    sceneObject.camera.position.y = 10
    sceneObject.camera.rotation.x = -0.8
  }

  addBuildableObject(object) {
    this.sceneObject.addObject(object)
    this.buildableObjects.push(object)
  }

  getBuildableObjectArr() {
    return this.buildableObjects
  }

  update(deltaTime) {
    this.controls.update()
    this.blockObject.update(deltaTime)
  }
}