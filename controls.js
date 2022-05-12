class Controls {
    constructor() {
        this.forward = false;
        this.right = false;
        this.reverse = false;
        this.left = false;

        this.#addKeyboardListeners();
    }

    #addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch(event.key) {
                case 'ArrowUp': case 'w': 
                    this.forward = true;
                    break;
                case 'ArrowRight': case 'd': 
                    this.right = true;
                    break;
                case 'ArrowDown': case 's': 
                    this.reverse = true;
                    break;
                case 'ArrowLeft': case 'a': 
                    this.left = true;
                    break;
            }
        }

        document.onkeyup = (event) => {
            this.forward = this.right = this.reverse = this.left = false;
        }
    }

    isMoving() {
        return this.forward | this.right | this.reverse | this.left;
    }
}