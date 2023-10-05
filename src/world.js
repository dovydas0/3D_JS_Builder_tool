import * as THREE from 'three'
import { Floor } from './objects/non-interactive/floor'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Cube } from './objects/interactive/Cube'

export class World {
  constructor(canvas, menu) {
    // Initializing world objects
    this.raycastableObjects = []
    this.menu = menu
    this.placeholderObject = menu.currentObject
    this.canvas = canvas
    this.controls = new OrbitControls(this.canvas.camera, this.canvas.renderer.domElement)

    // this.controls.

    // this.floorObject = new Floor(200, 200)
    // this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 6)
    // this.dirLight = new THREE.DirectionalLight(0xFFFFFF, 3)
    // this.controls = new OrbitControls(canvas.camera, canvas.renderer.domElement)
    // this.lightHelper = new THREE.CameraHelper(this.dirLight.shadow.camera)
    
    // EXAMPLE OBJECTS
    // this.blockObject = new Block(null, null, 10, 10, 10, 0x5511AA, "Lambert")
    // this.blockObject2 = new Block(5, 5, 10, 2, 5, 0xFF11AA, "Basic")
    // sceneObject.addObject(this.blockObject.mesh)
    // sceneObject.addObject(this.blockObject2.mesh)

    // adjusting objects
    // this.dirLight.position.set(300, 300, 30)
    // this.dirLight.target.position.set(0, 0, 0)
    // this.dirLight.castShadow = true
    // this.dirLight.shadow.mapSize = new THREE.Vector2(2048, 2048)
    // this.dirLight.shadow.camera.top = 130
    // this.dirLight.shadow.camera.bottom = -130
    // this.dirLight.shadow.camera.left = -130
    // this.dirLight.shadow.camera.right = 130

    // this.placeholderBlock.mesh.visible = false
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.2

    // Initial camera position
    this.canvas.camera.position.z = 10
    this.canvas.camera.position.y = 10
    this.canvas.camera.rotation.x = -0.8

    this.controls.enabled = false;

    // constructing array of objects which will be scanned by raycaster
    // this.raycastableObjects.push(this.floorObject.mesh)
  }

  initWorld(scene) {
    console.log(this.controls.enabled);
    switch (scene.scene.name) {
      case "editor":
        // this.controls.enabled = true;
        break;

      case "study":
        // this.controls.enabled = false;
        const cube = new Cube("object", 1, 1, 1, 0x5544AA, "Lambert")
        // console.log(cube);
        scene.addObject(cube.mesh)
        break;
    }

    this.initDefaultWorldObjects(scene)
  }

  initDefaultWorldObjects(scene) {
    const floorObject = new Floor(200, 200)
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 6)
    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 3)
    // const controls = new OrbitControls(this.canvas.camera, this.canvas.renderer.domElement)
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

    // Placing initial objects in the scene
    scene.addObject(floorObject.mesh)
    scene.addObject(this.placeholderObject.mesh)
    
    // Placing light
    scene.addObject(dirLight)
    scene.addObject(ambientLight)

    if (scene.scene.name === "editor"){
      // constructing array of objects which will be scanned by raycaster
      this.raycastableObjects.push(floorObject.mesh)
    }
  }

  addRaycastableObject(object) {
    this.menu.currentScene.addObject(object)
    this.raycastableObjects.push(object)
  }

  getRaycastableObjectArr() {
    return this.raycastableObjects
  }

  updatePlaceholderObject(object) {
    this.placeholderObject = object
  }

  updateControls(deltaTime) {
    this.controls.update()
  }
}