import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";

export class gltf {
  constructor() {
    this.loader = new GLTFLoader();
    this.exporter = new GLTFExporter();
  }

  #save(blob, filename) {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    // URL.revokeObjectURL( url ); breaks Firefox...
  }

  #saveString(text, filename) {
    this.#save(new Blob([text], { type: "text/plain" }), filename);
  }

  exportScene(scene) {
    this.exporter.parse(
      scene,
      // called when the gltf has been generated
      function (result) {
        if (result instanceof ArrayBuffer) {
          saveArrayBuffer(result, "scene.glb");
        } else {
          const output = JSON.stringify(result, null, 2);
          console.log(output);
          this.#saveString(output, "scene.gltf");
        }
      },
      // called when there is an error in the generation
      function (error) {
        console.log("An error happened");
      }
    );
  }

  importObject(path, menu) {
    this.loader.load(
      path,
      // called when the resource is loaded
      function (gltf) {
        menu.currentWorld.scene.add(gltf.scene);

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
}
