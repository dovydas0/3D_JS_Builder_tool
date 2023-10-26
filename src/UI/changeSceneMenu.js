export const changeSceneMenu = (mode, menuParameterCapture) => {
  const sceneMenu = document.getElementById("scene-outline")
  let html

  switch (mode) {
    case "study":
      html = `
        <p id="scene-title">Scene</p>
        <div class="scene-objects" id="scene-objects">
        </div>
      `
      break;

    case "editor":
      html = `
        <p id="scene-title">Scene</p>
        <div class="scene-objects" id="scene-objects">
        </div>
      `
      break;
    case "play":
      break;
    case "craft":
      break;
    default:
      html = ""
      break;
  }
  sceneMenu.innerHTML = html

  populatingObjects(menuParameterCapture[mode].sceneObjects)
}

const populatingObjects = (savedObjects) => {
  const sceneObjects = document.getElementById('scene-objects')

  savedObjects?.forEach(object => {
    sceneObjects.appendChild(object.cloneNode(true))
  })
}