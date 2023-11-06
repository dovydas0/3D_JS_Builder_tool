export const changeObjectMenu = (
  object,
  currentMode,
  menuParameterCapture,
  selectedObj,
  controller
) => {
  if (currentMode === "editor") {
    if (controller === "object") {
      let html;
      const parentDiv = document.getElementById("selected-obj");

      switch (object.toLowerCase()) {
        case "cube":
          html = `
          <p class="container-p">Cube</p>
          <div class="dimensions">
            <p>Dimensions</p>
            <div class="dimension-inputs" id="dimension-inputs">
              <div class="dim-input">
                <label for="x-dim">X</label>
                <input type="number" name="dimensions" id="x-dim" value="${
                  menuParameterCapture[currentMode]?.dimensions?.x
                    ? menuParameterCapture[currentMode]?.dimensions?.x
                    : 1
                }" step="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label for="y-dim">Y</label>
                <input type="number" name="dimensions" id="y-dim" value="${
                  menuParameterCapture[currentMode]?.dimensions?.y
                    ? menuParameterCapture[currentMode]?.dimensions?.y
                    : 1
                }" step="1" min="1" max="50">
              </div>
              <div class="dim-input">
                <label for="z-dim">Z</label>
                <input type="number" name="dimensions" id="z-dim" value="${
                  menuParameterCapture[currentMode]?.dimensions?.z
                    ? menuParameterCapture[currentMode]?.dimensions?.z
                    : 1
                }" step="1" min="1" max="50">
              </div>
            </div>
          </div>
        `;
          break;
        case "sphere":
          html = `
          <p class="container-p">Sphere</p>
          <div class="dimensions">
            <p>Dimensions</p>
            <div class="dimension-inputs" id="dimension-inputs">
              <div class="dim-input">
                <label for="radius">Radius</label>
                <input type="number" name="radius" id="radius" value="0.5" step="0.5" min="0.5" max="50.5">
              </div>
            </div>
          </div>
        `;
          break;
        case "multiple":
          html = `
        <div class="container" id="selected-obj">
          <p class="container-p">Transform</p>
          <div class="dimensions">
            <p></p>
            <div class="dimension-inputs" id="dimension-inputs">
              <div class="dim-input">
                <label>X</label>
                <input type="number" name="transforms" id="transform-x" value="0" step="0.1" min="-50" max="50">
              </div>
              <div class="dim-input">
                <label>Y</label>
                <input type="number" name="transforms" id="transform-y" value="0" step="0.1" min="-50" max="50">
              </div>
              <div class="dim-input">
                <label>Z</label>
                <input type="number" name="transforms" id="transform-z" value="0" step="0.1" min="-50" max="50">
              </div>
            </div>
            <div class="transform-btns">
              <button class="btn-1" id="btn-translate">Translate</button>
              <button class="btn-1" id="btn-scale">Scale</button>
              <button class="btn-1" id="btn-rotate">Rotate</button>
            </div>
          </div>
        </div>
        `;
          break;
        default:
          html = "";
          break;
      }

      parentDiv.innerHTML = html;
    } else {
      let html;
      const parentDiv = document.getElementById("selected-parameters-selected");

      switch (object.toLowerCase()) {
        case "cube":
          html = `
          <div class="container" id="selected-obj-selected">
            <p class="container-p">Cube</p>
            <div class="dimensions">
              <p>Dimensions</p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label for="x-dim">X</label>
                  <input type="number" name="dimensions" id="x-dim" value="${
                    menuParameterCapture[currentMode]?.dimensions?.x
                      ? menuParameterCapture[currentMode]?.dimensions?.x
                      : 1
                  }" step="1" min="1" max="50">
                </div>
                <div class="dim-input">
                  <label for="y-dim">Y</label>
                  <input type="number" name="dimensions" id="y-dim" value="${
                    menuParameterCapture[currentMode]?.dimensions?.y
                      ? menuParameterCapture[currentMode]?.dimensions?.y
                      : 1
                  }" step="1" min="1" max="50">
                </div>
                <div class="dim-input">
                  <label for="z-dim">Z</label>
                  <input type="number" name="dimensions" id="z-dim" value="${
                    menuParameterCapture[currentMode]?.dimensions?.z
                      ? menuParameterCapture[currentMode]?.dimensions?.z
                      : 1
                  }" step="1" min="1" max="50">
                </div>
              </div>
            </div>
          </div>
        `;
          break;
        case "sphere":
          html = `
          <div class="container" id="selected-obj-selected">
            <p class="container-p">Sphere</p>
            <div class="dimensions">
              <p>Dimensions</p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label for="radius">Radius</label>
                  <input type="number" name="radius" id="radius" value="0.5" step="0.5" min="0.5" max="50.5">
                </div>
              </div>
            </div>
          </div>
        `;
          break;
        case "multiple":
          html = `
            <div class="container" id="selected-obj-selected">
              <p class="container-p">Transform</p>
              <div class="dimensions">
                <p></p>
                <div class="dimension-inputs" id="dimension-inputs">
                  <div class="dim-input">
                    <label>X</label>
                    <input type="number" name="transforms" id="transform-x" value="0" step="0.1" min="-50" max="50">
                  </div>
                  <div class="dim-input">
                    <label>Y</label>
                    <input type="number" name="transforms" id="transform-y" value="0" step="0.1" min="-50" max="50">
                  </div>
                  <div class="dim-input">
                    <label>Z</label>
                    <input type="number" name="transforms" id="transform-z" value="0" step="0.1" min="-50" max="50">
                  </div>
                </div>
                <div class="transform-btns">
                  <button class="btn-1" id="btn-translate">Translate</button>
                  <button class="btn-1" id="btn-scale">Scale</button>
                  <button class="btn-1" id="btn-rotate">Rotate</button>
                </div>
              </div>
            </div>
          `;
          break;
        default:
          html = "";
          break;
      }

      parentDiv.innerHTML = html;
    }
  } else if (currentMode == "study") {
    let html;
    const parentDiv = document.getElementById("selected-parameters");

    switch (object.toLowerCase()) {
      case "cube":
        html = `
        <div class="container" id="selected-obj">
          <p class="container-p">Cube</p>
          <div class="dimensions">
            <p></p>
            <div class="dimension-inputs" id="dimension-inputs">
              <div class="dim-input">
                <label>X</label>
                <input type="number" name="transforms" id="transform-x" value="0" step="0.1" min="-50" max="50">
              </div>
              <div class="dim-input">
                <label>Y</label>
                <input type="number" name="transforms" id="transform-y" value="0" step="0.1" min="-50" max="50">
              </div>
              <div class="dim-input">
                <label>Z</label>
                <input type="number" name="transforms" id="transform-z" value="0" step="0.1" min="-50" max="50">
              </div>
            </div>
            <div class="transform-btns">
              <button class="btn-1" id="btn-translate">Translate</button>
              <button class="btn-1" id="btn-scale">Scale</button>
              <button class="btn-1" id="btn-rotate">Rotate</button>
            </div>
          </div>
        </div>
        `;
        break;
      case "sphere":
        html = `
          <div class="container" id="selected-obj">
            <p class="container-p">Sphere</p>
            <div class="dimensions">
              <p></p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label>X</label>
                  <input type="number" name="transforms" id="transform-x" value="0" step="0.1" min="-50" max="50">
                </div>
                <div class="dim-input">
                  <label>Y</label>
                  <input type="number" name="transforms" id="transform-y" value="0" step="0.1" min="-50" max="50">
                </div>
                <div class="dim-input">
                  <label>Z</label>
                  <input type="number" name="transforms" id="transform-z" value="0" step="0.1" min="-50" max="50">
                </div>
              </div>
              <div class="transform-btns">
                <button class="btn-1" id="btn-translate">Translate</button>
                <button class="btn-1" id="btn-scale">Scale</button>
                <button class="btn-1" id="btn-rotate">Rotate</button>
              </div>
            </div>
          </div>
          <div class="container" id="selected-obj">
            <p class="container-p">Segments</p>
            <div class="dimensions">
              <p></p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label>Width</label>
                  <input type="number" name="segments" id="segments-width" value="${selectedObj.geometry.parameters.widthSegments}" step="1" min="3" max="32">
                </div>
                <div class="dim-input">
                  <label>Height</label>
                  <input type="number" name="segments" id="segments-height" value="${selectedObj.geometry.parameters.heightSegments}" step="1" min="2" max="16">
                </div>
              </div>
            </div>
          </div>
        `;
        break;
      case "cylinder":
        html = `
          <div class="container" id="selected-obj">
            <p class="container-p">Cylinder</p>
            <div class="dimensions">
              <p></p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label>X</label>
                  <input type="number" name="transforms" id="transform-x" value="0" step="0.1" min="-50" max="50">
                </div>
                <div class="dim-input">
                  <label>Y</label>
                  <input type="number" name="transforms" id="transform-y" value="0" step="0.1" min="-50" max="50">
                </div>
                <div class="dim-input">
                  <label>Z</label>
                  <input type="number" name="transforms" id="transform-z" value="0" step="0.1" min="-50" max="50">
                </div>
              </div>
              <div class="transform-btns">
                <button class="btn-1" id="btn-translate">Translate</button>
                <button class="btn-1" id="btn-scale">Scale</button>
                <button class="btn-1" id="btn-rotate">Rotate</button>
              </div>
            </div>
          </div>
        `;
        break;
      case "multiple":
        html = `
        <div class="container" id="selected-obj">
          <p class="container-p">Transform</p>
          <div class="dimensions">
            <p></p>
            <div class="dimension-inputs" id="dimension-inputs">
              <div class="dim-input">
                <label>X</label>
                <input type="number" name="transforms" id="transform-x" value="0" step="0.1" min="-50" max="50">
              </div>
              <div class="dim-input">
                <label>Y</label>
                <input type="number" name="transforms" id="transform-y" value="0" step="0.1" min="-50" max="50">
              </div>
              <div class="dim-input">
                <label>Z</label>
                <input type="number" name="transforms" id="transform-z" value="0" step="0.1" min="-50" max="50">
              </div>
            </div>
            <div class="transform-btns">
              <button class="btn-1" id="btn-translate">Translate</button>
              <button class="btn-1" id="btn-scale">Scale</button>
              <button class="btn-1" id="btn-rotate">Rotate</button>
            </div>
          </div>
        </div>
        `;
        break;
      default:
        html = "";
        break;
    }

    parentDiv.innerHTML = html;
  }
};
