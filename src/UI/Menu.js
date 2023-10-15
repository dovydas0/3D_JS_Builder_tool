import { Cube } from "../objects/interactive/Cube";
import { Cylinder } from "../objects/interactive/Cylinder";
import { Sphere } from "../objects/interactive/Sphere";
import { changeInfo } from "./changeInfo"
import { changeMenu } from "./changeMenu"
import { changeObjectMenu } from "./changeObjectMenu"
import { reassigningObjectEventListeners } from "../utilities/populateEventListeners"

export class Menu {
  constructor(worldObject, placeholderObject) {
    // STORE ALL BLOCKS IN AN ARRAY HERE
    this.currentMode = "editor";
    this.currentWorld = worldObject
    this.currentScene = worldObject.scene
    this.menuParameterCapture = {
      study: {},
      editor: {},
      play: {},
      craft: {},
    }
    

    this.currentObject = placeholderObject.object
    this.currentObjectColor = placeholderObject.color 
    // Set all menu parameters to local variables for easier object manipulation
    // this.currentObjectForm
    // this.currentObjectX
    // this.currentObjectY
    // this.currentObjectZ
    
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
    changeMenu(mode, this.menuParameterCapture)
    changeInfo(mode)

    // Adding/removing placeholder block depending on the selected mode
    if (mode === "editor") {
      this.action({name: "objects", value: "cube"}, world);
    } else {
      if (previousWorld?.placeholderObject?.mesh) {
        previousWorld.removeObject(previousWorld.placeholderObject.mesh)
      }
    }

    // Resetting study object
    if (mode === "study") {
      const studyObjectColor = this.menuParameterCapture[mode].color ? 
        this.menuParameterCapture[mode].color
        :
        this.currentWorld.studyObjectColor

      const defaultCube = new Cube("object", 1, 1, 1, studyObjectColor, "Lambert")
      
      if (defaultCube?.mesh) {
        defaultCube.mesh.position.set(0.5, 0.5, 0.5)
        this.currentWorld.removeObject(this.currentWorld.studyObject.mesh)
              
        this.currentWorld.updateStudyObject(defaultCube)
        this.currentWorld.addObject(defaultCube.mesh)
      }
    }
  }

  previousModeSnapshot(prevMode) {
    switch (prevMode) {
      case "editor":
        const floorTilesEditor = document.getElementById("floor-tile")?.checked
        const axisHelperEditor = document.getElementById("axis-helper")?.checked
        // const objectEditor = document.getElementById("objects")?.value
        const colorEditor = document.getElementById("color-input")?.value
        // let dimensionsEditor = {}

        // switch (objectEditor) {
        //   case "cube":
        //     const dimXEditor = document.getElementById("x-dim")?.value
        //     const dimYEditor = document.getElementById("y-dim")?.value
        //     const dimZEditor = document.getElementById("z-dim")?.value
            
        //     dimensionsEditor = {x: dimXEditor, y: dimYEditor, z: dimZEditor}
        //     break;
        //   case "sphere":
        //     const radiusEditor = Number(document.getElementById("radius")?.value)
            
        //     dimensionsEditor = { radius: radiusEditor }
        //     break;
        // }

        this.menuParameterCapture[prevMode] = {
          floorTiles: floorTilesEditor,
          axisHelper: axisHelperEditor,
          // object: objectEditor,
          // dimensions: dimensionsEditor,
          color: colorEditor
        }

        break;
      case "study":
        const rotationStudy = document.getElementById("rotation")
        const axisHelperStudy = document.getElementById("axis-helper")
        const eyeXStudy = Number(document.getElementById("eye-x")?.value)
        const eyeYStudy = Number(document.getElementById("eye-y")?.value)
        const eyeZStudy = Number(document.getElementById("eye-z")?.value)
        const objectStudy = document.getElementById("objects")?.value
        const transformXStudy = Number(document.getElementById("transform-x")?.value)
        const transformYStudy = Number(document.getElementById("transform-y")?.value)
        const transformZStudy = Number(document.getElementById("transform-z")?.value)
        const colorStudy = document.getElementById("color-input")?.value


        this.menuParameterCapture[prevMode] = {
          rotation: rotationStudy.checked,
          axisHelper: axisHelperStudy.checked,
          object: objectStudy,
          color: colorStudy,
          eye: {
            x: eyeXStudy,
            y: eyeYStudy,
            z: eyeZStudy,
          },
          transform: {
            x: transformXStudy,
            y: transformYStudy,
            z: transformZStudy,
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

  action(eventData) {
    switch (eventData.name) {
      case "rotation":
        eventData.checked === true ? 
          this.currentWorld.controls.autoRotate = true
          :
          this.currentWorld.controls.autoRotate = false
          this.currentWorld.camera.rotation.set(-0.642, 0, 0)
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
        let newCubeDim
        const xDim = Math.floor(Number(document.getElementById("x-dim").value))
        const yDim = Math.floor(Number(document.getElementById("y-dim").value))
        const zDim = Math.floor(Number(document.getElementById("z-dim").value))

        // Creating a new object and placing it into the grid, on the floor
        newCubeDim = new Cube("object", xDim, yDim, zDim, this.currentObjectColor, "Basic", true)

        // If new object created successfully
        if (newCubeDim?.mesh) {
          // Removing old placeholder object and adding a new one
          this.currentWorld.scene.remove(this.currentWorld.placeholderObject.mesh)
          
          this.currentWorld.updatePlaceholderObject(newCubeDim)
          this.currentWorld.scene.add(newCubeDim.mesh)
          this.currentObject = newCubeDim
        }
        break;
      case "radius":
        let newSphereRad
        const sphereRad = Number(document.getElementById("radius").value)

        // Creating a new object and placing it into the grid, on the floor
        newSphereRad = new Sphere("object", sphereRad, this.currentObjectColor, "Basic", true)

        // If new object created successfully
        if (newSphereRad?.mesh) {
          // Removing old placeholder object and adding a new one
          this.currentWorld.scene.remove(this.currentWorld.placeholderObject.mesh)
          
          this.currentWorld.updatePlaceholderObject(newSphereRad)
          this.currentWorld.scene.add(newSphereRad.mesh)
          this.currentObject = newSphereRad
        }
        break;
      case "objects":
        if (this.currentMode === "editor") {
          let newObject
          
          switch (eventData.value) {
            case "cube":
              // Changing the menu UI and reading the inputs
              changeObjectMenu(eventData.value, this.currentMode, this.menuParameterCapture)
              const x = Math.floor(Number(document.getElementById("x-dim").value))
              const y = Math.floor(Number(document.getElementById("y-dim").value))
              const z = Math.floor(Number(document.getElementById("z-dim").value))
              
              // Creating a new object and placing it into the grid, on the floor
              newObject = new Cube("object", x, y, z, this.currentObjectColor, "Basic", true)
              newObject.mesh.position.set(0.5, 0.5, 0.5)
              break;
            case "sphere":
              // Changing the menu UI and reading the inputs
              changeObjectMenu(eventData.value, this.currentMode, this.menuParameterCapture)
              const radius = Number(document.getElementById("radius").value)
              
              // Creating a new object and placing it into the grid, on the floor
              newObject = new Sphere("object", radius, this.currentObjectColor, "Basic", true)
              newObject.mesh.position.set(0.5, 0.5, 0.5)

              break;
            case "cylinder":
              // newObject = new Cylinder("object", 1, 1, 1, 0x5544AA, "Basic", true)
              // changeObjectMenu(eventData.value, this.currentMode, this.menuParameterCapture)
              break;
          }

          // If new object created successfully
          if (newObject?.mesh) {
            // Removing old placeholder object and adding a new one
            this.currentWorld.scene.remove(this.currentWorld.placeholderObject.mesh)
            
            this.currentWorld.updatePlaceholderObject(newObject)
            this.currentWorld.scene.add(newObject.mesh)
            this.currentObject = newObject
          }
        } else if (this.currentMode === "study") {
          let newObject
          
          switch (eventData.value) {
            case "cube":
              changeObjectMenu(eventData.value, this.currentMode, this.menuParameterCapture)
              
              // Creating a new object and placing it into the grid, on the floor
              newObject = new Cube("object", 1, 1, 1, this.currentWorld.studyObjectColor, "Lambert")
              newObject.mesh.position.set(0.5, 0.5, 0.5)
              break;
            case "sphere":
              changeObjectMenu(eventData.value, this.currentMode, this.menuParameterCapture)
              
              // Creating a new object and placing it into the grid, on the floor
              newObject = new Sphere("object", 0.5, this.currentWorld.studyObjectColor, "Lambert")
              newObject.mesh.position.set(0.5, 0.5, 0.5)
              break;
            case "cylinder":
              changeObjectMenu(eventData.value, this.currentMode, this.menuParameterCapture)
                
              // Creating a new object and placing it into the grid, on the floor
              newObject = new Cylinder("object", 0.5, 0.5, 1, this.currentWorld.studyObjectColor, "Lambert")
              newObject.mesh.position.set(0.5, 0.5, 0.5)
              break;
          }

          // Reassinging parameter buttons event listeners
          reassigningObjectEventListeners(this)

          // If new object created successfully
          if (newObject?.mesh) {
            // Removing old placeholder object and adding a new one
            this.currentWorld.removeObject(this.currentWorld.studyObject.mesh)
            
            this.currentWorld.updateStudyObject(newObject)
            this.currentWorld.addObject(newObject.mesh)
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
            newObjectTransform = new Cube("object", xTrans, yTrans, zTrans, this.currentObjectColor, "Lambert")
            newObjectTransform.mesh.position.addScalar(0.5)
            break;
          case "sphere":
            newObjectTransform = new Sphere("object", 2, this.currentObjectColor, "Lambert")
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
          // Removing old object and adding a new one
          this.currentWorld.removeObject(this.currentWorld.studyObject.mesh)

          this.currentWorld.updateStudyObject(newObjectTransform)
          this.currentWorld.addObject(newObjectTransform.mesh)
        }
        break;
      case "eye":
        const xEye = Number(document.getElementById("eye-x").value)
        const yEye = Number(document.getElementById("eye-y").value)
        const zEye = Number(document.getElementById("eye-z").value)
        
        this.currentWorld.camera.position.set(xEye, yEye, zEye)
        break;
      case "color-picker":
        const colorInput = document.getElementById("color-input")

        this.currentObject.material.color.set(eventData.value)
        this.currentObjectColor = eventData.value
        
        colorInput.value = eventData.value

        break;
      case "color-picker-study":
        const colorInputStudy = document.getElementById("color-input")

        this.currentWorld.studyObject.material.color.set(eventData.value)
        this.currentWorld.studyObjectColor = eventData.value
        
        colorInputStudy.value = eventData.value

        break;

      case "segments":
        const segmentWidth = document.getElementById("segments-width")?.value
        const segmentheight = document.getElementById("segments-height")?.value
        
        const newSphere = new Sphere("object", 0.5, this.currentWorld.studyObjectColor, "Lambert", false, segmentWidth, segmentheight)
        newSphere.mesh.position.set(0.5, 0.5, 0.5)

        // If new object created successfully
        if (newSphere?.mesh) {
          // Removing old placeholder object and adding a new one
          this.currentWorld.removeObject(this.currentWorld.studyObject.mesh)
          
          this.currentWorld.updateStudyObject(newSphere)
          this.currentWorld.addObject(newSphere.mesh)
        }

        break;
    }
  }

}


