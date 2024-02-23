import { nameConverter } from "./nameConverter.js";

describe("name converter", () => {
  it("BoxGeometry to cube", () => {
    expect(nameConverter("BoxGeometry")).toBe("cube");
  });

  it("SphereGeometry to sphere", () => {
    expect(nameConverter("SphereGeometry")).toBe("sphere");
  });

  it("BufferGeometry to buffer", () => {
    expect(nameConverter("BufferGeometry")).toBe("buffer");
  });

  it("CylinderGeometry to cylinder", () => {
    expect(nameConverter("CylinderGeometry")).toBe("cylinder");
  });

  it("CapsuleGeometry to capsule", () => {
    expect(nameConverter("CapsuleGeometry")).toBe("capsule");
  });

  it("Random value to nothing", () => {
    expect(nameConverter("dww0")).toBe(undefined);
    expect(nameConverter(550)).toBe(undefined);
    expect(nameConverter(true)).toBe(undefined);
    expect(nameConverter([])).toBe(undefined);
    expect(nameConverter({ hi: "hi" })).toBe(undefined);
  });
});
