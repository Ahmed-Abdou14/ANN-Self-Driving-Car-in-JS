const canvas = document.getElementById('appCanvas');
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const car = new Car(canvas.width*0.5, canvas.height*0.8, 30, 50);

render();
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
    
    car.update();
    car.draw(ctx);

    requestAnimationFrame(render);
}