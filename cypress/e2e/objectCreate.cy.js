describe("Successfully adding an object", () => {
  it("the cube gets successfully added to the scene", () => {
    cy.visit("http://localhost:5173/");

    cy.get("#canvas-el").should("exist");

    cy.get("#canvas-el").then(($canvas) => {
      // Get dimension of the canvas
      const { width, height } = $canvas[0];

      // Click in the center of the canvas
      cy.wrap($canvas)
        .click(width / 2, height / 2)
        .click(width / 2, height / 2 + 50)

        // Assertion logic to confirm cube addition (replace with your specific checks)
        .then(() => {
          cy.get(".group-depth-0").should("exist");
          // Add other assertions to verify cube properties (position, color, etc.)
        });
    });
  });
  it("the cube gets successfully added and removed from the scene", () => {
    cy.visit("http://localhost:5173/");

    cy.get("#canvas-el").should("exist");

    cy.get("#canvas-el").then(($canvas) => {
      // Get dimension of the canvas
      const { width, height } = $canvas[0];

      // Click in the center of the canvas
      cy.wrap($canvas).click(width / 2.5, height / 2.5);

      // Press Shift key
      cy.get("body").type("{shift}", { release: false });

      // Click in the center of the canvas
      cy.wrap($canvas).click(width / 2.5, height / 2.5);
    });

    cy.get("#scene-objects").should("have.length", 1);
  });
  it("the sphere gets successfully added to the scene", () => {
    cy.visit("http://localhost:5173/");

    cy.get("#objects").should("exist");
    cy.get("#objects").select("Sphere");

    cy.get("#canvas-el").should("exist");
    cy.get("#canvas-el").then(($canvas) => {
      // Get dimension of the canvas
      const { width, height } = $canvas[0];

      // Click in the center of the canvas
      cy.wrap($canvas)
        .click(width / 2, height / 2)
        .click(width / 2, height / 2 + 50);
    });

    cy.get(".group-depth-0").should("have.length", 2);
    cy.get('[data-obj="object-Sphere"]').should("exist");
  });
});
