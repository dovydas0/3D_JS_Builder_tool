export const changeInfo = (mode) => {
  let html;
  const infoWindow = document.getElementById("info-window");

  switch (mode) {
    case "study":
      html = `
        <div class="info-header">
          <div class="info-title-div">
            <p class="info-title">Study Mode</p>
          </div>
          <p class="info-close" id="info-close">&Cross;</p>
        </div>
        <p class="info-q">What is this mode?</p>
        <div class="info-ans">
          <p>
            This mode allows users to interact with objects through a user 
            interface and develop better understanding of computer graphics
          </p>
        </div>
        <p class="info-q">UI Features:</p>
        <div class="info-ans">
          <h2><span>Mode Menu:</span></h2>
          <p><span>Eye</span> - 3 (X, Y, Z) inputs which control the position of the view in the world</p>
          <p><span>Object</span> - This dropbox option enables you to switch between different objects</p>
          <p><span>Transform (object)</span> - This field applies Translation/Scaling/Rotation operations on given axes (X, Y, Z)</p>
          <p><span>Color</span> - This property allows to change the color of the object</p>
          <h2><span>Scene Menu:</span></h2>
          <p><span>Select Objects</span> - Left mouse click on the object name</p>
          <p><span>Select Multiple Objects</span> - Ctrl + left mouse click on the next object</p>
        </div>
      `;

      break;

    case "editor":
      html = `
        <div class="info-header">
          <div class="info-title-div">
            <p class="info-title">Editor Mode</p>
          </div>
          <p class="info-close" id="info-close">&Cross;</p>
        </div>
        <p class="info-q">What is this mode?</p>
        <div class="info-ans">
          <p>
            This mode allows users to interactively build structures with the 
            given objects and tools in the user interface present on the left
          </p>
        </div>
        <p class="info-q">World Features:</p>
        <div class="info-ans">
          <p><span>Rotate View</span> - Left mouse click and drag</p>
          <p><span>Move View</span> - Right mouse click and drag</p>
          <p><span>Zooming In/Out</span> - Mouse scroll wheel</p>
          <p><span>Add Object</span> - Left mouse click in the world</p>
          <p><span>Remove Objects</span> - Shift + mouse click on the object</p>
          <p><span>Select Objects</span> - Ctrl + mouse click on the object</p>
        </div>
        <p class="info-q">UI Features:</p>
        <div class="info-ans">
          <h2><span>Mode Menu:</span></h2>
          <p><span>Object</span> - This dropbox option enables you to switch between different objects</p>
          <p><span>Dimensions</span> - There are 3 input fields which let you scale an object according to your needs</p>
          <p><span>Color</span> - This property allows to change the color of the current object</p>
          <h2><span>Scene Menu:</span></h2>
          <p><span>Select Objects</span> - Left mouse click on the object name</p>
          <p><span>Select Multiple Objects</span> - Ctrl + left mouse click on the next object</p>
        </div>
      `;
      break;

    case "play":
      html = "";
      break;

    case "craft":
      break;

    default:
      html = "";
  }
  infoWindow.innerHTML = html;
};
