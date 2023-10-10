import * as THREE from 'three';

export const eventListeners = (menu, canvas, worlds) => {  
  document.getElementById('menu-ui').addEventListener('input', (e) => {
    // IF NOT ROBUST ENOUGH ADD AN HTML TAG CHECK BEFORE PASSING INFO

    menu.action({ 
      name: e.target.name, 
      checked: e.target.checked,
      value: e.target.value,
    }, menu.currentWorld);
  })
  
  // document.getElementById('objects').addEventListener('click', (e) => {
  //   // IF NOT ROBUST ENOUGH ADD AN HTML TAG CHECK BEFORE PASSING INFO

  //   if (
  //     e.target.name !== "dimensions" ||
  //     e.target.name !== "eye" ||
  //     e.target.name !== "transforms"
  //   ) {
  //     menu.action({ 
  //       name: e.target.name, 
  //       checked: e.target.checked,
  //       value: e.target.value,
  //     }, menu.currentWorld);
  //   }
  // })
  
  document.getElementById('mode-ui').addEventListener('click', (e) => {
    const buttonId = e.target.id

    e.target.parentNode.childNodes.forEach(element => {
      element.className = ''
    })
    e.target.className = "selected-mode"

    // Changing the mode
    menu.modeChange(buttonId, worlds[buttonId])

    reassigningModeEventListeners(menu)
    reassigningObjectEventListeners(menu)
  })

  // document.getElementById('selected-obj').addEventListener('input', e => {
  //   e.target.value <= 0 ? e.target.value = 1 : null
  //   e.target.value >= 50 ? e.target.value = 50 : null

  //   menu.action({ 
  //     name: e.target.name, 
  //     checked: null,
  //     dimension: e.target.id,
  //     value: e.target.value,
  //   }, menu.currentWorld);
  // }) 

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

export const reassigningModeEventListeners = (menu) => {
  // Readding info window close event listener
  document.getElementById("info-close")?.addEventListener('click', e => {
    menu.showInfo()
  })

  // Readding study mode eye input change event listener
  // document.getElementById('eye-inputs')?.addEventListener('input', e => {
  //   e.target.value <= -50 ? e.target.value = -50 : null
  //   e.target.value >= 50 ? e.target.value = 50 : null

  //   menu.action({ 
  //     name: "eye", 
  //     checked: null,
  //     value: e.target.value,
  //   }, menu.currentWorld);
  // })

  // Readding editor mode dimension input change event listener 
  // document.getElementById('selected-obj')?.addEventListener('input', e => {
  //   e.target.value <= 0 ? e.target.value = 1 : null
  //   e.target.value >= 50 ? e.target.value = 50 : null
    
  //   console.log("selected event");

  //   menu.action({ 
  //     name: e.target.name, 
  //     checked: null,
  //     dimension: e.target.id,
  //     value: e.target.value,
  //   }, menu.currentWorld);
  // })
  
  // Readding study mode transform input change event listener
  // document.getElementById('transform-inputs')?.addEventListener('input', e => {
  //   e.target.value <= -50 ? e.target.value = -50 : null
  //   e.target.value >= 50 ? e.target.value = 50 : null

  //   console.log("transform event");

  //   menu.action({ 
  //     name: "transform", 
  //     checked: null,
  //     value: e.target.value,
  //   }, menu.currentWorld);
  // })
}

export const reassigningObjectEventListeners = (menu) => {
  document.getElementById("btn-translate")?.addEventListener("click", () => {
    const transformX = Number(document.getElementById("transform-x").value)
    const transformY = Number(document.getElementById("transform-y").value)
    const transformZ = Number(document.getElementById("transform-z").value)
    const translate = new THREE.Vector3(transformX, transformY, transformZ)

    menu.currentWorld.studyObject.mesh.position.add(translate)
  })
  
  document.getElementById("btn-scale")?.addEventListener("click", () => {
    const scaleX = Number(document.getElementById("transform-x").value)
    const scaleY = Number(document.getElementById("transform-y").value)
    const scaleZ = Number(document.getElementById("transform-z").value)
    const scale = new THREE.Vector3(scaleX, scaleY, scaleZ)
    const translate = new THREE.Vector3(scaleX / 2, scaleY / 2, scaleZ / 2)
    
    menu.currentWorld.studyObject.mesh.scale.add(scale)
    menu.currentWorld.studyObject.mesh.position.add(translate)
  })

  document.getElementById("btn-rotate")?.addEventListener("click", (e) => {
    const rotateX = Number(document.getElementById("transform-x").value)
    const rotateY = Number(document.getElementById("transform-y").value)
    const rotateZ = Number(document.getElementById("transform-z").value)
    const valueX = rotateX * (Math.PI / 180)
    const valueY = rotateY * (Math.PI / 180)
    const valueZ = rotateZ * (Math.PI / 180)
    
    menu.currentWorld.studyObject.mesh.rotateX(valueX)
    menu.currentWorld.studyObject.mesh.rotateY(valueY)
    menu.currentWorld.studyObject.mesh.rotateZ(valueZ)
  })
}