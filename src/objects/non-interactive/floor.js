import * as THREE from 'three';
import { Entity } from '../entity';

export class Floor extends Entity {
  constructor(width = 500, height = 500, material = "Standard", color = 0xA0A0A0) {
    super(null, null, width, null, height, null, null, null, null, null, color)
    
    const threeMaterial = {
      Standard: THREE.MeshStandardMaterial,
      Basic: THREE.MeshBasicMaterial,
      Phong: THREE.MeshPhongMaterial,
      Lambert: THREE.MeshLambertMaterial
    }
    const finalMaterial = threeMaterial[material]

    this.width = width;
    this.height = height;
    this.color = color;
    this.geometry = new THREE.PlaneGeometry(width, height);
    this.material = new finalMaterial({ color: color, side: THREE.DoubleSide });

    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.rotation.x = -Math.PI  / 2
    this.mesh.castShadow = false
    this.mesh.receiveShadow = true
  }
}