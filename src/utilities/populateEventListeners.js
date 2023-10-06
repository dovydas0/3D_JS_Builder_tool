export default (menu, canvas, worlds) => {
  document.getElementById('dimension-inputs').addEventListener('input', e => {
    e.target.value <= 0 ? e.target.value = 1 : null
    e.target.value >= 50 ? e.target.value = 50 : null

    menu.action({ 
      name: "dimensions", 
      checked: null,
      value: e.target.value,
    }, menu.currentWorld);
  }) 
  
  document.getElementById('menu-ui').addEventListener('click', (e) => {
    // IF NOT ROBUST ENOUGH ADD AN HTML TAG CHECK BEFORE PASSING INFO
  
    if (
      e.target.name !== "dimensions" ||
      e.target.name !== "eye" ||
      e.target.name !== "transforms"
    ) {
      menu.action({ 
        name: e.target.name, 
        checked: e.target.checked,
        value: e.target.value,
      }, menu.currentWorld);
    }
  })
  
  document.getElementById('mode-ui').addEventListener('click', (e) => {
    const buttonId = e.target.id

    e.target.parentNode.childNodes.forEach(element => {
      element.className = ''
    })
    e.target.className = "selected-mode"

    // Changing the mode
    menu.modeChange(buttonId, worlds[buttonId])

    reassigningEventListeners(menu)
  })
  
  document.getElementById("info").addEventListener('click', e => {
    menu.showInfo()
  })
  
  document.getElementById("info-close").addEventListener('click', e => {
    menu.showInfo()
  })
  
  window.addEventListener('resize', () => {
    menu.currentWorld.camera.aspect = window.innerWidth / window.innerHeight;
    menu.currentWorld.camera.updateProjectionMatrix();
    canvas.renderer.setSize(window.innerWidth, window.innerHeight);
  })  
}

const reassigningEventListeners = (menu) => {
  // Readding info window close event listener
  document.getElementById("info-close")?.addEventListener('click', e => {
    menu.showInfo()
  })

  // Readding editor mode dimension input change event listener 
  document.getElementById('dimension-inputs')?.addEventListener('input', e => {
    e.target.value <= 0 ? e.target.value = 1 : null
    e.target.value >= 50 ? e.target.value = 50 : null
    
    menu.action({ 
      name: "dimensions", 
      checked: null,
      value: e.target.value,
    }, menu.currentWorld);
  })

  // Readding study mode eye input change event listener
  document.getElementById('eye-inputs')?.addEventListener('input', e => {
    e.target.value <= -50 ? e.target.value = -50 : null
    e.target.value >= 50 ? e.target.value = 50 : null

    menu.action({ 
      name: "eye", 
      checked: null,
      value: e.target.value,
    }, menu.currentWorld);
  })

  // Readding study mode transform input change event listener
  document.getElementById('transform-inputs')?.addEventListener('input', e => {
    e.target.value <= -50 ? e.target.value = -50 : null
    e.target.value >= 50 ? e.target.value = 50 : null

    menu.action({ 
      name: "transform", 
      checked: null,
      value: e.target.value,
    }, menu.currentWorld);
  })
}