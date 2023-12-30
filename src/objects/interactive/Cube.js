import * as THREE from "three";
import { Entity } from "../entity";

/**
 * Represents a Cube object.
 */
export class Cube extends Entity {
  /**
   * Create a Cube object.
   * @param {number} width - The width of the cube.
   * @param {number} depth - The depth of the cube.
   * @param {number} [height=1] - The height of the cube.
   * @param {number} [color=0xff0000] - The color of the cube.
   * @param {"Basic" | "Phong" | "Lambert"} [material="Basic"] - The material type for the cube.
   */
  constructor(
    name,
    width,
    depth,
    height = 1,
    color = 0xff0000,
    material = "Basic",
    placeholderObj = false,
    segmentsWidth = 1,
    segmentsDepth = 1,
    segmentsHeight = 1,
    scale,
    rotation
  ) {
    super(
      width,
      depth,
      height,
      null,
      null,
      segmentsWidth,
      segmentsDepth,
      segmentsHeight,
      color
    );
    this.materialProperties;

    const texture = new THREE.TextureLoader().load("/texture1.jpg");

    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set( 4, 4 );

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

    this.geometry = new THREE.BoxGeometry(
      width + 0.00006,
      depth + 0.00006,
      height + 0.00006
    );
    this.material = new finalMaterial(this.materialProperties);
    // this.material.color.get
    // this.material.map = texture
    // console.log(this.material);

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
