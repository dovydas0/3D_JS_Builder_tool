export function nameConverter(name) {
  const names = {
    BoxGeometry: "cube",
    SphereGeometry: "sphere",
    BufferGeometry: "buffer",
    CylinderGeometry: "cylinder",
    CapsuleGeometry: "capsule",
  };
  return names[name];
}
