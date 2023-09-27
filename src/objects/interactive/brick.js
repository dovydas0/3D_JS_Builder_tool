import * as THREE from 'three';
import { Entity } from '../entity';

/**
 * Represents a Brick object.
 */
export class Brick extends Entity {
  /**
   * Create a Brick object.
   * @param {number} width - The width of the brick.
   * @param {number} depth - The depth of the brick.
   * @param {number} [height=1] - The height of the brick.
   * @param {number} [color=0xff0000] - The color of the brick.
   * @param {"Basic" | "Phong" | "Lambert"} [material="Basic"] - The material type for the brick.
   */
  constructor(
    x = 0,
    y = 0,
    width,
    depth,
    height = 1,
    color = 0xff0000,
    material = "Basic",
    segmentsWidth = 1,
    segmentsDepth = 1,
    segmentsheight = 1,
  ) {
    super(x, y, width, depth, height, null, null, segmentsWidth, segmentsDepth, segmentsheight, color )
    
    const threeMaterial = {
      Basic: THREE.MeshBasicMaterial,
      Phong: THREE.MeshPhongMaterial,
      Lambert: THREE.MeshLambertMaterial
    }
    const finalMaterial = threeMaterial[material]
    
    this.geometry = new THREE.BoxGeometry( width, height, depth );
    this.material = new finalMaterial({ color });
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.meshHelper = new THREE.BoxHelper(this.mesh, 0xffff00)
    
    this.mesh.translateX(x)
    this.mesh.translateY(y)
  }

  update(deltaTime) {
      this.mesh.rotation.x += 0.6 * deltaTime
      this.mesh.rotation.y += 0.6 * deltaTime
  }
}