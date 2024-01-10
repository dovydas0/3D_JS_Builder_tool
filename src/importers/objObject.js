import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OBJExporter } from "three/addons/exporters/OBJExporter.js";
import * as THREE from "three";

export class objObject {
  constructor() {
    this.loader = new OBJLoader();
    this.exporter = new OBJExporter();
  }

  exportScene(scene) {
    const data = this.exporter.parse(scene);
    this.#downloadFile(data);
  }

  importObject(path, menu) {
    this.loader.load(
      path,
      // called when the resource is loaded
      function (obj) {
        const group = new THREE.Group();
        group.name = "group-import";

        obj.children.forEach((element) => {
          const object = element.clone();
          if (!object.name.includes("object")) {
            object.name = "object-" + object.name;
          }
          group.add(object);
        });

        menu.currentWorld.addObject(group);
        menu.addObjectFully(group);
      },
      // called while loading is progressing
      function (xhr) {
        // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log(error);
      }
    );
  }

  #downloadFile(data, filename = "export.obj") {
    const blob = new Blob([data], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}
