import * as THREE from 'three';
import { Entity } from '../entity';

/**
 * Represents a Sphere object.
 */
export class Cylinder extends Entity {
  /**
   * Create a Cylinder object.
   * @param {"floor" | "object"} name - The label of the cylinder.
   * @param {number} radius - The radius of the cylinder.
   * @param {number} [color=0xff0000] - The color of the cylinder.
   * @param {"Basic" | "Phong" | "Lambert"} [material="Basic"] - The material type for the cylinder.
   * @param {number} segmentsWidth - The number of segments (cuts) throughout the width of the cylinder.
   * @param {number} segmentsheight - The number of segments (cuts) throughout the height of the cylinder.
   */
  constructor(
    name,
    radiusTop = 1,
    radiusBottom = 1,
    height = 1,
    color = 0xff0000,
    material = "Basic",
    placeholderObj = false,
    radialSegments  = 32,
    heightSegments  = 16,
  ) {
    super(null, null, height, null, radiusTop, radiusBottom, null, null, null, null, color )
    this.materialProperties

    const threeMaterial = {
      Basic: THREE.MeshBasicMaterial,
      Phong: THREE.MeshPhongMaterial,
      Lambert: THREE.MeshLambertMaterial
    }
    const finalMaterial = threeMaterial[material]

    placeholderObj ? 
      this.materialProperties = { color: color, opacity: 0.5, transparent: true }
      : 
      this.materialProperties = { color: color }
    
    this.geometry = new THREE.CylinderGeometry();
    this.material = new THREE.MeshBasicMaterial()
    this.material = new finalMaterial(this.materialProperties);
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