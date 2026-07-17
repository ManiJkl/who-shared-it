export class UI {
  constructor(rootSelector) {
    this.root = document.querySelector(rootSelector);
    if (!this.root) {
      throw new Error(`Root element not found: ${rootSelector}`);
    }
  }

  render(content) {
    this.root.classList.remove('screen-exit');
    this.root.innerHTML = content;
    this.root.classList.add('screen-enter');
    setTimeout(() => {
      this.root.classList.remove('screen-enter');
    }, 320);
    this.enableRippleButtons();
  }

  enableRippleButtons() {
    const buttons = this.root.querySelectorAll('.btn');
    buttons.forEach((button) => {
      button.classList.add('btn-ripple');
    });
  }
}
