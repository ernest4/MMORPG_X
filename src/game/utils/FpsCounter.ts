class FpsCounter {
  fpsElement: HTMLSpanElement;
  lastDeltaTime: number;

  constructor() {
    this.fpsElement = document.createElement("span");
    this.fpsElement.style.cssText = `
      top: 0px;
      background: white;
      position: fixed;
    `;
    document.body.appendChild(this.fpsElement);

    this.lastDeltaTime = 0;
  }

  update = (deltaTime: number) => {
    this.lastDeltaTime += deltaTime;

    if (125 < this.lastDeltaTime) {
      this.lastDeltaTime = 0;
      this.fpsElement.innerHTML = Math.floor(1000 / deltaTime).toString();
    }
  };
}

export default FpsCounter;
