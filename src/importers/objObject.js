import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OBJExporter } from "three/addons/exporters/OBJExporter.js";

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
      function (gltf) {
        menu.currentWorld.scene.add(gltf.scene);

        // USE scene.traverse TO ADD EVERY MESH INTO THE SCENE

        // console.log(gltf.scene.children[0].children);
        // gltf.scene.children[0].children.forEach((element) => {
        //   element.name = "object-" + element.name;
        //   menu.currentWorld.addRaycastableObject(element);
        //   menu.addToMenuScene(element);
        // });

        if (gltf.asset.generator.toLowerCase().includes("three")) {
          // Add it to the scene
          menu.addToMenuScene(gltf.scene);
          // console.log("three asset");
        }

        if (gltf.asset.generator.toLowerCase().includes("sketchfab")) {
          // Add it to the scene
          // console.log("sketchfab asset");
        }

        // console.log(gltf.animations); // Array<THREE.AnimationClip>
        // console.log(gltf.scene); // THREE.Group
        // console.log(gltf.scenes); // Array<THREE.Group>
        // console.log(gltf.cameras); // Array<THREE.Camera>
        // console.log(gltf.asset); // Object
        // console.log(menu.currentWorld.scene);
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
