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
            <p class="container-p">Placeholder Cube</p>
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
            <p class="container-p">Placeholder Sphere</p>
            <div class="dimensions">
              <p>Properties</p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label for="radius">Radius</label>
                  <input type="number" name="radius" id="radius" value="0.5" step="0.5" min="0.5" max="50.5">
                </div>
                <div class="dim-input">
                  <label for="thetaLength">ThetaLength</label>
                  <input type="number" name="radius" id="theta-length" value="3.142" step="0.001" min="0" max="3.142">
                </div>
                <div class="dim-input">
                  <label>WidthSegments</label>
                  <input type="number" name="radius" id="segments-width" value="32" step="1" min="3" max="32">
                </div>
                <div class="dim-input">
                  <label>HeightSegments</label>
                  <input type="number" name="radius" id="segments-height" value="16" step="1" min="2" max="16">
                </div>
              </div>
            </div>
          `;
          break;
        case "cylinder":
          html = `
            <p class="container-p">Placeholder Cylinder</p>
            <div class="dimensions">
              <p>Properties</p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label for="radiusTop">RadiusTop</label>
                  <input type="number" name="cylinder" id="radiusTop" value="0.5" step="0.5" min="0.5" max="50">
                </div>
                <div class="dim-input">
                  <label for="radiusBottom">RadiusBottom</label>
                  <input type="number" name="cylinder" id="radiusBottom" value="0.5" step="0.5" min="0.5" max="50">
                </div>
                <div class="dim-input">
                  <label for="height">Height</label>
                  <input type="number" name="cylinder" id="height" value="1" step="1" min="1" max="50">
                </div>
                <div class="dim-input">
                  <label for="radialSegments">RadialSegments</label>
                  <input type="number" name="cylinder" id="radialSegments" value="3" step="1" min="3" max="50">
                </div>
                <div class="dim-input">
                  <label for="openEnded">OpenEnded</label>
                  <input type="checkbox" name="cylinder" id="openEnded" value="false">
                </div>
              </div>
            </div>
          `;
          break;
        case "capsule":
          html = `
            <p class="container-p">Placeholder Capsule</p>
            <div class="dimensions">
              <p>Properties</p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label for="radius">Radius</label>
                  <input type="number" name="capsule" id="radiusCap" value="0.5" step="0.5" min="0.5" max="30">
                </div>
                <div class="dim-input">
                  <label for="length">Length</label>
                  <input type="number" name="capsule" id="lengthCap" value="1" step="0.5" min="1" max="30">
                </div>
                <div class="dim-input">
                  <label for="capSegments">CapSegments</label>
                  <input type="number" name="capsule" id="capSegmentsCap" value="6" step="1" min="1" max="32">
                </div>
                <div class="dim-input">
                  <label for="radialSegments">RadialSegments</label>
                  <input type="number" name="capsule" id="radialSegmentsCap" value="12" step="1" min="3" max="64">
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

      switch (object?.toLowerCase()) {
        case "cube":
          html = `
            <div class="container" id="selected-obj-selected">
              <p class="container-p">Cube</p>
              <div class="dimensions">
                <p>Dimensions</p>
                <div class="dimension-inputs" id="selected-dimension-inputs">
                  <div class="dim-input">
                    <label for="x-dim">X</label>
                    <input type="number" name="selected-dimensions" id="selected-x-dim" value="${Math.floor(
                      selectedObj.geometry.parameters.width
                    )}" step="1" min="1" max="50">
                  </div>
                  <div class="dim-input">
                    <label for="y-dim">Y</label>
                    <input type="number" name="selected-dimensions" id="selected-y-dim" value="${Math.floor(
                      selectedObj.geometry.parameters.height
                    )}" step="1" min="1" max="50">
                  </div>
                  <div class="dim-input">
                    <label for="z-dim">Z</label>
                    <input type="number" name="selected-dimensions" id="selected-z-dim" value="${Math.floor(
                      selectedObj.geometry.parameters.depth
                    )}" step="1" min="1" max="50">
                  </div>
                </div>
              </div>
            </div>
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
        case "sphere":
          html = `
            <div class="container" id="selected-obj-selected">
              <p class="container-p">Sphere</p>
              <div class="dimensions">
                <p>Properties</p>
                <div class="dimension-inputs" id="dimension-inputs">
                  <div class="dim-input">
                    <label for="radius">Radius</label>
                    <input type="number" name="selected-radius" id="selected-radius" value="${selectedObj.geometry.parameters.radius}" step="0.5" min="0.5" max="50.5">
                  </div>
                  <div class="dim-input">
                    <label for="thetaLength">ThetaLength</label>
                    <input type="number" name="selected-radius" id="selected-theta-length" value="${selectedObj.geometry.parameters.thetaLength}" step="0.001" min="0" max="3.142">
                  </div>
                  <div class="dim-input">
                    <label>WidthSegments</label>
                    <input type="number" name="selected-radius" id="selected-segments-width" value="${selectedObj.geometry.parameters.widthSegments}" step="1" min="3" max="32">
                  </div>
                  <div class="dim-input">
                    <label>HeightSegments</label>
                    <input type="number" name="selected-radius" id="selected-segments-height" value="${selectedObj.geometry.parameters.heightSegments}" step="1" min="2" max="16">
                  </div>
                </div>
              </div>
            </div>
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
        case "cylinder":
          html = `
            <div class="container" id="selected-obj-selected">
              <p class="container-p">Cylinder</p>
              <div class="dimensions">
                <p>Properties</p>
                <div class="dimension-inputs" id="dimension-inputs">
                  <div class="dim-input">
                    <label for="radiusTop">RadiusTop</label>
                    <input type="number" name="selected-cylinder" id="selected-radiusTop" value="${
                      selectedObj.geometry.parameters.radiusTop
                    }" step="0.5" min="0.5" max="50">
                  </div>
                  <div class="dim-input">
                    <label for="radiusBottom">RadiusBottom</label>
                    <input type="number" name="selected-cylinder" id="selected-radiusBottom" value="${
                      selectedObj.geometry.parameters.radiusBottom
                    }" step="0.5" min="0.5" max="50">
                  </div>
                  <div class="dim-input">
                    <label for="height">Height</label>
                    <input type="number" name="selected-cylinder" id="selected-height" value="${
                      selectedObj.geometry.parameters.height
                    }" step="1" min="1" max="50">
                  </div>
                  <div class="dim-input">
                    <label for="radialSegments">RadialSegments</label>
                    <input type="number" name="selected-cylinder" id="selected-radialSegments" value="${
                      selectedObj.geometry.parameters.radialSegments
                    }" step="1" min="3" max="50">
                  </div>
                  <div class="dim-input">
                    <label for="openEnded">OpenEnded</label>
                    <input type="checkbox" name="selected-cylinder" id="selected-openEnded" ${
                      selectedObj.geometry.parameters.openEnded ? "checked" : ""
                    }>
                  </div>
                </div>
              </div>
            </div>
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
        case "capsule":
          html = `
            <div class="container" id="selected-obj-selected">
              <p class="container-p">Capsule</p>
              <div class="dimensions">
                <p>Properties</p>
                <div class="dimension-inputs" id="dimension-inputs">
                  <div class="dim-input">
                    <label for="radius">Radius</label>
                    <input type="number" name="selected-capsule" id="selected-radiusCap" value="${selectedObj.geometry.parameters.radius}" step="0.5" min="0.5" max="30">
                  </div>
                  <div class="dim-input">
                    <label for="length">Length</label>
                    <input type="number" name="selected-capsule" id="selected-lengthCap" value="${selectedObj.geometry.parameters.length}" step="0.5" min="1" max="30">
                  </div>
                  <div class="dim-input">
                    <label for="capSegments">CapSegments</label>
                    <input type="number" name="selected-capsule" id="selected-capSegmentsCap" value="${selectedObj.geometry.parameters.capSegments}" step="1" min="1" max="32">
                  </div>
                  <div class="dim-input">
                    <label for="radialSegments">RadialSegments</label>
                    <input type="number" name="selected-capsule" id="selected-radialSegmentsCap" value="${selectedObj.geometry.parameters.radialSegments}" step="1" min="3" max="64">
                  </div>
                </div>
              </div>
            </div>
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
        case "multiple":
        case "buffer":
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
          <div class="container" id="selected-obj-selected">
            <p class="container-p">Cube</p>
            <div class="dimensions">
              <p>Dimensions</p>
              <div class="dimension-inputs" id="selected-dimension-inputs">
                <div class="dim-input">
                  <label for="x-dim">X</label>
                  <input type="number" name="selected-dimensions" id="selected-x-dim" value="${Math.floor(
                    selectedObj.geometry.parameters.width
                  )}" step="1" min="1" max="50">
                </div>
                <div class="dim-input">
                  <label for="y-dim">Y</label>
                  <input type="number" name="selected-dimensions" id="selected-y-dim" value="${Math.floor(
                    selectedObj.geometry.parameters.height
                  )}" step="1" min="1" max="50">
                </div>
                <div class="dim-input">
                  <label for="z-dim">Z</label>
                  <input type="number" name="selected-dimensions" id="selected-z-dim" value="${Math.floor(
                    selectedObj.geometry.parameters.depth
                  )}" step="1" min="1" max="50">
                </div>
              </div>
            </div>
          </div>
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
      case "sphere":
        html = `
          <div class="container" id="selected-obj-selected">
            <p class="container-p">Sphere</p>
            <div class="dimensions">
              <p>Properties</p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label for="radius">Radius</label>
                  <input type="number" name="selected-radius" id="selected-radius" value="${selectedObj.geometry.parameters.radius}" step="0.5" min="0.5" max="50.5">
                </div>
                <div class="dim-input">
                  <label for="thetaLength">ThetaLength</label>
                  <input type="number" name="selected-radius" id="selected-theta-length" value="${selectedObj.geometry.parameters.thetaLength}" step="0.001" min="0" max="3.142">
                </div>
                <div class="dim-input">
                  <label>WidthSegments</label>
                  <input type="number" name="selected-radius" id="selected-segments-width" value="${selectedObj.geometry.parameters.widthSegments}" step="1" min="3" max="32">
                </div>
                <div class="dim-input">
                  <label>HeightSegments</label>
                  <input type="number" name="selected-radius" id="selected-segments-height" value="${selectedObj.geometry.parameters.heightSegments}" step="1" min="2" max="16">
                </div>
              </div>
            </div>
          </div>
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
      case "cylinder":
        html = `
          <div class="container" id="selected-obj-selected">
            <p class="container-p">Cylinder</p>
            <div class="dimensions">
              <p>Properties</p>
              <div class="dimension-inputs" id="dimension-inputs">
                <div class="dim-input">
                  <label for="radiusTop">RadiusTop</label>
                  <input type="number" name="selected-cylinder" id="selected-radiusTop" value="${
                    selectedObj.geometry.parameters.radiusTop
                  }" step="0.5" min="0.5" max="50">
                </div>
                <div class="dim-input">
                  <label for="radiusBottom">RadiusBottom</label>
                  <input type="number" name="selected-cylinder" id="selected-radiusBottom" value="${
                    selectedObj.geometry.parameters.radiusBottom
                  }" step="0.5" min="0.5" max="50">
                </div>
                <div class="dim-input">
                  <label for="height">Height</label>
                  <input type="number" name="selected-cylinder" id="selected-height" value="${
                    selectedObj.geometry.parameters.height
                  }" step="1" min="1" max="50">
                </div>
                <div class="dim-input">
                  <label for="radialSegments">RadialSegments</label>
                  <input type="number" name="selected-cylinder" id="selected-radialSegments" value="${
                    selectedObj.geometry.parameters.radialSegments
                  }" step="1" min="3" max="50">
                </div>
                <div class="dim-input">
                  <label for="openEnded">OpenEnded</label>
                  <input type="checkbox" name="selected-cylinder" id="selected-openEnded" ${
                    selectedObj.geometry.parameters.openEnded ? "checked" : ""
                  }>
                </div>
              </div>
            </div>
          </div>
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
      case "capsule":
        html = `
            <div class="container" id="selected-obj-selected">
              <p class="container-p">Capsule</p>
              <div class="dimensions">
                <p>Properties</p>
                <div class="dimension-inputs" id="dimension-inputs">
                  <div class="dim-input">
                    <label for="radius">Radius</label>
                    <input type="number" name="selected-capsule" id="selected-radiusCap" value="${selectedObj.geometry.parameters.radius}" step="0.5" min="0.5" max="30">
                  </div>
                  <div class="dim-input">
                    <label for="length">Length</label>
                    <input type="number" name="selected-capsule" id="selected-lengthCap" value="${selectedObj.geometry.parameters.length}" step="0.5" min="1" max="30">
                  </div>
                  <div class="dim-input">
                    <label for="capSegments">CapSegments</label>
                    <input type="number" name="selected-capsule" id="selected-capSegmentsCap" value="${selectedObj.geometry.parameters.capSegments}" step="1" min="1" max="32">
                  </div>
                  <div class="dim-input">
                    <label for="radialSegments">RadialSegments</label>
                    <input type="number" name="selected-capsule" id="selected-radialSegmentsCap" value="${selectedObj.geometry.parameters.radialSegments}" step="1" min="3" max="64">
                  </div>
                </div>
              </div>
            </div>
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
