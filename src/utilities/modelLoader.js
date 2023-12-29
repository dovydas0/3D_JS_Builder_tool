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
          object.segmentsHeight
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
          object.segmentsHeight
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
          object.openEnded
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
          object.radialSegments
        );
        break;
    }
    newObject.mesh.position.copy(object.position);

    menu.currentWorld.addRaycastableObject(newObject.mesh);
    menu.addToMenuScene(newObject.mesh);
  });
};
