class Car {
    #controls;
    #angle; #speed; #acceleration; #maxSpeed; #friction; #rotatingAngleConst;
    constructor(x,y,width,height) {
        this.x = x; //center of the car horizontally
        this.y = y; //center of the car vertically
        this.width = width;
        this.height = height

        this.#speed = 0;
        this.#maxSpeed = 3;

        this.#acceleration = 0.2;
        this.#friction = this.#acceleration/4;

        this.#angle = 0;
        this.#rotatingAngleConst = 0.03;

        this.#controls = new Controls();
    }

    update() {
        this.#move();
    }

    #move() {
        if(this.#controls.forward) this.#accelerate();
        else if(this.#controls.reverse) this.#decelerate();
        else if(this.#speed !==0) {
            //if speed < 0, we are going backwards, so flip steering to imitate rl
            const mirrorSteeringMult = this.#speed > 0? 1: -1;
            if(this.#controls.right) this.#angle -= this.#rotatingAngleConst * mirrorSteeringMult
            else if(this.#controls.left) this.#angle += this.#rotatingAngleConst * mirrorSteeringMult
        }
        this.x -= Math.sin(this.#angle)*this.#speed; //sign the angle returns the horizontal legnth
        this.y -= Math.cos(this.#angle)*this.#speed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.#angle);
        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill();
        ctx.restore(); //restores this position so that next frame does not reset
    }

    #accelerate() {
        this.#setSpeed(Math.min(this.#speed + this.#acceleration, this.#maxSpeed));
    }
    #decelerate() {
        const minSpeed = -this.#maxSpeed/2;
        this.#setSpeed(Math.max(this.#speed - this.#acceleration, minSpeed));
    }
    #setSpeed(speed) {
        if(Math.abs(speed) < this.#acceleration) this.#speed = 0;
        else if(speed < 0) this.#speed = speed + this.#friction;
        else this.#speed = speed - this.#friction;
    }
    #getTopLeftCoordinate() {
        return [this.x - this.width/2, this.y - this.height/2]
    }
}