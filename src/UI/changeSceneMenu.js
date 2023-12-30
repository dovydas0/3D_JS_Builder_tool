export const changeSceneMenu = (mode, menuParameterCapture) => {
  const sceneMenu = document.getElementById("scene-outline");
  let html;

  console.log();

  switch (mode) {
    case "study":
      html = `
        <div class="scene-header" id="scene-header">
          <p id="scene-title">Scene</p>
        </div>
        <div class="scene-objects" id="scene-objects"></div>
      `;
      break;

    case "editor":
      html = `
        <div class="scene-header" id="scene-header">
          <p id="scene-title">Scene</p>
        </div>
        <div class="scene-objects" id="scene-objects"></div>
      `;
      break;
    case "play":
      break;
    case "craft":
      break;
    default:
      html = "";
      break;
  }
  sceneMenu.innerHTML = html;

  populatingObjects(menuParameterCapture[mode].sceneObjects);
};

const populatingObjects = (savedObjects) => {
  const sceneObjects = document.getElementById("scene-objects");

  savedObjects?.forEach((object) => {
    object.classList = "";
    sceneObjects.appendChild(object.cloneNode(true));
  });
};
