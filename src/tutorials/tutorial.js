export class tutorial {
  #endBtnFunc = () => {
    this.endTutorial();
  };

  #prevBtnFunc = () => {
    this.previousStep();
  };

  #nextBtnFunc = () => {
    this.nextStep();
  };

  constructor(model) {
    this.model = model;
    this.currentInstruction = model[0];
    this.inProgress = false;
    this.instructionBoxLeft = null;
    this.instructionBoxRight = null;

    this.initializeInstructionBox();
  }

  initializeInstructionBox() {
    this.instructionBoxLeft = document.createElement("div");
    this.instructionBoxRight = document.createElement("div");
    const headerArea = document.createElement("div");
    const textnButtons = document.createElement("div");
    const textArea = document.createElement("div");
    const buttonArea = document.createElement("div");
    const previousButton = document.createElement("button");
    const nextButton = document.createElement("button");
    const endButton = document.createElement("button");

    previousButton.textContent = "Previous";
    nextButton.textContent = "Next";
    endButton.textContent = "End";

    // Adding classes/ids to html elements
    previousButton.id = "instruction-previous-btn";
    nextButton.id = "instruction-next-btn";
    endButton.id = "instruction-end-btn";
    headerArea.className = "instruction-header";
    headerArea.id = "instruction-header";
    textnButtons.className = "instruction-bottom";
    textnButtons.id = "instruction-bottom";
    textArea.className = "instruction-text";
    textArea.id = "instruction-text";
    buttonArea.className = "instruction-buttons";
    buttonArea.id = "instruction-buttons";
    this.instructionBoxLeft.id = "instruction-box";
    this.instructionBoxLeft.classList.add("instruction-box");
    this.instructionBoxRight.id = "instruction-box-right";
    this.instructionBoxRight.classList.add("instruction-box-right");

    // Copy of content to the right instruction box
    const headerAreaRight = headerArea.cloneNode(true);

    // Adding html elements to each other and to the main instruction box
    this.instructionBoxLeft.appendChild(headerArea);
    this.instructionBoxRight.appendChild(headerAreaRight);
    buttonArea.appendChild(endButton);
    buttonArea.appendChild(previousButton);
    buttonArea.appendChild(nextButton);
    textnButtons.appendChild(textArea);
    textnButtons.appendChild(buttonArea);

    // Copy of content to the right instruction box
    const textnbuttonsRight = textnButtons.cloneNode(true);

    this.instructionBoxLeft.appendChild(textnButtons);
    this.instructionBoxRight.appendChild(textnbuttonsRight);
  }

  displayInstruction() {
    // adding instruction box to the dom
    const body = document.getElementsByTagName("body");

    // Adding left or right dialog box depending on the property
    switch (this.currentInstruction.boxArrowSide) {
      case "left":
        body[0].appendChild(this.instructionBoxLeft);

        // Setting position and size
        this.instructionBoxLeft.style.top =
          this.currentInstruction.position.top;
        if (this.currentInstruction.position.left) {
          this.instructionBoxLeft.style.right = null;
          this.instructionBoxLeft.style.left =
            this.currentInstruction.position.left;
        } else {
          this.instructionBoxLeft.style.left = null;
          this.instructionBoxLeft.style.right =
            this.currentInstruction.position.right;
        }

        this.instructionBoxLeft.style.width =
          this.currentInstruction.size.width;
        this.instructionBoxLeft.style.height =
          this.currentInstruction.size.height;
        break;
      case "right":
        body[0].appendChild(this.instructionBoxRight);

        // Setting position and size
        this.instructionBoxRight.style.top =
          this.currentInstruction.position.top;
        if (this.currentInstruction.position.left) {
          this.instructionBoxRight.style.left =
            this.currentInstruction.position.left;
        } else {
          this.instructionBoxRight.style.right =
            this.currentInstruction.position.right;
        }

        this.instructionBoxRight.style.width =
          this.currentInstruction.size.width;
        this.instructionBoxRight.style.height =
          this.currentInstruction.size.height;
        break;
    }

    const headerArea = document.getElementById("instruction-header");
    const textArea = document.getElementById("instruction-text");

    // Adding instruction box text
    headerArea.textContent = "Android Robot Tutorial";
    textArea.textContent = this.currentInstruction.instructions;

    // event listeners
    this.addButtonEventListeners();
  }

  removeInstruction() {
    switch (this.currentInstruction.boxArrowSide) {
      case "left":
        const instructionBox = document.getElementById("instruction-box");
        instructionBox.remove();
        break;
      case "right":
        const instructionBoxRight = document.getElementById(
          "instruction-box-right"
        );
        instructionBoxRight.remove();
        break;
    }
  }

  addButtonEventListeners() {
    const prevBtn = document.getElementById("instruction-previous-btn");
    const nextBtn = document.getElementById("instruction-next-btn");
    const endBtn = document.getElementById("instruction-end-btn");

    endBtn.addEventListener("click", this.#endBtnFunc);
    prevBtn.addEventListener("click", this.#prevBtnFunc);
    nextBtn.addEventListener("click", this.#nextBtnFunc);
  }

  nextStep() {
    // if the next instruction exists
    if (this.model[this.currentInstruction.step + 1]) {
      this.removeInstruction(); // remove the instruction window
      // Change instruction
      this.currentInstruction = this.model[this.currentInstruction.step + 1];
      this.displayInstruction(); // display the instruction window
    }
  }

  previousStep() {
    // if the previous instruction exists
    if (this.model[this.currentInstruction.step - 1]) {
      this.removeInstruction(); // remove the instruction window
      // Change instruction
      this.currentInstruction = this.model[this.currentInstruction.step - 1];
      this.displayInstruction(); // display the instruction window
    }
  }

  restartTutorial() {
    this.currentInstruction = this.model[0];
  }

  endTutorial() {
    this.removeInstruction(); // remove the instruction window
    this.inProgress = false;
    this.currentInstruction = this.model[0];
  }
}
