import * as THREE from "three";

export class BoxHelper {
  constructor() {
    this.object = null;
    this.name = null;
    this.bbox = null;
  }

  setObject(object) {
    this.bbox = new THREE.BoxHelper(object, 0xffff00);
  }

  removeHelper(menu) {
    menu.currentWorld.scene.children.forEach((object) => {
      if (object.type === "BoxHelper") {
        this.bbox = null;
        menu.currentWorld.removeObject(object);
      }
    });
  }

  update(menu) {
    if (this.bbox && menu.currentMode === "editor") {
      this.bbox.update();
    }
  }
}
