export default (menu, worldObject, sceneObject, studyScene) => {
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
    e.target.parentNode.childNodes.forEach(element => {
      element.className = ''
    })
    e.target.className = "selected-mode"
    
    // Changing the mode
    menu.modeChange(e.target.id, studyScene)
  
    // Adding/removing placeholder block depending on the selected mode
    if (e.target.id === "editor") {
      menu.action({name: "objects"}, worldObject);
    } else {
      sceneObject.removeObject(worldObject.placeholderObject.mesh)
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
    sceneObject.camera.aspect = window.innerWidth / window.innerHeight;
    sceneObject.camera.updateProjectionMatrix();
    sceneObject.renderer.setSize(window.innerWidth, window.innerHeight);
  })  
}