import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";

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
      async function (gltf) {
        console.log(gltf.scene);
        menu.currentWorld.scene.add(gltf.scene);

        // menu.addObjectFully(gltf.scene.children[0]);
        // menu.addObjectFully(gltf.scene.children[1]);
        // menu.addObjectFully(gltf.scene.children[2]);
        // console.log(gltf.scene.children[2]);

        // for (const element of gltf.scene.children) {
        //   if (element.type.toLowerCase() === "mesh") {
        //     // if (!element.name?.toLowerCase()?.includes("object-")) {
        //     //   element.name = "object-" + element.name;
        //     // }
        //     console.log("ZZZZZ", element);

        //     menu.addObjectFully(element);
        //   }
        // }
        gltf.scene.children.forEach((element) => {
          if (element.type.toLowerCase() === "mesh") {
            menu.currentWorld.raycastableObjects.push(element);
          }
        });

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
