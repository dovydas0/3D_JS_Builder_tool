export const changeMenu = (mode, menuParameterCapture) => {
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
              <input type="checkbox" name="rotation" id="rotation" ${menuParameterCapture[mode].rotation ? "checked" : ""}>
              <span class="el-switch-style"></span>
            </label>
          </div>
          <div class="checkbox">
            <p>Axis Helper</p>
            <label class="el-switch el-switch-sm">
              <input type="checkbox" name="axis-helper" id="axis-helper" ${menuParameterCapture[mode].axisHelper ? "checked" : ""}>
              <span class="el-switch-style"></span>
            </label>
          </div>
        </div>
        <div class="dimensions eye-dim">
          <p>Eye</p>
          <div class="dimension-inputs" id="eye-inputs">
            <div class="dim-input">
              <label>X</label>
              <input type="number" name="eye" id="eye-x" value="${menuParameterCapture[mode]?.eye?.x ? menuParameterCapture[mode]?.eye?.x : "0"}" step="0.1" min="-50" max="50">
            </div>
            <div class="dim-input">
              <label>Y</label>
              <input type="number" name="eye" id="eye-y" value="${menuParameterCapture[mode]?.eye?.y ? menuParameterCapture[mode]?.eye?.y : "6"}" step="0.1" min="-50" max="50">
            </div>
            <div class="dim-input">
              <label>Z</label>
              <input type="number" name="eye" id="eye-z" value="${menuParameterCapture[mode]?.eye?.z ? menuParameterCapture[mode]?.eye?.z : "8"}" step="0.1" min="-50" max="50">
            </div>
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
        <div class="selected-parameters" id="selected-parameters">
          <div class="selected-obj" id="selected-obj">
            <p class="selected-obj-p">cube</p>
            <div class="dimensions">
              <p>Transform (object)</p>
              <div class="dimension-inputs" id="transform-inputs">
                <div class="dim-input">
                  <label>X</label>
                  <input type="number" name="transforms" id="transform-x" value="${menuParameterCapture[mode]?.transform?.x ? menuParameterCapture[mode]?.transform?.x : "0"}" step="0.1" min="-50" max="50">
                </div>
                <div class="dim-input">
                  <label>Y</label>
                  <input type="number" name="transforms" id="transform-y" value="${menuParameterCapture[mode]?.transform?.y ? menuParameterCapture[mode]?.transform?.y : "0"}" step="0.1" min="-50" max="50">
                </div>
                <div class="dim-input">
                  <label>Z</label>
                  <input type="number" name="transforms" id="transform-z" value="${menuParameterCapture[mode]?.transform?.z ? menuParameterCapture[mode]?.transform?.z : "0"}" step="0.1" min="-50" max="50">
                </div>
              </div>
              <div class="transform-btns">
                <button class="btn-1" id="btn-translate">Translate</button>
                <button class="btn-1" id="btn-scale">Scale</button>
                <button class="btn-1" id="btn-rotate">Rotate</button>
              </div>
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
              <input type="checkbox" name="floor-grid" id="floor-tile" ${menuParameterCapture[mode]?.floorTiles ? "checked": ""}>
              <span class="el-switch-style"></span>
            </label>
          </div>
          <div class="checkbox">
            <p>Axis Helper</p>
            <label class="el-switch el-switch-sm">
              <input type="checkbox" name="axis-helper" id="axis-helper" ${menuParameterCapture[mode]?.axisHelper ? "checked": ""}>
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
        <div class="selected-parameters" id="selected-parameters">
          <div class="selected-obj" id="selected-obj">
            <p class="selected-obj-p">Cube</p>
            <div class="dimensions">
              <p>Dimensions</p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label for="x-dim">X</label>
                  <input type="number" name="dimensions" id="x-dim" value="${menuParameterCapture[mode]?.dimensions?.x ? menuParameterCapture[mode]?.dimensions?.x : 1}" step="1" min="1" max="50">
                </div>
                <div class="dim-input">
                  <label for="y-dim">Y</label>
                  <input type="number" name="dimensions" id="y-dim" value="${menuParameterCapture[mode]?.dimensions?.y ? menuParameterCapture[mode]?.dimensions?.y : 1}" step="1" min="1" max="50">
                </div>
                <div class="dim-input">
                  <label for="z-dim">Z</label>
                  <input type="number" name="dimensions" id="z-dim" value="${menuParameterCapture[mode]?.dimensions?.z ? menuParameterCapture[mode]?.dimensions?.z : 1}" step="1" min="1" max="50">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="color-picker">
          <div class="selected-obj color-parameter">
            <div class="header">
              <p class="selected-obj-p">Color</p>
              <input type="color" value="${menuParameterCapture[mode]?.color ? menuParameterCapture[mode]?.color : "#5544AA"}" name="color-picker" id="color-input">
            </div>
            <div class="suggested-colors">
              <label class="color1">
                <input type="checkbox" name="color-picker" value="#5544AA" />
              </label>
              <label class="color2">
                <input type="checkbox" name="color-picker" value="#44aa4b" />
              </label>
              <label class="color3">
                <input type="checkbox" name="color-picker" value="#aa4444" />
              </label>
              <label class="color4">
                <input type="checkbox" name="color-picker" value="#a0aa44" />
              </label>
              <label class="color5">
                <input type="checkbox" name="color-picker" value="#4494aa" />
              </label>
              <label class="color6">
                <input type="checkbox" name="color-picker" value="#aa7a44" />
              </label>
              <label class="color7">
                <input type="checkbox" name="color-picker" value="#aa44a3" />
              </label>
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