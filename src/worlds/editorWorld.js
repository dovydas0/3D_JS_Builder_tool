import * as THREE from "three";
import { Floor } from "../objects/non-interactive/floor";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { World } from "./world";

export class EditorWorld extends World {
  constructor(canvas, placeholderObject) {
    super(canvas);
    this.raycastableObjects = [];
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    this.scene.name = "editor";

    this.controls = new OrbitControls(
      this.camera,
      this.canvas.renderer.domElement
    );
    this.placeholderObject = placeholderObject;

    // this.addObject(this.placeholderObject.mesh)
    // this.placeholderObject.mesh.visible = false
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;

    this.camera.position.z = 10;
    this.camera.position.y = 10;
    this.camera.rotation.x = -0.8;
  }

  initWorld() {
    const floorObject = new Floor(200, 200);
    const ambientLight = new THREE.AmbientLight(0xffffff, 5);
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);

    // naming default objects in the scene
    floorObject.mesh.name = "void-obj-floor";
    ambientLight.name = "void-obj-ambient-light";
    dirLight.name = "void-obj-directional-light";

    // adjusting objects
    dirLight.position.set(300, 300, 30);
    dirLight.target.position.set(0, 0, 0);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    dirLight.shadow.camera.top = 130;
    dirLight.shadow.camera.bottom = -130;
    dirLight.shadow.camera.left = -130;
    dirLight.shadow.camera.right = 130;

    // Placing initial objects in the scene
    this.addObject(floorObject.mesh);
    this.addObject(this.placeholderObject.mesh);

    // Placing light
    this.addObject(dirLight);
    this.addObject(ambientLight);

    this.raycastableObjects.push(floorObject.mesh);
  }

  addRaycastableObject(object) {
    this.addObject(object);
    this.raycastableObjects.push(object);
  }

  getRaycastableObjectArr() {
    return this.raycastableObjects;
  }

  updatePlaceholderObject(object) {
    this.placeholderObject = object;
  }

  updateControls() {
    this.controls.update();
  }
}
