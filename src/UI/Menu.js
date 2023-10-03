import { Block } from "../objects/interactive/block";

export class Menu {
  constructor(sceneObject) {
    // STORE ALL BLOCKS IN AN ARRAY HERE

    this.currentMode = "editor";
    this.sceneObject = sceneObject
    this.currentBlock = new Block(null, null, 1, 1, 1, 0x5544AA, "Basic", true)
  
    // Accessing all necessary handles in the menu 
    const menuWindow = document.querySelector(".menu")
    const modeSection = document.querySelector(".modes")
    this.floorTiles = document.getElementById("floor-tile").checked
    this.axisHelper = document.getElementById("axis-helper").checked

    if (this.floorTiles) {
      sceneObject.addObject(this.sceneObject.gridHelper)
    }
    if (this.axisHelper) {
      sceneObject.addObject(this.sceneObject.axesHelper)
    }
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
        let newBlock
        const x = Number(document.getElementById("x-dim").value)
        const y = Number(document.getElementById("y-dim").value)
        const z = Number(document.getElementById("z-dim").value)
        const object = document.getElementById("objects").value

        switch (object) {
          case "cube":
            newBlock = new Block(null, null, x, y, z, 0x5544AA, "Basic", true)
        }
        // Removing old placeholder object and adding a new one
        this.sceneObject.scene.remove(worldObject.placeholderBlock.mesh)

        this.currentBlock = newBlock
        worldObject.updatePlaceholderBlock(newBlock)
        
        this.sceneObject.addObject(newBlock.mesh)
        break;
    }
  }
}


