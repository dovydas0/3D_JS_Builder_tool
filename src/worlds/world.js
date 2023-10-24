import * as THREE from 'three'
import { Floor } from '../objects/non-interactive/floor'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Cube } from '../objects/interactive/Cube'

export class World {
  constructor(canvas) {
    // Initializing world objects
    this.gridHelper = new THREE.GridHelper(200, 200)
    this.axesHelper = new THREE.AxesHelper(10)

    // naming helpers appropriately
    this.gridHelper.name = "void-obj-grid-helper"
    this.axesHelper.name = "void-obj-axes-helper"

    this.canvas = canvas

    // constructing array of objects which will be scanned by raycaster
    // this.raycastableObjects.push(this.floorObject.mesh)
  }

  addObject(object) {
    this.scene.add(object)
  }
  
  removeObject(object) {
    this.scene.remove(object)
  }


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