const NRINTERSECTS = 25;
const NRRHYTHMPLANES = 200;
const NRATOMS = NRINTERSECTS + NRRHYTHMPLANES;

class VLine extends Cell {
    constructor(parent) {
        super();
        this.type = "VLine";
        this.parent = parent;
        let x = int(random(this.parent.xMin + 5, this.parent.xMax + 5));
        let y;
        if (this.parent.type == "Canvas")
            y = int(random(this.parent.minY(x) + 5, this.parent.maxY(x) - 5));
        else
            y = int(random(this.parent.yMin + 5, this.parent.yMax - 5));
        this.xMin = x - 5 - int(random(5));
        this.xMax = x + 4 + int(random(6));
        if (this.prob(0.05)) {
            this.xMin -= int(random(8, 15));
            this.xMax += int(random(8, 15));
        }
        this.yMin = y - 1;
        this.yMax = y + 1;
        this.clr = new Color(YELLOW);
        this.hori = false;
        this.vert = true;
        this.stoppi = this.prob(0.80);
        this.epsilon = 0;
        this.age = 0;
        this.activation = 300;
        this.midlifetrigger = this.activation + 1000;
    }

    setxy(x, y) {
        this.xMin = x - 8 - int(random(4));
        this.xMax = x + 7 + int(random(4));
        this.yMin = y - 1;
        this.yMax = y + 1;
    }

    prep() {
        this.cells = new Array(NRATOMS);
    }

    setup() {
        for (let i = 0; i < NRRHYTHMPLANES; i++) {
            let a = new Atom(this);
            a.clr.color_6(RED, YELLOW, BLUE, WHITE, GRIS, NAVY);
            a.xMin = this.xCtr() - 2;
            a.xMax = this.xCtr() + 3;
            let y = int(random(this.parent.yMin + 1, this.parent.yMax - 1));
            a.yMin = y - 1;
            a.yMax = y + 1;
            a.hori = true;
            a.verti = true;
            a.stoppi = true;
            a.epsilon = (this.xMax - this.xMin) / 7;
            a.ratio = 0.5;
            this.insert(a);
        }
        this.purge1();
        this.purge2();
    }

    purge1() {
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells.length; j++) {
                let ci = this.cells[i];
                let cj = this.cells[j];
                if (i != j && ci != null && cj != null) {
                    if ((!cj.biparental() && abs(ci.yCtr() - cj.yCtr()) < ci.epsilon + cj.epsilon)
                        || (cj.biparental() && abs(ci.yCtr() - cj.yCtr()) < (cj.coparent.yMax - cj.coparent.yMin) + ci.epsilon))
                        if (!this.cells[i].biparental())
                            this.cells[i] = null;
                }
            }
        }
    }

    purge2() {
        if (this.parent.type == "Canvas")
            if (this.cells != null)
                for (let i = 0; i < this.cells.length; i++)
                    if (this.cells[i] != null)
                        if (this.cells[i].xMax < this.parent.minX(this.cells[i].yCtr()) ||
                            this.cells[i].xMin > this.parent.maxX(this.cells[i].yCtr()))
                            this.cells[i] = null;
    }

    purge3() {
        for (let i = 0; i < this.cells.length; i++) {
            if ((this.cells[i] != null && (this.cells[i].xMax - this.cells[i].xMin + 1) < 0.90 * (this.xMax - this.xMin))
                && (this.cells[i].coparent == null || (this.cells[i].xMax - this.cells[i].xMin + 1) < 0.90 * (this.cells[i].coparent.xMax - this.cells[i].coparent.xMin))
            ) this.cells[i] = null;
        }
    }

    trigger() {
        this.purge3();
        this.compress();
    }
}