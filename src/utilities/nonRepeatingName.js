export const nonRepeatingName = (name, menu, sceneObjects) => {
  let nameRepetitions = -1;

  // cunstruction of non-repeating name
  for (const object of menu.currentWorld.scene.children) {
    if (object.name === name) {
      nameRepetitions += 1;
    }
  }
  for (const obj of sceneObjects.children) {
    if (obj.dataset.obj === name + nameRepetitions) {
      nameRepetitions += 1;
    }
  }

  // Assigning number next to name if identical name already exists
  if (nameRepetitions > 0) {
    return (name += nameRepetitions);
  }
  return name;
};
