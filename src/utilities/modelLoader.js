import { Capsule } from "../objects/interactive/Capsule";
import { Cube } from "../objects/interactive/Cube";
import { Cylinder } from "../objects/interactive/Cylinder";
import { Sphere } from "../objects/interactive/Sphere";

export const modelLoader = (data, menu) => {
  data.forEach((object) => {
    let newObject;
    switch (object.geometry) {
      case "BoxGeometry":
        newObject = new Cube(
          object.name,
          object.width,
          object.height,
          object.depth,
          object.color,
          object.material,
          object.placeholderObj,
          object.segmentsWidth,
          object.segmentsDepth,
          object.segmentsHeight,
          object.scale,
          object.rotation
        );
        break;
      case "SphereGeometry":
        newObject = new Sphere(
          object.name,
          object.radius,
          object.color,
          object.material,
          object.placeholderObj,
          object.segmentsWidth,
          object.segmentsHeight,
          object.scale,
          object.rotation
        );
        break;
      case "CylinderGeometry":
        newObject = new Cylinder(
          object.name,
          object.radiusTop,
          object.radiusBottom,
          object.height,
          object.color,
          object.material,
          object.placeholderObj,
          object.radialSegments,
          object.openEnded,
          object.scale,
          object.rotation
        );
        break;
      case "CapsuleGeometry":
        newObject = new Capsule(
          object.name,
          object.radius,
          object.length,
          object.color,
          object.material,
          object.placeholderObj,
          object.capSegments,
          object.radialSegments,
          object.scale,
          object.rotation
        );
        break;
    }
    newObject.mesh.position.copy(object.position);

    menu.currentWorld.addRaycastableObject(newObject.mesh);
    menu.addToMenuScene(newObject.mesh);
  });
};

export const modelSaver = (data) => {
  return data.map((object) => {
    switch (object.geometry.type) {
      case "BoxGeometry":
        return {
          uuid: object.uuid,
          geometry: object.geometry.type,
          name: object.name,
          width: object.geometry.parameters.width,
          depth: object.geometry.parameters.depth,
          height: object.geometry.parameters.height,
          color: object.material?.color?.getHex(),
          material: "Lambert",
          placeholderObj: false,
          segmentsWidth: object.geometry.parameters.widthSegments,
          segmentsDepth: object.geometry.parameters.depthSegments,
          segmentsHeight: object.geometry.parameters.heightSegments,
          position: object.position,
          scale: object.scale,
          rotation: {
            x: object.rotation._x,
            y: object.rotation._y,
            z: object.rotation._z,
          },
        };
      case "SphereGeometry":
        return {
          uuid: object.uuid,
          geometry: object.geometry.type,
          name: object.name,
          radius: object.geometry.parameters.radius,
          color: object.material?.color?.getHex(),
          material: "Lambert",
          placeholderObj: false,
          segmentsWidth: object.geometry.parameters.widthSegments,
          segmentsheight: object.geometry.parameters.heightSegments,
          position: object.position,
          scale: object.scale,
          rotation: {
            x: object.rotation._x,
            y: object.rotation._y,
            z: object.rotation._z,
          },
        };
      case "CylinderGeometry":
        return {
          uuid: object.uuid,
          geometry: object.geometry.type,
          name: object.name,
          radiusTop: object.geometry.parameters.radiusTop,
          radiusBottom: object.geometry.parameters.radiusBottom,
          height: object.geometry.parameters.height,
          color: object.material?.color?.getHex(),
          material: "Lambert",
          placeholderObj: false,
          radialSegments: object.geometry.parameters.radialSegments,
          openEnded: object.geometry.parameters.openEnded,
          position: object.position,
          scale: object.scale,
          rotation: {
            x: object.rotation._x,
            y: object.rotation._y,
            z: object.rotation._z,
          },
        };
      case "CapsuleGeometry":
        return {
          uuid: object.uuid,
          geometry: object.geometry.type,
          name: object.name,
          radius: object.geometry.parameters.radius,
          length: object.geometry.parameters.length,
          color: object.material?.color?.getHex(),
          material: "Lambert",
          placeholderObj: false,
          capSegments: object.geometry.parameters.capSegments,
          radialSegments: object.geometry.parameters.radialSegments,
          position: object.position,
          scale: object.scale,
          rotation: {
            x: object.rotation._x,
            y: object.rotation._y,
            z: object.rotation._z,
          },
        };
    }
  });
};
