import * as THREE from 'three';
import { Entity } from '../entity';

export class Floor extends Entity {
  constructor(width = 500, height = 500, material = "Basic", color = 0xFFFFFF) {
    super(null, null, width, null, height, null, null, null, null, null, color)
    
    const threeMaterial = {
      Basic: THREE.MeshBasicMaterial,
      Phong: THREE.MeshPhongMaterial,
      Lambert: THREE.MeshLambertMaterial
    }
    const finalMaterial = threeMaterial[material]

    this.width = width;
    this.height = height;
    this.color = color;
    this.geometry = new THREE.PlaneGeometry(width, height);
    this.material = new finalMaterial({ color: color, side: THREE.FrontSide });

    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.rotation.x = -Math.PI  / 2
  }
}