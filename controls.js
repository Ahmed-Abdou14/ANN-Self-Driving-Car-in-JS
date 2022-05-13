class Controls {
    constructor(type) {
        this.forward = false;
        this.right = false;
        this.reverse = false;
        this.left = false;

        switch(type){
            case 'keys':
                this.#addKeyboardListeners();
                break;
            case 'dummy':
                this.forward = true;
        }
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
            switch(event.key) {
                case 'ArrowUp': case 'w': 
                    this.forward = false;
                    break;
                case 'ArrowRight': case 'd': 
                    this.right = false;
                    break;
                case 'ArrowDown': case 's': 
                    this.reverse = false;
                    break;
                case 'ArrowLeft': case 'a': 
                    this.left = false;
                    break;
            }
        }
    }
}