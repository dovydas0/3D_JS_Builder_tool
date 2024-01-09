import * as THREE from "three";
import { Entity } from "../entity";

/**
 * Represents a Cylinder object.
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
    radialSegments = 16,
    openEnded = false,
    scale,
    rotation
  ) {
    super(
      null,
      null,
      height,
      null,
      radiusTop,
      radiusBottom,
      null,
      null,
      null,
      null,
      color
    );
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

    this.geometry = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      radialSegments < 3 ? 3 : radialSegments,
      1,
      openEnded
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
