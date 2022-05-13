const carCanvas = document.getElementById('roadCanvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width*.9);

const N = 150;
//const car = new Car(road.getLaneCenter(), carCanvas.height*0.8, 30, 50, 'AI');
const cars = generateTraffic(N)
let leadingCar = cars[0];
const bestBrain = localStorage.getItem('bestBrain');
if(bestBrain){
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(bestBrain);
        if(i!==0) NeuralNetwork.mutate(cars[i].brain, 0.2)
    }
} 

const traffic = [
    new Car(road.getLaneCenter(0), -300, 30, 50, 'dummy', 2),
    new Car(road.getLaneCenter(1), -100, 30, 50, 'dummy', 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, 'dummy', 2),
];

render();

function save() {
    localStorage.setItem(
        'bestBrain', JSON.stringify(leadingCar.brain)
    );
}
function discard() {
    localStorage.removeItem('bestBrain');
}

function generateTraffic(N) {
    const cars = [];
    for(let i = 0; i < N; i ++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
    }
    return cars;
}

function render(time) {
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    traffic.forEach(vehicle => vehicle.update(road.borders, []));
    cars.forEach(car => car.update(road.borders, traffic));
    
    leadingCar = cars.find(
        c => c.y == Math.min(...cars.map(c => c.y))
    );

    carCtx.save();
    carCtx.translate(0, carCanvas.height * 0.75 -leadingCar.y)

    road.draw(carCtx);    
    traffic.forEach((vehicle) => vehicle.draw(carCtx, '#2E8BC0'));
    carCtx.globalAlpha = 0.2;
    cars.forEach((car) => car.draw(carCtx));
    carCtx.globalAlpha = 1;
    leadingCar.draw(carCtx, '#020227', true)

    carCtx.restore();

    networkCtx.lineDashOffset = -time/50
    Visualizer.drawNetwork(networkCtx, leadingCar.brain);
    requestAnimationFrame(render);
}