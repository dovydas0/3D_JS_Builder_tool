const menuWindow = document.querySelector(".menu")
const modeSection = document.querySelector(".modes")

// console.log(modeSection.childNodes);

modeSection.childNodes.forEach((item) => {
  if (item.tagName) {
    item.addEventListener('click', (e) => {
      e.target.parentNode.childNodes.forEach(element => {
        element.className = ''
      })
      e.target.className = "selected-mode"
    })
  }
})
