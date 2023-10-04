import * as THREE from 'three';
import { Entity } from '../entity';

/**
 * Represents a Sphere object.
 */
export class Sphere extends Entity {
  /**
   * Create a Sphere object.
   * @param {"floor" | "object"} name - The label of the sphere.
   * @param {number} radius - The radius of the sphere.
   * @param {number} [color=0xff0000] - The color of the sphere.
   * @param {"Basic" | "Phong" | "Lambert"} [material="Basic"] - The material type for the sphere.
   * @param {number} segmentsWidth - The number of segments (cuts) throughout the width of the sphere.
   * @param {number} segmentsheight - The number of segments (cuts) throughout the height of the sphere.
   */
  constructor(
    name,
    radius = 1,
    color = 0xff0000,
    material = "Basic",
    placeholderObj = false,
    segmentsWidth = 32,
    segmentsheight = 16,
  ) {
    super(null, null, null, radius, null, null, null, segmentsWidth, null, segmentsheight, color )
    this.materialProperties

    const threeMaterial = {
      Basic: THREE.MeshBasicMaterial,
      Phong: THREE.MeshPhongMaterial,
      Lambert: THREE.MeshLambertMaterial
    }
    const finalMaterial = threeMaterial[material]

    // placeholderObj ? 
    //   this.materialProperties = { color: color, opacity: 0.5, transparent: true }
    //   : 
    //   this.materialProperties = { color: color }
    
    this.geometry = new THREE.SphereGeometry(4);
    this.material = new THREE.MeshBasicMaterial({ color: 0x5544AA })
    // this.geometry = new THREE.SphereGeometry(radius, segmentsWidth, segmentsheight);
    // this.material = new finalMaterial(this.materialProperties);
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.name = name
    // this.mesh.position.set(new THREE.Vector3(0, 0, 0))
    
    if (!placeholderObj) {
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
    }
  }

  update(deltaTime) {
      this.mesh.rotation.x += 0.6 * deltaTime
      this.mesh.rotation.y += 0.6 * deltaTime
  }
}