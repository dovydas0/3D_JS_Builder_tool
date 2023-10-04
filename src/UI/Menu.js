import { Cube } from "../objects/interactive/Cube";
import { Cylinder } from "../objects/interactive/Cylinder";
import { Sphere } from "../objects/interactive/Sphere";

export class Menu {
  constructor(sceneObject) {
    // STORE ALL BLOCKS IN AN ARRAY HERE

    this.currentMode = "editor";
    this.sceneObject = sceneObject
    this.currentScene = sceneObject
    this.currentObject = new Cube("object", 1, 1, 1, 0x5544AA, "Basic", true)
  
    // Accessing all necessary handles in the menu
    this.floorTiles = document.getElementById("floor-tile").checked
    this.axisHelper = document.getElementById("axis-helper").checked

    if (this.floorTiles) {
      sceneObject.addObject(this.sceneObject.gridHelper)
    }
    if (this.axisHelper) {
      sceneObject.addObject(this.sceneObject.axesHelper)
    }
  }

  modeChange(mode, studyScene) {
    this.currentMode = mode
    this.currentScene = studyScene
    this.changeMenu(mode)
  }

  action(eventData, worldObject) {
    switch (eventData.name) {
      case "floor-grid":
        eventData.checked === true ? 
          this.sceneObject.addObject(this.sceneObject.gridHelper)
          :
          this.sceneObject.removeObject(this.sceneObject.gridHelper)
        break;
      case "axis-helper":
        eventData.checked === true ? 
          this.sceneObject.addObject(this.sceneObject.axesHelper)
          :
          this.sceneObject.removeObject(this.sceneObject.axesHelper)
        break;
      case "dimensions":
      case "objects":
        if (this.currentMode === "editor") {
          let newObject
          const x = Number(document.getElementById("x-dim").value)
          const y = Number(document.getElementById("y-dim").value)
          const z = Number(document.getElementById("z-dim").value)
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
            this.sceneObject.scene.remove(worldObject.placeholderObject.mesh)
  
            this.currentObject = newObject
            worldObject.updatePlaceholderObject(newObject)
            this.sceneObject.addObject(newObject.mesh)
            console.log(this.currentObject);
            // this.currentObject.mesh.position.x = 0
            // this.currentObject.mesh.position.y = 0
            // this.currentObject.mesh.position.z = 0
          }
        }
        break;
    }
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
                <input type="checkbox" name="rotation" id="rotation">
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
            <p>Eye</p>
            <div class="dimension-inputs" id="dimension-inputs">
              <div class="dim-input">
                <label for="x-dim">X</label>
                <input type="number" name="dimensions" id="x-dim" value="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label for="y-dim">Y</label>
                <input type="number" name="dimensions" id="y-dim" value="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label for="z-dim">Z</label>
                <input type="number" name="dimensions" id="z-dim" value="1" min="1" max="50">
              </div>
            </div>
          </div>
          <div class="dimensions">
            <p>Transformations</p>
            <div class="dimension-inputs" id="dimension-inputs">
              <div class="dim-input">
                <label for="x-dim">X</label>
                <input type="number" name="dimensions" id="x-dim" value="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label for="y-dim">Y</label>
                <input type="number" name="dimensions" id="y-dim" value="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label for="z-dim">Z</label>
                <input type="number" name="dimensions" id="z-dim" value="1" min="1" max="50">
              </div>
            </div>
          </div>
          <div class="dimensions">
            <p>Dimensions</p>
            <div class="dimension-inputs" id="dimension-inputs">
              <div class="dim-input">
                <label for="x-dim">X</label>
                <input type="number" name="dimensions" id="x-dim" value="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label for="y-dim">Y</label>
                <input type="number" name="dimensions" id="y-dim" value="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label for="z-dim">Z</label>
                <input type="number" name="dimensions" id="z-dim" value="1" min="1" max="50">
              </div>
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
                <label for="x-dim">X</label>
                <input type="number" name="dimensions" id="x-dim" value="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label for="y-dim">Y</label>
                <input type="number" name="dimensions" id="y-dim" value="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label for="z-dim">Z</label>
                <input type="number" name="dimensions" id="z-dim" value="1" min="1" max="50">
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


