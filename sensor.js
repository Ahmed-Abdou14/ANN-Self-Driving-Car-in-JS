class Sensor {
    constructor(car, rayCount = 5, rayrange = 150) {
        this.car = car;
        this.rayCount = rayCount;
        this.rayRange = rayrange;
        this.raySpread = Math.PI / 2;

        this.rays = [];
        this.readings = [];
    }

    update(roadBoarders, traffic) {
        this.#castRays();
        this.readings = [];
        this.rays.forEach((ray) => {
            this.readings.push(
                this.#getReading(ray, roadBoarders, traffic)
            );
        })
    }

    #getReading(ray, roadBoarders, traffic) {
        let detectedPoints = [];
        roadBoarders.forEach((border) => {
            const contactPoint = getIntersection(
                ray[0], ray[1],
                border[0], border[1]
            );

            if (contactPoint) detectedPoints.push(contactPoint);
        });

        traffic.forEach((vehicle) => {
            vehicle.polygon.forEach((point, i, polys) => {
                const contactPoint = getIntersection(
                    ray[0], ray[1],
                    point, polys[(i+1)%polys.length]
                );
    
                if (contactPoint) detectedPoints.push(contactPoint);
            })
        })

        if (detectedPoints.length === 0) return null;
        const minOffset = Math.min(...detectedPoints.map(p => p.offset));
        return detectedPoints.find(p => p.offset === minOffset);
    }

    #castRays() {
        this.rays = []; //list of rays to draw
        const { x, y } = this.car; //coordinates of car
        const start = { x, y };
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                -this.raySpread / 2,
                this.raySpread / 2,
                this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            const end = {
                x: start.x - Math.sin(rayAngle) * this.rayRange,
                y: start.y - Math.cos(rayAngle) * this.rayRange
            }

            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        this.rays.forEach((ray, i) => {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#FEDC00';

            ctx.moveTo(ray[0].x, ray[0].y);
            //if no reading for that ray, then use that ray's end point
            const end = this.readings[i] ?? ray[1];
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            //if there was a reading, extend the line over it with a different colored line
            if (JSON.stringify(end) == JSON.stringify(this.readings[i])) {
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#880227';
                ctx.moveTo(ray[1].x, ray[1].y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
            }
        })
    }
}