class Car {
    #controls;
    angle; #speed; #acceleration; #maxSpeed; #friction; #rotatingAngleConst;
    constructor(x,y,width,height, controlType, maxSpeed = 3) {
        this.x = x; //center of the car horizontally
        this.y = y; //center of the car vertically
        this.width = width;
        this.height = height

        this.polygon = [];

        this.#speed = 0;
        this.#maxSpeed = maxSpeed;

        this.#acceleration = 0.2;
        this.#friction = this.#acceleration/4;

        this.angle = 0;
        this.#rotatingAngleConst = 0.03;

        this.useBrain = controlType == 'AI';
        if(['keys', 'AI'].indexOf(controlType) !== -1){
            this.sensors = new Sensor(this);
            this.brain = new NeuralNetwork([
                this.sensors.rayCount, 6, 4
            ]);
        }
        this.#controls = new Controls(controlType);

        this.damaged = false;
    }

    update(roadBoarders, traffic) {
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBoarders, traffic);
        }
        if(this.sensors) {
            this.sensors.update(roadBoarders, traffic);
            const offsets = this.sensors.readings.map(
                s => s==null? 0: 1-this.sensors.offset
            );
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);

            if(this.useBrain) {
                [
                    this.#controls.forward,
                    this.#controls.left,
                    this.#controls.right,
                    this.#controls.reverse
                ] = outputs;
            }
        }
    }

    #assessDamage(roadBoarders, traffic) {
        for (const border of roadBoarders)
            if(polysIntersect(this.polygon, border))
                return true;
        for (const vehicle of traffic)
            if(polysIntersect(this.polygon, vehicle.polygon))
                return true;
        return false;
    }

    #move() {
        if(this.#controls.forward) this.#accelerate();
        if(this.#controls.reverse) this.#decelerate();
        if(this.#speed !==0) {
            //if speed < 0, we are going backwards, so flip steering to imitate rl
            const mirrorSteeringMult = this.#speed > 0? 1: -1;
            if(this.#controls.right) this.angle -= this.#rotatingAngleConst * mirrorSteeringMult
            if(this.#controls.left) this.angle += this.#rotatingAngleConst * mirrorSteeringMult
        }
        this.x -= Math.sin(this.angle)*this.#speed; //sign the angle returns the horizontal legnth
        this.y -= Math.cos(this.angle)*this.#speed;
    }

    #createPolygon() {
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);
        return [
            {
                x : this.x  - Math.sin(this.angle - alpha) * rad,
                y : this.y  - Math.cos(this.angle - alpha) * rad
            },
            {
                x : this.x  - Math.sin(this.angle + alpha) * rad,
                y : this.y  - Math.cos(this.angle + alpha) * rad
            },
            {
                x : this.x  - Math.sin(Math.PI + this.angle - alpha) * rad,
                y : this.y  - Math.cos(Math.PI + this.angle - alpha) * rad
            },
            {
                x : this.x  - Math.sin(Math.PI + this.angle + alpha) * rad,
                y : this.y  - Math.cos(Math.PI + this.angle + alpha) * rad
            },
        ];
    }

    draw(ctx, color, hasSensor = false) {
        ctx.fillStyle = this.damaged? '#880227': color;
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if(hasSensor) this.sensors?.draw(ctx);
    }

    #accelerate() {
        this.#setSpeed(Math.min(this.#speed + this.#acceleration, this.#maxSpeed));
    }
    #decelerate() {
        const minSpeed = -this.#maxSpeed/2;
        this.#setSpeed(Math.max(this.#speed - this.#acceleration, minSpeed));
    }
    #setSpeed(speed) {
        if(Math.abs(speed) < this.#friction) this.#speed = 0;
        else if(speed < 0) this.#speed = speed + this.#friction;
        else this.#speed = speed - this.#friction;
    }
}