import * as THREE from "three";
import { Entity } from "../entity";

/**
 * Represents a Capsule object.
 */
export class Capsule extends Entity {
  /**
   * Create a capsule object.
   * @param {"floor" | "object"} name - The label of the capsule.
   * @param {number} radius - The radius of the capsule.
   * @param {number} length - The length of the capsule.
   * @param {number} [color=0xff0000] - The color of the capsule.
   * @param {"Basic" | "Phong" | "Lambert"} [material="Basic"] - The material type for the capsule.
   * @param {number} capSegments - The number of segments (cuts) throughout the ends of the capsule.
   * @param {number} radialSegments - The number of segments (cuts) throughout the height of the capsule.
   */
  constructor(
    name,
    radius = 1,
    length = 2,
    color = 0xff0000,
    material = "Basic",
    placeholderObj = false,
    capSegments = 5,
    radialSegments = 12,
    scale,
    rotation
  ) {
    super(null, null, null, radius, null, null, null, null, null, null, color);
    this.materialProperties;

    const threeMaterial = {
      Basic: THREE.MeshBasicMaterial,
      Phong: THREE.MeshPhongMaterial,
      Lambert: THREE.MeshLambertMaterial,
    };
    const finalMaterial = threeMaterial[material];

    placeholderObj
      ? (this.materialProperties = {
          color: color,
          opacity: 0.2,
          transparent: true,
          side: THREE.DoubleSide,
        })
      : (this.materialProperties = { color: color, side: THREE.DoubleSide });

    this.geometry = new THREE.CapsuleGeometry(
      radius,
      length,
      capSegments < 1 ? 1 : capSegments,
      radialSegments < 3 ? 3 : radialSegments
    );
    this.material = new finalMaterial(this.materialProperties);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = name;

    if (scale) {
      this.mesh.scale.set(scale.x, scale.y, scale.z);
    }

    if (rotation) {
      this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    }

    if (!placeholderObj) {
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
    }
  }

  update(deltaTime) {
    this.mesh.rotation.x += 0.6 * deltaTime;
    this.mesh.rotation.y += 0.6 * deltaTime;
  }
}
