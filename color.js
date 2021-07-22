class Color {
    constructor(r, g, b, a = 1) {
        this.r = 255; /* goes from 0 to 255 */
        this.g = 255; /* goes from 0 to 255 */
        this.b = 255; /* goes from 0 to 255 */
        this.a = 1; /* alpha  goes from 0 to 1 */
        this.setRgb(r, g, b, a);
    }
    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    setAlpha(alpha) {
        if (alpha > 1.0)
            alpha = 1.0;
        if (alpha < 0)
            alpha = 0.0;
        this.a = alpha;
    }
    setHex(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            this.r = parseInt(result[1], 16);
            this.g = parseInt(result[2], 16);
            this.b = parseInt(result[3], 16);
        }
    }
    getRgbA() {
        return 'rgba(' + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
    getHex() {
        return '#' + this.componentToHex(this.r) + this.componentToHex(this.g) + this.componentToHex(this.b);
    }
    setRgb(r, g, b, a = 1) {
        this.r = r % 256;
        this.g = g % 256;
        this.b = b % 256;
        if (a > 1.0) {
            a = 1.0;
        }
        if (a < 0.0) {
            a = 0.0;
        }
        this.a = a;
    }
}
