import { models } from "../../predefined_models/predefined_models";

export const populatePredefinedModels = () => {
  const predefinedEl = document.getElementById("predefined-models");

  models.forEach((model) => {
    const name = document.createElement("p");
    // const img = document.createElement("img");
    // img.src = model.image;

    name.textContent = model.name;

    predefinedEl.appendChild(name);
  });
};
