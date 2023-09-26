import * as THREE from 'three'
import { Brick } from "./objects/interactive/brick"
import { Floor } from './objects/non-interactive/floor'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export class World {
  constructor(sceneObject) {
    // Initializing world objects
    this.sceneObject = sceneObject
    this.brickObject = new Brick(null, null, 5, 5, 5, 0x5511AA, "Lambert")
    this.floorObject = new Floor(200, 200, "Lambert")
    this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
    this.spotLight = new THREE.SpotLight(0xFFFFFF, 10000000, 1000000, Math.PI / 4, 1, 3.6)
    this.controls = new OrbitControls(sceneObject.camera, sceneObject.renderer.domElement)
    // this.controls.enableDamping = true
    // this.controls.dampingFactor = 0.2

    // adjusting objects
    this.spotLight.translateY(100)

    // Initializing the scene
    sceneObject.initScene()

    // Placing initial objects in the scene
    sceneObject.addObject(this.floorObject.mesh)
    // sceneObject.addObject(this.brickObject.mesh)

    // Placing light
    sceneObject.addObject(this.spotLight)
    sceneObject.addObject(this.ambientLight)

    // Drawing helpers
    sceneObject.axesHelper()
    sceneObject.gridHelper(this.floorObject)
    
    // Initial camera position
    sceneObject.camera.position.z = 10
    sceneObject.camera.position.y = 10
    sceneObject.camera.rotation.x = -0.8
  }

  update(deltaTime) {
    this.controls.update()
    this.brickObject.update(deltaTime)
  }
}