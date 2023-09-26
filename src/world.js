import * as THREE from 'three'
import { Brick } from "./objects/interactive/brick"

export class World {
  constructor(sceneObject) {
    this.brickObject = new Brick(null, null, 1, 1, 1, 0x5511AA, "Lambert")
    this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
    this.spotLight = new THREE.SpotLight(0xFFFFFF, 5, 1000, Math.PI)
    this.sceneObject = sceneObject

    sceneObject.initScene()
    sceneObject.addObject(this.brickObject.brick)
    sceneObject.addObject(this.spotLight)
    sceneObject.addObject(this.ambientLight)
    sceneObject.axesHelper()
    
    sceneObject.camera.position.z = 5
    sceneObject.camera.position.x = 1
    sceneObject.camera.position.y = 1
    sceneObject.camera.rotation.x = -0.2
    // sceneObject.camera.rotation.z = -0.4
    // sceneObject.camera.rotation.y = 0.4
  }

  update(deltaTime) {
    this.brickObject.update(deltaTime)
  }
}