import { models } from "../../predefined_models/predefined_models";
const modelData = [];

export const populatePredefinedModels = () => {
  const predefinedEl = document.getElementById("predefined-models");

  models.forEach((model) => {
    const container = document.createElement("div");
    const name = document.createElement("p");
    const img = document.createElement("img");

    img.src = model.image;
    name.textContent = model.name;
    container.id = model.id;

    container.classList.add("predefined-container");
    name.classList.add("predefined-name");
    img.classList.add("predefined-img");

    container.appendChild(img);
    container.appendChild(name);
    predefinedEl.appendChild(container);

    modelData.push({ id: model.id, data: model.data });
  });

  return modelData;
};

export const grabPredefinedData = (id) => {
  return modelData.filter((model) => model.id === id);
};
