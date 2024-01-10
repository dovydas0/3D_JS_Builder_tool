import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import * as THREE from "three";

export class gltfObject {
  constructor() {
    this.loader = new GLTFLoader();
    this.exporter = new GLTFExporter();
  }

  exportScene(scene, filename = "scene") {
    this.exporter.parse(
      scene,
      // called when the gltf has been generated
      function (result) {
        if (result instanceof ArrayBuffer) {
          saveArrayBuffer(result, "scene.glb");
        } else {
          const output = JSON.stringify(result, null, 2);

          const blob = new Blob(
            [output],
            { type: "text/plain" },
            `${filename}.gltf`
          );

          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${filename}.gltf`;
          link.click();
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
        console.log(gltf);
        const group = new THREE.Group();
        group.name = "group-import";

        // Grabbing only objects from the whole scene and adding to the group
        gltf.scene.traverse((object) => {
          // Traversing the scene
          // Checking if the object is of type mesh
          if (object instanceof THREE.Mesh) {
            // cloning the object otherwise the addition to scene doesn't work
            const newObj = object.clone();

            // If object's name already doesn't include "object" string, adding it
            if (!newObj.name.includes("object")) {
              newObj.name = "object-" + newObj.name;
            }

            // Adding object to the group
            group.add(newObj);
          }
        });

        // Adding group to the world and menu UI
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
}
