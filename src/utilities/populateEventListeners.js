export default (menu, worldObject, canvas, scenes) => {
  document.getElementById('dimension-inputs').addEventListener('input', e => {
    e.target.value <= 0 ? e.target.value = 1 : null
    e.target.value >= 50 ? e.target.value = 50 : null
      
    menu.action({ 
      name: "dimensions", 
      checked: null,
      value: e.target.value,
    }, worldObject);
  }) 
  
  document.getElementById('menu-ui').addEventListener('click', (e) => {
    // IF NOT ROBUST ENOUGH ADD AN HTML TAG CHECK BEFORE PASSING INFO
  
    if (e.target.name !== "dimensions") {
      menu.action({ 
        name: e.target.name, 
        checked: e.target.checked,
        value: e.target.value,
      }, worldObject);
    }
  })
  
  document.getElementById('mode-ui').addEventListener('click', (e) => {
    const buttonId = e.target.id

    e.target.parentNode.childNodes.forEach(element => {
      element.className = ''
    })
    e.target.className = "selected-mode"

    // Changing the mode
    menu.modeChange(buttonId, scenes[buttonId])
    // worldObject.initWorld(scenes[buttonId])
    // console.log(menu.currentScene.scene.children);
  
    // Adding/removing placeholder block depending on the selected mode
    if (buttonId === "editor") {
      menu.action({name: "objects"}, worldObject);
    } else {
      menu.currentScene.removeObject(worldObject.placeholderObject.mesh)
    }

    // Readding info window close event listener
    document.getElementById("info-close")?.addEventListener('click', e => {
      menu.showInfo()
    })
  })
  
  document.getElementById("info").addEventListener('click', e => {
    menu.showInfo()
  })
  
  document.getElementById("info-close").addEventListener('click', e => {
    menu.showInfo()
  })
  
  window.addEventListener('resize', () => {
    canvas.camera.aspect = window.innerWidth / window.innerHeight;
    canvas.camera.updateProjectionMatrix();
    canvas.renderer.setSize(window.innerWidth, window.innerHeight);
  })  
}