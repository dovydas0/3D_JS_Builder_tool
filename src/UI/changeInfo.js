export const changeInfo = (mode) => {
  let html
  const infoWindow = document.getElementById('info-window')

  switch (mode) {
    case "study":
      html = `
      <div class="info-header">
        <div class="info-title-div">
          <p class="info-title">Study Mode</p>
        </div>
        <p class="info-close" id="info-close">&Cross;</p>
      </div>
      <hr />
      <p class="info-q">What is this mode?</p>
      <div class="info-ans">
        <p>
          This mode allows users to interact with objects through a user 
          interface and develop better understanding of computer graphics
        </p>
      </div>
      <p class="info-q">UI Commands:</p>
      <div class="info-ans">
        <p><span>Eye</span> - This field has 3 (X, Y, Z) inputs which control the position of the camera in the 3D world</p>
        <p><span>Object</span> - This dropbox option enables you to switch between different objects</p>
        <p><span>Transform (object)</span> - This field applies Translation/Scaling/Rotation operations on given axes (X, Y, Z)</p>
        <p><span>Color</span> - This property allows to change the color of the object</p>
      </div>
      `

      break;

    case "editor":
      html = `
        <div class="info-header">
          <div class="info-title-div">
            <p class="info-title">Editor Mode</p>
          </div>
          <p class="info-close" id="info-close">&Cross;</p>
        </div>
        <hr />
        <p class="info-q">What is this mode?</p>
        <div class="info-ans">
          <p>
            This mode allows users to interactively build structures with the 
            given objects and tools in the user interface present on the left
          </p>
        </div>
        <p class="info-q">Mouse/Keyboard Commands:</p>
        <div class="info-ans">
          <p><span>Left mouse click</span> - Adding selected object in the world</p>
          <p><span>Left mouse press and drag</span> - Rotating the camera</p>
          <p><span>Right mouse press and drag</span> - Translating the camera</p>
          <p><span>Mouse scroll wheel</span> - Zooming in/out</p>
          <p><span>Shift + mouse click</span> - If mouse is pointing to an object in the world this command removes that particular object</p>
        </div>
        <p class="info-q">UI Commands:</p>
        <div class="info-ans">
          <p><span>Object</span> - This dropbox option enables you to switch between different objects</p>
          <p><span>Dimensions</span> - There are 3 input fields which let you scale an object according to your needs</p>
          <p><span>Color</span> - This property allows to change the color of the current object</p>
        </div>
      `
      break;

    case "play":
      html = ""
      break;

    case "craft":
      break;

    default:
      html = ""
  }
  infoWindow.innerHTML = html
}