export class Menu {
  constructor(sceneObject) {
    this.currentMode = "editor";
    this.sceneObject = sceneObject

    // Accessing all necessary handles in the menu 
    const menuWindow = document.querySelector(".menu")
    const modeSection = document.querySelector(".modes")
    this.floorTiles = document.getElementById("floor-tile").checked

    if (this.floorTiles) {
      sceneObject.addObject(this.sceneObject.gridHelper)
    }

    modeSection.childNodes.forEach((item) => {
      if (item.tagName) {
        item.addEventListener('click', (e) => {
          e.target.parentNode.childNodes.forEach(element => {
            element.className = ''
          })
          this.currentMode = item.id
          e.target.className = "selected-mode"
        })
      }
    })
  }

  // Fix double running this method on click
  update() {
    this.floorTiles = document.getElementById("floor-tile").checked

    if (this.floorTiles) {
      console.log('adding floor grid');
      this.sceneObject.addObject(this.sceneObject.gridHelper)
    } else {
      console.log('removing floor grid');
      this.sceneObject.removeObject(this.sceneObject.gridHelper)
    }
  }
}


