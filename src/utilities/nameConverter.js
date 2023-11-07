export function nameConverter(name) {
  const names = {
    BoxGeometry: "cube",
    SphereGeometry: "sphere",
    CylinderGeometry: "cylinder",
    CapsuleGeometry: "capsule",
  };
  return names[name];
}
