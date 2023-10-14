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
  }

  previousModeSnapshot(prevMode) {
    switch (prevMode) {
      case "study":
        const rotation = document.getElementById("rotation")
        const axisHelper = document.getElementById("axis-helper")
        const object = document.getElementById("objects")?.value
        const eyeX = Number(document.getElementById("eye-x")?.value)
        const eyeY = Number(document.getElementById("eye-y")?.value)
        const eyeZ = Number(document.getElementById("eye-z")?.value)
        const transformX = Number(document.getElementById("transform-x")?.value)
        const transformY = Number(document.getElementById("transform-y")?.value)
        const transformZ = Number(document.getElementById("transform-z")?.value)
    
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
        newCubeDim = new Cube("object", xDim, yDim, zDim, 0x5544AA, "Basic", true)

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
        newSphereRad = new Sphere("object", sphereRad, 0x5544AA, "Basic", true)

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
              newObject = new Cube("object", x, y, z, 0x5544AA, "Basic", true)
              newObject.mesh.position.set(0.5, 0.5, 0.5)
              break;
            case "sphere":
              // Changing the menu UI and reading the inputs
              changeObjectMenu(eventData.value, this.currentMode, this.menuParameterCapture)
              const radius = Number(document.getElementById("radius").value)
              
              // Creating a new object and placing it into the grid, on the floor
              newObject = new Sphere("object", radius, 0x5544AA, "Basic", true)
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
          // Reading the inputs
          const x = Number(document.getElementById("transform-x")?.value)
          const y = Number(document.getElementById("transform-y")?.value)
          const z = Number(document.getElementById("transform-z")?.value)
          let newObject

          // x === 0 ? x = 1 : null
          // y === 0 ? y = 1 : null
          // z === 0 ? z = 1 : null
          
          switch (eventData.value) {
            case "cube":
              changeObjectMenu(eventData.value, this.currentMode, this.menuParameterCapture)
              
              
              // Creating a new object and placing it into the grid, on the floor
              newObject = new Cube("object", 1, 1, 1, 0x5544AA, "Lambert")
              newObject.mesh.position.set(0.5, 0.5, 0.5)
              break;
            case "sphere":
              changeObjectMenu(eventData.value, this.currentMode, this.menuParameterCapture)
              
              // Creating a new object and placing it into the grid, on the floor
              newObject = new Sphere("object", 0.5, 0x5544AA, "Lambert")
              newObject.mesh.position.set(0.5, 0.5, 0.5)
              break;
            case "cylinder":
              changeObjectMenu(eventData.value, this.currentMode, this.menuParameterCapture)
                
              // Creating a new object and placing it into the grid, on the floor
              newObject = new Cylinder("object", 0.5, 0.5, 1, 0x5544AA, "Lambert")
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
            newObjectTransform = new Cube("object", xTrans, yTrans, zTrans, 0x5544AA, "Lambert")
            newObjectTransform.mesh.position.addScalar(0.5)
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
        this.currentObject.material.color.set(eventData.value)
        this.currentObjectColor = eventData.value
        break;
    }
  }

}


