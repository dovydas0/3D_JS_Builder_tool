import * as THREE from 'three';

export class Floor {
  constructor(width, depth, height = 1, color = 0xff0000, material = "Basic") {
    const threeMaterial = {
      Basic: THREE.MeshBasicMaterial,
      Phong: THREE.MeshPhongMaterial,
      Lambert: THREE.MeshLambertMaterial
    }
    const finalMaterial = threeMaterial[material]
    
    this.width = width;
    this.depth = depth;
    this.height = height;
    this.color = color;
    this.geometry = new THREE.BoxGeometry( width, height, depth );
    this.material = new finalMaterial({ color });

    this.brick = new THREE.Mesh( this.geometry, this.material );
  }

  addObject(scene) {
    scene.add( this.brick );
  }

  rotate(x, y, speed) {
    this.brick.rotation.x += x
    this.brick.rotation.y += y
  }
}