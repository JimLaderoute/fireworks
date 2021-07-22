class Emitter {
    constructor(forces, nparticles, serialRelease, x, y, r, shrink_r, color) {
        this.dx = x;
        this.dy = y;
        this.initial_r = r;
        this.initial_shrink_r = shrink_r;
        this.color = new Color(color.r, color.g, color.b, color.a);
        //console.log('forces is ', forces);
        this.initial_forces = forces.slice();
        //console.log(this.initial_forces);
        this.serialRelease = serialRelease;
        this.nparticles = nparticles;
        this.particles = [];
        this.reset();
    }
    reset() {
        this.particles = [];
        if (this.serialRelease) {
            let p = new Particle(this.initial_forces, this.initial_r, this.initial_shrink_r, this.color);
            this.particles.push(p);
        }
        else {
            for (let i = 0; i < this.nparticles; i++) {
                let p = new Particle(this.initial_forces, this.initial_r, this.initial_shrink_r, this.color);
                this.particles.push(p);
            }
        }
    }
    setAlpha(alpha) {
        this.color.setAlpha(alpha);
        this.particles.forEach(particle => {
            particle.setInitAlpha(alpha);
        });
    }
    /**
        Applies a list of forces to each particle of the emitter

        @param forces An array of Force objects which will get applied to each Particle of the Emitter.

    */
    applyForce(force) {
        this.particles.forEach(particle => {
            particle.applyForce(force);
        });
    }


    // 
    // emitter nparticles 300 px 0.60 py 0.10 style burst 
    //  color 0 0 255 
    //  alpha 0.2 
    //  r 2.0 
    //  shrink -0.001 
    //  newtons 2.4 
    //  angle 90 accel 0.01 random_newtons true random_angle true
    //
    getEmitterSettings() {
        let px = this.dx / canvas.width;
        let py = this.dy / canvas.height ;
        return `emitter ` +
            `nparticles ${this.nparticles} ` +
            `px ${nf(px,1,4)} py ${nf(py,1,4)} ` +
            `r ${this.initial_r} ` +
            `style ${this.serialRelease?'serial':'burst'} ` +
            `color ${this.color.r} ${this.color.g} ${this.color.b} ` +
            `alpha ${this.color.a} ` +
            `shrink ${this.initial_shrink_r} ` +
            `newtons ${nf(this.initial_forces[0].newtons,1,2)} ` +
            `angle ${nf(this.initial_forces[0].ang,1,2)} ` +
            `accel ${this.initial_forces[0].acc} ` +
            `random_newtons ${this.initial_forces[0].random_f} ` +
            `random_angle ${this.initial_forces[0].random_ang} ` ;
    }
    update() {
        this.particles.forEach(particle => {
            particle.update();
        });
        if (this.serialRelease && this.particles.length < this.nparticles) {
            let p = new Particle(this.initial_forces, this.initial_r, this.initial_shrink_r, this.color);
            this.particles.push(p);
        }
    }
    draw(ctx) {
        this.particles.forEach(particle => {
            particle.draw(ctx, this.dx, this.dy);
        });
    }
}