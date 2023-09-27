import * as THREE from 'three'
import { Brick } from "./objects/interactive/brick"
import { Floor } from './objects/non-interactive/floor'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export class World {
  constructor(sceneObject) {
    // Initializing world objects
    this.buildableObjects = []
    this.sceneObject = sceneObject
    this.brickObject = new Brick(null, null, 10, 10, 10, 0x5511AA, "Lambert")
    this.brickObject2 = new Brick(5, 5, 10, 2, 5, 0xFF11AA, "Basic")
    this.floorObject = new Floor(500, 500, "Lambert")
    this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
    this.spotLight = new THREE.SpotLight(0xFFFFFF, 10000000, 1000000, Math.PI / 4, 1, 3.6)
    this.controls = new OrbitControls(sceneObject.camera, sceneObject.renderer.domElement)
    // this.controls.enableDamping = true
    // this.controls.dampingFactor = 0.2
    
    const rollOverGeo = new THREE.BoxGeometry( 1, 1, 1 );
    this.rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0x5544AA, opacity: 0.5, transparent: true } );
    this.rollOverMesh = new THREE.Mesh( rollOverGeo, this.rollOverMaterial );
    this.rollOverMesh.position.addScalar(0.5)
    sceneObject.addObject( this.rollOverMesh );

    // adjusting objects
    this.spotLight.translateY(100)

    // Initializing the scene
    sceneObject.initScene()

    // Placing initial objects in the scene
    sceneObject.addObject(this.floorObject.mesh)
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
    this.buildableObjects.push(object)
  }

  update(deltaTime) {
    this.controls.update()
    this.brickObject.update(deltaTime)
  }
}