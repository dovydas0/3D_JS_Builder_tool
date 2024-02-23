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
          <p><span>Add Object</span> - Mouse click in the world</p>
          <p><span>Remove Objects</span> - Shift + mouse click on the object</p>
          <p><span>Select Object(s)</span> - Ctrl + mouse click on the object</p>
          <p>
            <span>Move Object(s)</span> - Select object(s) and use transform
            controls presented on the object or utilize "Transform" section in the
            menu on the left
          </p>
          <p>
            <span>Rotate/Scale Object(s)</span> - Select object(s) and utilize
            "Transform" section in the menu on the left
          </p>
        </div>
        <p class="info-q">UI Features:</p>
        <div class="info-ans">
          <h2><span>Mode Menu:</span></h2>
          <p>
            <span>Object</span> - This dropbox allows for switching between
            different objects
          </p>
          <p>
            <span>Placeholder "Object"</span> - This section contains properties
            for placeholder object manipulation
          </p>
          <p>
            <span>Color</span> - This section allows to change the color of the
            selected (otherwise placeholder) object(s)
          </p>
          <p>
            <span>Predefined Models</span> - This section allows to load example
            models to the scene
          </p>
          <p>
            <span>"Object" (When Object Selected)</span> - This section contains
            properties for selected object manipulation
          </p>
          <p>
            <span>Transform (When Object Selected)</span> - This section allows
            for selected object(s) translation/rotation/scaling
          </p>
          <h2><span>Scene Menu:</span></h2>
          <p><span>Select Objects</span> - Left mouse click on the object name</p>
          <p>
            <span>Select Multiple Objects</span> - Ctrl + left mouse click on the
            next object
          </p>
          <p>
            <span>Remove (When Object Selected)</span> - Removes selected objects
            from the world
          </p>
          <p>
            <span>Group (When Object Selected)</span> - Groups selected objects
          </p>
          <h2><span>Menu bar:</span></h2>
          <p><span>New</span> - Resets world</p>
          <p><span>Import GLTF/OBJ</span> - Allows GLTF/OBJ model improting</p>
          <p><span>Export GLTF</span> - Exports the whole scene as GLTF file</p>
          <p><span>Export OBJ</span> - Exports the whole scene as OBJ file</p>
          <p>
            <span>Save Model</span> - Saves selected group of objects or all
            objects in the scene (if nothing selected and no groups present in the
            scene) to JSON file
          </p>
          <p><span>Load Model</span> - Loads saved model from JSON file</p>
          <p><span>Android Tutorial</span> - Loads up a tutorials for building a predefined android robot model</p>
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
