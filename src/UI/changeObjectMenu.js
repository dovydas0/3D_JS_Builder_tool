export const changeObjectMenu = (object, currentMode, menuParameterCapture) => {
  if (currentMode === "editor") {
    let html
    const parentDiv = document.getElementById("selected-obj")

    switch(object.toLowerCase()) {
      case "cube":
        html = `
          <p class="selected-obj-p">Cube</p>
          <div class="dimensions">
            <p>Dimensions</p>
            <div class="dimension-inputs" id="dimension-inputs">
              <div class="dim-input">
                <label for="x-dim">X</label>
                <input type="number" name="dimensions" id="x-dim" value="${menuParameterCapture[currentMode]?.dimensions?.x ? menuParameterCapture[currentMode]?.dimensions?.x : 1}" step="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label for="y-dim">Y</label>
                <input type="number" name="dimensions" id="y-dim" value="${menuParameterCapture[currentMode]?.dimensions?.y ? menuParameterCapture[currentMode]?.dimensions?.y : 1}" step="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label for="z-dim">Z</label>
                <input type="number" name="dimensions" id="z-dim" value="${menuParameterCapture[currentMode]?.dimensions?.z ? menuParameterCapture[currentMode]?.dimensions?.z : 1}" step="1" min="1" max="50">
              </div>
            </div>
          </div>
        `
        break;
      case "sphere":
        html = `
          <p class="selected-obj-p">Sphere</p>
          <div class="dimensions">
            <p>Dimensions</p>
            <div class="dimension-inputs" id="dimension-inputs">
              <div class="dim-input">
                <label for="radius">Radius</label>
                <input type="number" name="radius" id="radius" value="0.5" step="0.5" min="0.5" max="50.5">
              </div>
            </div>
          </div>
        `
        break;
    }

    parentDiv.innerHTML = html
  } else if (currentMode == "study") {
    let html
    const parentDiv = document.getElementById("selected-parameters")

    switch(object.toLowerCase()) {
      case "cube":
        html = `
        <div class="selected-obj" id="selected-obj">
          <p class="selected-obj-p">Cube</p>
          <div class="dimensions">
            <p>Transform (object)</p>
            <div class="dimension-inputs" id="dimension-inputs">
              <div class="dim-input">
                <label>X</label>
                <input type="number" name="transforms" id="transform-x" value="${menuParameterCapture[object]?.transform?.x ? menuParameterCapture[object]?.transform?.x : "0"}" step="0.1" min="-50" max="50">
              </div>
              <div class="dim-input">
                <label>Y</label>
                <input type="number" name="transforms" id="transform-y" value="${menuParameterCapture[object]?.transform?.y ? menuParameterCapture[object]?.transform?.y : "0"}" step="0.1" min="-50" max="50">
              </div>
              <div class="dim-input">
                <label>Z</label>
                <input type="number" name="transforms" id="transform-z" value="${menuParameterCapture[object]?.transform?.z ? menuParameterCapture[object]?.transform?.z : "0"}" step="0.1" min="-50" max="50">
              </div>
            </div>
            <div class="transform-btns">
              <button class="btn-1" id="btn-translate">Translate</button>
              <button class="btn-1" id="btn-scale">Scale</button>
              <button class="btn-1" id="btn-rotate">Rotate</button>
            </div>
          </div>
        </div>
        `
        break;
      case "sphere":
        html = `
          <div class="selected-obj" id="selected-obj">
            <p class="selected-obj-p">Sphere</p>
            <div class="dimensions">
              <p>Transform (object)</p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label>X</label>
                  <input type="number" name="transforms" id="transform-x" value="${menuParameterCapture[object]?.transform?.x ? menuParameterCapture[object]?.transform?.x : "0"}" step="0.1" min="-50" max="50">
                </div>
                <div class="dim-input">
                  <label>Y</label>
                  <input type="number" name="transforms" id="transform-y" value="${menuParameterCapture[object]?.transform?.y ? menuParameterCapture[object]?.transform?.y : "0"}" step="0.1" min="-50" max="50">
                </div>
                <div class="dim-input">
                  <label>Z</label>
                  <input type="number" name="transforms" id="transform-z" value="${menuParameterCapture[object]?.transform?.z ? menuParameterCapture[object]?.transform?.z : "0"}" step="0.1" min="-50" max="50">
                </div>
              </div>
              <div class="transform-btns">
                <button class="btn-1" id="btn-translate">Translate</button>
                <button class="btn-1" id="btn-scale">Scale</button>
                <button class="btn-1" id="btn-rotate">Rotate</button>
              </div>
            </div>
          </div>
          <div class="selected-obj" id="selected-obj">
            <p class="selected-obj-p">Segments</p>
            <div class="dimensions">
              <p></p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label for="radius">Width</label>
                  <input type="number" name="radius" id="radius" value="1" step="1" min="1" max="50">
                </div>
                <div class="dim-input">
                  <label for="radius">Height</label>
                  <input type="number" name="radius" id="radius" value="1" step="1" min="1" max="50">
                </div>
              </div>
            </div>
          </div>
        `
        break;
      case "cylinder":
        html = `
          <div class="selected-obj" id="selected-obj">
            <p class="selected-obj-p">Cylinder</p>
            <div class="dimensions">
              <p>Transform (object)</p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label>X</label>
                  <input type="number" name="transforms" id="transform-x" value="${menuParameterCapture[object]?.transform?.x ? menuParameterCapture[object]?.transform?.x : "0"}" step="0.1" min="-50" max="50">
                </div>
                <div class="dim-input">
                  <label>Y</label>
                  <input type="number" name="transforms" id="transform-y" value="${menuParameterCapture[object]?.transform?.y ? menuParameterCapture[object]?.transform?.y : "0"}" step="0.1" min="-50" max="50">
                </div>
                <div class="dim-input">
                  <label>Z</label>
                  <input type="number" name="transforms" id="transform-z" value="${menuParameterCapture[object]?.transform?.z ? menuParameterCapture[object]?.transform?.z : "0"}" step="0.1" min="-50" max="50">
                </div>
              </div>
              <div class="transform-btns">
                <button class="btn-1" id="btn-translate">Translate</button>
                <button class="btn-1" id="btn-scale">Scale</button>
                <button class="btn-1" id="btn-rotate">Rotate</button>
              </div>
            </div>
          </div>
        `
        break;
    }

    parentDiv.innerHTML = html
  }
}