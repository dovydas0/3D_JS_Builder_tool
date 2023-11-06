export function nameConverter(name) {
  const names = {
    BoxGeometry: "cube",
    SphereGeometry: "sphere",
    CylinderGeometry: "cylinder",
  };
  return names[name];
}
