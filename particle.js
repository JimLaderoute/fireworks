const DEFAULT_RADIUS = 10;
const DEFAULT_MAX_RADIUS = 100;
const DEFAULT_MIN_RADIUS = 1;
const DEFAULT_LIFESPAN = 200;
class Particle {
    constructor(initial_forces, initial_r, initial_shrink_r, initial_color) {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.initial_r = 0;
        this.r = 0;
        this.initial_shrink_r = 0;
        this.friction = 1;
        this.mass = 1;
        this.lifespan = DEFAULT_LIFESPAN;
        this.min_r = 0;
        this.max_r = 0;
        this.shrink_r = 0; // shrink rate of object being drawn
        this.init_color = new Color(initial_color.r, initial_color.g, initial_color.b, initial_color.a);
        this.initial_r = initial_r;
        this.initial_shrink_r = initial_shrink_r;
        this.shrink_r = initial_shrink_r;
        this.color = new Color(initial_color.r, initial_color.g, initial_color.b, initial_color.a);
        //console.log("initial_forces line 25 ", initial_forces);
        this.initial_forces = initial_forces.slice(); // copy
        //console.log("inital_forces of this ",this.initial_forces);
        this.reset();
    }
    reset() {
        this.color.setHex(this.init_color.getHex());
        this.r = this.initial_r;
        this.min_r = DEFAULT_MIN_RADIUS;
        this.max_r = DEFAULT_MAX_RADIUS;
        this.shrink_r = this.initial_shrink_r;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.friction = 1;
        this.mass = 1;
        this.lifespan = DEFAULT_LIFESPAN;
        this.initial_forces.forEach(force => {
            this.applyForce(force);
        });
    }
    setInitAlpha(alpha) {
        this.init_color.setAlpha(alpha);
    }
    setColor(alpha) {
        this.color.setAlpha(alpha);
    }
    applyForce(f) {
        if (f.random_ang) {
            f.ang = Math.random() * Math.PI * 2 - 2 * Math.random() * Math.PI;
        }
        if (f.random_f) {
            f.newtons = Math.random();
        }
        let acc = f.newtons / this.mass;
        acc += f.acc;
        acc *= 1 / this.friction;
        this.vx += Math.cos(f.ang) * acc;
        this.vy -= Math.sin(f.ang) * acc;
    }
    is_dead() {
        return this.lifespan <= 0 || this.r < this.min_r || this.r > this.max_r;
    }
    update() {
        if (this.is_dead()) {
            this.reset();
            return;
        }
        this.lifespan -= 1;
        this.r -= this.shrink_r;
        if (this.r > this.max_r) {
            this.r = this.max_r;
        }
        if (this.r < this.min_r) {
            this.r = this.min_r;
        }
        this.x += this.vx;
        this.y += this.vy;
    }
    draw(ctx, dx, dy) {
        if (this.is_dead()) {
            return;
        }
        ctx.fillStyle = this.color.getRgbA();
        ctx.beginPath();
        ctx.arc(Math.trunc(this.x + dx), Math.trunc(this.y + dy), Math.trunc(this.r), 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        //console.log("fillStyle: " + ctx.fillStyle);
    }
}
