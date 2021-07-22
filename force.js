const DEFAULT_RANDOM_F = false;
const DEFAULT_RANDOM_A = true;
class Force {
    constructor(id, newtons, ang, acc, random_f = DEFAULT_RANDOM_F, random_ang = DEFAULT_RANDOM_A) {
        this.id = "default";
        this.newtons = 0.0;
        this.ang = 0.0;
        this.acc = 0.0;
        this.random_f = DEFAULT_RANDOM_F;
        this.random_ang = DEFAULT_RANDOM_A;

        this.id = id;
        this.newtons = newtons;
        
        this.ang = ang;
        this.acc = acc;
        this.random_f = random_f;
        this.random_ang = random_ang;
        //console.log(`Force create ${id} force with newtons=${this.newtons} ang=${this.ang}`)
    }
}
