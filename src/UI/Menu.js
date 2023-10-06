import { Cube } from "../objects/interactive/Cube";
import { Cylinder } from "../objects/interactive/Cylinder";
import { Sphere } from "../objects/interactive/Sphere";

export class Menu {
  constructor(worldObject, placeholderObject) {
    // STORE ALL BLOCKS IN AN ARRAY HERE
    this.currentMode = "editor";
    this.currentWorld = worldObject
    this.currentScene = worldObject.scene
    this.currentObject = placeholderObject
    this.menuParameterCapture = {
      study: {},
      editor: {},
      play: {},
      craft: {},
    }
  
    // Accessing all necessary handles in the menu
    this.floorTiles = document.getElementById("floor-tile").checked
    this.axisHelper = document.getElementById("axis-helper").checked

    if (this.floorTiles) {
      this.currentWorld.addObject(this.currentWorld.gridHelper)
    }
    if (this.axisHelper) {
      this.currentWorld.addObject(this.currentWorld.axesHelper)
    }
  }

  modeChange(mode, world) {
    const previousWorld = this.currentWorld

    this.previousModeSnapshot(previousWorld.scene.name)
    
    // Enabling/disabling camera controls
    if (previousWorld.scene.name === "editor" && mode !== "editor") {
      this.currentWorld.controls.enabled = false
    } else if (mode === "editor") {
      world.controls.enabled = true
    }

    this.currentMode = mode
    this.currentWorld = world
    this.currentScene = world.scene
    this.changeMenu(mode)
    this.changeInfo(mode)

    // Adding/removing placeholder block depending on the selected mode
    if (mode === "editor") {
      this.action({name: "objects"}, world);
    } else {
      if (previousWorld?.placeholderObject?.mesh) {
        previousWorld.removeObject(previousWorld.placeholderObject.mesh)
      }
    }
  }

  previousModeSnapshot(prevMode) {
    switch (prevMode) {
      case "study":
        const rotation = document.getElementById("rotation")
        const axisHelper = document.getElementById("axis-helper")
        const object = document.getElementById("objects").value
        const eyeX = Number(document.getElementById("eye-x").value)
        const eyeY = Number(document.getElementById("eye-y").value)
        const eyeZ = Number(document.getElementById("eye-z").value)
        const transformX = Number(document.getElementById("transform-x").value)
        const transformY = Number(document.getElementById("transform-y").value)
        const transformZ = Number(document.getElementById("transform-z").value)
    
        this.menuParameterCapture[prevMode] = {
          rotation: rotation.checked,
          axisHelper: axisHelper.checked,
          object: object,
          eye: {
            x: eyeX,
            y: eyeY,
            z: eyeZ,
          },
          transform: {
            x: transformX,
            y: transformY,
            z: transformZ,
          }
        }
        break;
    }
  }

  showInfo() {
    const infoWindow = document.getElementById('info-window')

    if (infoWindow.classList.contains('invisible')) {
      infoWindow.classList.remove('invisible')
    } else {
      infoWindow.classList.add('invisible')
    }
  }

  action(eventData, worldObject) {
    switch (eventData.name) {
      case "rotation":
        console.log(this.currentWorld);
        eventData.checked === true ? 
          this.currentWorld.controls.autoRotate = true
          :
          this.currentWorld.controls.autoRotate = false
          this.currentWorld.camera.rotation.set(-0.8, 0, 0)
          const EyeX = Number(document.getElementById("eye-x").value)
          const EyeY = Number(document.getElementById("eye-y").value)
          const EyeZ = Number(document.getElementById("eye-z").value)
          
          this.currentWorld.camera.position.set(EyeX, EyeY, EyeZ)
          break;
      case "floor-grid":
        eventData.checked === true ? 
          this.currentWorld.addObject(this.currentWorld.gridHelper)
          :
          this.currentWorld.removeObject(this.currentWorld.gridHelper)
        break;
      case "axis-helper":
        eventData.checked === true ? 
          this.currentWorld.addObject(this.currentWorld.axesHelper)
          :
          this.currentWorld.removeObject(this.currentWorld.axesHelper)
        break;
      case "dimensions":
      case "objects":
        if (this.currentMode === "editor") {
          let newObject
          const x = Math.floor(Number(document.getElementById("x-dim").value))
          const y = Math.floor(Number(document.getElementById("y-dim").value))
          const z = Math.floor(Number(document.getElementById("z-dim").value))
          const object = document.getElementById("objects").value
  
          switch (object) {
            case "cube":
              newObject = new Cube("object", x, y, z, 0x5544AA, "Basic", true)
              newObject.mesh.position.set(1, 10, 1)
              // console.log(newObject.mesh.position.x);
              // console.log(newObject.mesh.position.y);
              // console.log(newObject.mesh.position.z);
              break;
            case "sphere":
              newObject = new Sphere("object", 2, 0x5544AA, "Basic", true)
              // console.log(newObject.mesh.position.x);
              // console.log(newObject.mesh.position.y);
              // console.log(newObject.mesh.position.z);
              break;
            case "cylinder":
              // newObject = new Cylinder("object", 1, 1, 1, 0x5544AA, "Basic", true)
              break;
          }

          // If new object created successfully
          if (newObject?.mesh) {
            // newObject.mesh.position.set(0, 0, 0)
            // Removing old placeholder object and adding a new one
            this.currentWorld.scene.remove(worldObject.placeholderObject.mesh)
  
            this.currentObject = newObject
            worldObject.updatePlaceholderObject(newObject)
            this.currentWorld.addObject(newObject.mesh)
            // console.log(this.currentObject);
            // this.currentObject.mesh.position.x = 0
            // this.currentObject.mesh.position.y = 0
            // this.currentObject.mesh.position.z = 0
          }
        }
        break;
      case "transform":
        let newObjectTransform
        const xTrans = Number(document.getElementById("transform-x").value)
        const yTrans = Number(document.getElementById("transform-y").value)
        const zTrans = Number(document.getElementById("transform-z").value)
        const objectTransform = document.getElementById("objects").value

        switch (objectTransform) {
          case "cube":
            newObjectTransform = new Cube("object", xTrans, yTrans, zTrans, 0x5544AA, "Lambert")
            newObjectTransform.mesh.position.addScalar(0.5)
            // console.log(newObject.mesh.position.x);
            // console.log(newObject.mesh.position.y);
            // console.log(newObject.mesh.position.z);
            break;
          case "sphere":
            newObjectTransform = new Sphere("object", 2, 0x5544AA, "Lambert")
            // console.log(newObject.mesh.position.x);
            // console.log(newObject.mesh.position.y);
            // console.log(newObject.mesh.position.z);
            break;
          case "cylinder":
            // newObjectTransform = new Cylinder("object", 1, 1, 1, 0x5544AA, "Basic", true)
            break;
        }

        // If new object created successfully
        if (newObjectTransform?.mesh) {
          // newObject.mesh.position.set(0, 0, 0)
          // Removing old placeholder object and adding a new one
          this.currentWorld.removeObject(worldObject.studyObject.mesh)

          // console.log(worldObject);
          // console.log(this.currentWorld);

          worldObject.updateStudyObject(newObjectTransform)
          this.currentWorld.addObject(newObjectTransform.mesh)
          // console.log(this.currentObject);
          // this.currentObject.mesh.position.x = 0
          // this.currentObject.mesh.position.y = 0
          // this.currentObject.mesh.position.z = 0
        }
        break;
      case "eye":
        const xEye = Number(document.getElementById("eye-x").value)
        const yEye = Number(document.getElementById("eye-y").value)
        const zEye = Number(document.getElementById("eye-z").value)
        
        this.currentWorld.camera.position.set(xEye, yEye, zEye)
        break;
    }
  }

  changeInfo(mode) {
    let html
    const infoWindow = document.getElementById('info-window')

    switch (mode) {
      case "study":
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
              This mode allows you to interactively build structures with the 
              given objects and tools in the user interface present on the left
            </p>
          </div>
          <p class="info-q">Mouse/Keyboard Commands:</p>
          <div class="info-ans">
            <p><span>Left mouse click</span> - Adding selected object in the world</p>
            <p><span>Left mouse press and drag</span> - Rotating the camera</p>
            <p><span>Right mouse press and drag</span> - Translating the camera</p>
            <p><span>Mouse scroll wheel</span> - Zooming in/out</p>
            <p><span>Shift + left mouse click</span> - If mouse is pointing to an object in the world this command removes that particular object</p>
          </div>
          <p class="info-q">UI Commands:</p>
          <div class="info-ans">
            <p><span>Object</span> - This dropbox option enables you to switch between different objects</p>
            <p><span>Dimensions</span> - There are 3 input fields which let you scale an object according to your needs</p>
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

  changeMenu(mode) {
    let html
    const menu = document.getElementById("menu-ui")

    switch (mode) {
      case "study":
        html = `
          <p id="menu-title">STUDY</p>
          <div class="helpers">
            <div class="checkbox">
              <p>Rotation</p>
              <label class="el-switch el-switch-sm">
                <input type="checkbox" name="rotation" id="rotation" ${this.menuParameterCapture[mode].rotation ? "checked" : ""}>
                <span class="el-switch-style"></span>
              </label>
            </div>
            <div class="checkbox">
              <p>Axis Helper</p>
              <label class="el-switch el-switch-sm">
                <input type="checkbox" name="axis-helper" id="axis-helper" ${this.menuParameterCapture[mode].axisHelper ? "checked" : ""}>
                <span class="el-switch-style"></span>
              </label>
            </div>
          </div>
          <div class="objects">
            <p>Object</p>
            <select class="objects-dropdown" name="objects" id="objects">
              <option ${this.menuParameterCapture[mode].object === "cube" ? "selected" : ""} value="cube">Cube</option>
              <option ${this.menuParameterCapture[mode].object === "sphere" ? "selected" : ""} value="sphere">Sphere</option>
              <option ${this.menuParameterCapture[mode].object === "cylinder" ? "selected" : ""} value="cylinder">Cylinder</option>
            </select>
          </div>
          <div class="eye">
            <p>Eye</p>
            <div class="dimension-inputs" id="eye-inputs">
              <div class="dim-input">
                <label>X</label>
                <input type="number" name="eye" id="eye-x" value="${this.menuParameterCapture[mode]?.eye?.x ? this.menuParameterCapture[mode]?.eye?.x : "0"}" step="0.1" min="-50" max="50">
              </div>
              <div class="dim-input">
                <label>Y</label>
                <input type="number" name="eye" id="eye-y" value="${this.menuParameterCapture[mode]?.eye?.y ? this.menuParameterCapture[mode]?.eye?.y : "10"}" step="0.1" min="-50" max="50">
              </div>
              <div class="dim-input">
                <label>Z</label>
                <input type="number" name="eye" id="eye-z" value="${this.menuParameterCapture[mode]?.eye?.z ? this.menuParameterCapture[mode]?.eye?.z : "10"}" step="0.1" min="-50" max="50">
              </div>
            </div>
          </div>
          <div class="dimensions">
            <p>Transform (object)</p>
            <div class="dimension-inputs" id="transform-inputs">
              <div class="dim-input">
                <label>X</label>
                <input type="number" name="transforms" id="transform-x" value="${this.menuParameterCapture[mode]?.transform?.x ? this.menuParameterCapture[mode]?.transform?.x : "1"}" min="-50" max="50">
              </div>
              <div class="dim-input">
                <label>Y</label>
                <input type="number" name="transforms" id="transform-y" value="${this.menuParameterCapture[mode]?.transform?.y ? this.menuParameterCapture[mode]?.transform?.y : "1"}" min="-50" max="50">
              </div>
              <div class="dim-input">
                <label>Z</label>
                <input type="number" name="transforms" id="transform-z" value="${this.menuParameterCapture[mode]?.transform?.z ? this.menuParameterCapture[mode]?.transform?.z : "1"}" min="-50" max="50">
              </div>
            </div>
            <div class="transform-btns">
              <button class="btn-1" id="btn-translate">Translate</button>
              <button class="btn-1" id="btn-scale">Scale</button>
              <button class="btn-1" id="btn-rotate">Rotate</button>
            </div>
          </div>
        `
        break;

      case "editor":
        html = `
          <p id="menu-title">EDITOR</p>
          <div class="helpers">
            <div class="checkbox">
              <p>Floor Tiles</p>
              <label class="el-switch el-switch-sm">
                <input type="checkbox" name="floor-grid" id="floor-tile" checked>
                <span class="el-switch-style"></span>
              </label>
            </div>
            <div class="checkbox">
              <p>Axis Helper</p>
              <label class="el-switch el-switch-sm">
                <input type="checkbox" name="axis-helper" id="axis-helper">
                <span class="el-switch-style"></span>
              </label>
            </div>
          </div>
          <div class="objects">
            <p>Object</p>
            <select class="objects-dropdown" name="objects" id="objects">
              <option value="cube">Cube</option>
              <option value="sphere">Sphere</option>
              <option value="cylinder">Cylinder</option>
            </select>
          </div>
          <div class="dimensions">
            <p>Dimensions</p>
            <div class="dimension-inputs" id="dimension-inputs">
              <div class="dim-input">
                <label>X</label>
                <input type="number" name="dimensions" id="x-dim" value="1" step="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label>Y</label>
                <input type="number" name="dimensions" id="y-dim" value="1" step="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label>Z</label>
                <input type="number" name="dimensions" id="z-dim" value="1" step="1" min="1" max="50">
              </div>
            </div>
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
    menu.innerHTML = html
  }
}


