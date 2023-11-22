import * as THREE from "three";

export const eventListeners = (menu, canvas, worlds) => {
  // Covers every input in left menu UI
  document.getElementById("menu-ui").addEventListener("input", (e) => {
    // IF NOT ROBUST ENOUGH ADD AN HTML TAG CHECK BEFORE PASSING INFO

    menu.action({
      name: e.target.name,
      checked: e.target.checked,
      value: e.target.value,
    });
  });

  document.getElementById("menu-bar").addEventListener("click", (e) => {
    // IF NOT ROBUST ENOUGH ADD AN HTML TAG CHECK BEFORE PASSING INFO

    menu.action({
      name: e.target.name,
      checked: e.target.checked,
      value: e.target.value,
    });
  });

  document.getElementById("scene-outline").addEventListener("click", (e) => {
    // console.log(e.target.dataset);
    menu.action({
      name: "scene",
      dataset: e.target.dataset,
      value: e.target.id,
      element: e.target,
      ctrl: e.ctrlKey,
    });
  });

  document.getElementById("mode-ui").addEventListener("click", (e) => {
    const buttonId = e.target.id;

    e.target.parentNode.childNodes.forEach((element) => {
      element.className = "";
    });
    e.target.className = "selected-mode";

    // Changing the mode
    menu.modeChange(buttonId, worlds[buttonId]);

    reassigningModeEventListeners(menu);
    reassigningObjectEventListeners(menu);
  });

  document.getElementById("info").addEventListener("click", () => {
    menu.showInfo();
  });

  document.getElementById("info-close").addEventListener("click", () => {
    menu.showInfo();
  });

  window.addEventListener("resize", () => {
    menu.currentWorld.camera.aspect = window.innerWidth / window.innerHeight;
    menu.currentWorld.camera.updateProjectionMatrix();
    canvas.renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

export const reassigningModeEventListeners = (menu) => {
  // Readding info window close event listener
  document.getElementById("info-close")?.addEventListener("click", (e) => {
    menu.showInfo();
  });

  document.getElementById("add-object")?.addEventListener("click", (e) => {
    menu.action({
      name: "add-object",
      value: e.target.id,
      ctrl: e.ctrlKey,
    });
  });

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
};

export const reassigningObjectEventListeners = (menu) => {
  document.getElementById("btn-translate")?.addEventListener("click", () => {
    const transformX = Number(document.getElementById("transform-x").value);
    const transformY = Number(document.getElementById("transform-y").value);
    const transformZ = Number(document.getElementById("transform-z").value);
    const translate = new THREE.Vector3(transformX, transformY, transformZ);

    if (menu.selectedObjects.length > 0) {
      menu.selectedObjects.forEach((object) => {
        object.position.add(translate);
      });
    }
  });

  document.getElementById("btn-scale")?.addEventListener("click", () => {
    const scaleX = Number(document.getElementById("transform-x").value);
    const scaleY = Number(document.getElementById("transform-y").value);
    const scaleZ = Number(document.getElementById("transform-z").value);
    const scale = new THREE.Vector3(scaleX, scaleY, scaleZ);
    const translate = new THREE.Vector3(scaleX / 2, scaleY / 2, scaleZ / 2);

    if (menu.selectedObjects.length > 0) {
      menu.selectedObjects.forEach((object) => {
        object.scale.add(scale);
        object.position.add(translate);
      });
    }
  });

  document.getElementById("btn-rotate")?.addEventListener("click", (e) => {
    const rotateX = Number(document.getElementById("transform-x").value);
    const rotateY = Number(document.getElementById("transform-y").value);
    const rotateZ = Number(document.getElementById("transform-z").value);
    const valueX = rotateX * (Math.PI / 180);
    const valueY = rotateY * (Math.PI / 180);
    const valueZ = rotateZ * (Math.PI / 180);

    if (menu.selectedObjects.length > 0) {
      menu.selectedObjects.forEach((object) => {
        object.rotateX(valueX);
        object.rotateY(valueY);
        object.rotateZ(valueZ);
      });
    }
  });
};
