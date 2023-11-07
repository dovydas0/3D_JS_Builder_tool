import * as THREE from "three";

export class Canvas {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    // Renderer config
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // this.renderer.shadowMap.type = THREE.BasicShadowMap;
    // this.renderer.shadowMap.type = THREE.VSMShadowMap;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    document.body.appendChild(this.renderer.domElement);
  }
}
