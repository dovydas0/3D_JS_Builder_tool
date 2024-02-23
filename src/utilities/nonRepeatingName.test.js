import { nonRepeatingName } from "./nonRepeatingName";

describe("nonRepeatingName", () => {
  it("should return the same name when there are no repeating names", () => {
    // Mock menu and sceneObjects
    const menu = { currentWorld: { scene: { children: [] } } };
    const sceneObjects = { children: [] };

    const name = "cube";

    const result = nonRepeatingName(name, menu, sceneObjects);

    expect(result).toEqual(name);
  });

  it("should return the name with a number appended when there is one repeating name", () => {
    // Mock menu and sceneObjects
    const menu = {
      currentWorld: { scene: { children: [{ name: "cube" }] } },
    };
    const sceneObjects = { children: [{ dataset: { obj: "cube0" } }] };

    const name = "cube";

    const result = nonRepeatingName(name, menu, sceneObjects);

    expect(result).toEqual(name + "1");
  });

  it("should return the name with a number appended when there are multiple repeating names", () => {
    // Mock menu and sceneObjects
    const menu = {
      currentWorld: {
        scene: { children: [{ name: "cube" }, { name: "cube" }] },
      },
    };
    const sceneObjects = {
      children: [{ dataset: { obj: "cube0" } }, { dataset: { obj: "cube1" } }],
    };

    const name = "cube";

    const result = nonRepeatingName(name, menu, sceneObjects);

    expect(result).toEqual(name + "2");
  });
});
