//Copyright (C) <2013> <Loe Feijs and TU/e

// const verbose = false;
// const NRINTERSECTS = 25; //safe upperbound
// const NRRHYTHMPLANES = 200; //many are purged
// const NRATOMS = NRINTERSECTS + NRRHYTHMPLANES;
class HLine extends Cell {
  //CONCEPTION
  constructor(parent) {
    super();
    this.type = "HLine";
    this.parent = parent;
    if (this.parent.type == "Canvas") {
      this.setxy(
        this.RAND2(parent.xMin + 100, this.parent.xMax - 100),
        this.RAND2(parent.yMin + 100, this.parent.yMax - 100)
      );
    } else {
      this.setxy(
        this.RAND2(parent.xMin + 10, this.parent.xMax - 10),
        this.RAND2(parent.yMin + 10, this.parent.yMax - 10)
      );
    }
    this.clr = new Color(YELLOW);
    this.hori = true;
    this.stoppi =
      Math.abs(this.yCtr() - this.parent.yCtr()) < 50 || this.PROB(0.7);
    //near this.parent.yCtr() be a stopper,
    //to prevent overruning the micros

    this.midlifetrigger = this.activation + 1000;
    this.cells = new Array(NRATOMS);
    for (var k = 0; k < this.cells.length; k++) this.cells[k] = null;
  }
  setxy(x, y) {
    this.xMin = x - 1;
    this.xMax = x + 1;
    this.yMin = y - 6 - int(random(3));
    this.yMax = y + 5 + int(random(4));
  }

  //COMPOSITION
  setup() {
    //setup: creates the internal content for this HLine,
    //fill in details of hline: the famous rhythm planes.
    //PRECONDITION: VLines of canvas to be created first.
    for (var j = 0; j < this.parent.cells.length; j++) {
      var cj = this.parent.cells[j];
      if (cj != this && cj != null && cj.type == "VLine") {
        var coparent = cj;
        var a = new Atom(this, coparent);
        coparent.insert(a);
        //atom in this HLine AND in coparent
        a.xMin = coparent.xCtr() - 1;
        a.xMax = coparent.xCtr() + 1;
        a.yMin = this.yCtr() - 1;
        a.yMax = this.yCtr() + 1;
        a.ratio = -1;
        this.insertUnique(a); //beware of the twins
      }
    }
    //fill in the internal details with a "rhythm"
    for (var i = 0; i < NRRHYTHMPLANES; i++) {
      var a = new Atom(this, null);
      a.clr = new Color(GRIS); //new Color5(RED, BLUE, WHITE, GRIS, NAVY);
      var x = int(random(this.parent.xMin, this.parent.xMax));
      var y = this.yCtr();
      a.xMin = x - 1;
      a.xMax = x + 1;
      a.yMin = y - 2;
      a.yMax = y + 2;
      a.hori = true;
      a.verti = true;
      a.stoppi = true;
      a.epsilon = (this.yMax - this.yMin) / 6;
      a.ratio = 2.0;
      this.insert(a);
    } //end for
    this.purge1();
    this.purge2();
  } //end setup

  //APOPTOSIS
  purge1() {
    //meant for a collection of Atom cells supposedly "rhytmic" on Hline
    //eliminate some of the cells inside this which are too close anyhow
    for (var i = 0; i < this.cells.length; i++) {
      for (var j = 0; j < this.cells.length; j++) {
        var ci = this.cells[i];
        var cj = this.cells[j];
        if (i != j && ci != null && cj != null)
          if (
            (!cj.biparental() &&
              abs(ci.xCtr() - cj.xCtr()) < ci.epsilon + cj.epsilon) ||
            //make sure ci has some chance of not being squeezed already in the beginning
            (cj.biparental() &&
              abs(ci.xCtr() - cj.xCtr()) <
                cj.coparent.xMax - cj.coparent.xMin + ci.epsilon)
            //meaning: keep extra distance from the intersection plane cells such as cj
          )
            if (!this.cells[i].biparental()) this.cells[i] = null;
      }
    }
    if (verbose) {
      print("HLine purge1 @");
      print(age);
    }
  } //end purge1

  purge2() {
    //eliminate atoms inside this HLine but outside the lozenge
    if (this.parent.type == "Canvas")
      if (this.cells != null)
        for (var i = 0; i < this.cells.length; i++)
          if (this.cells[i] != null)
            if (
              this.cells[i].xMax < this.parent.minX(this.cells[i].yCtr()) ||
              this.cells[i].xMin > this.parent.maxX(this.cells[i].yCtr())
            )
              this.cells[i] = null;
    if (verbose) {
      print("HLine purge2 @");
      print(age);
    }
  } //end purge2

  purge3() {
    //eliminate cells which did not reach 90% line height
    //and for intersect cells also even check their width
    //PS: warning: don't run this purge action too early.
    for (var i = 0; i < this.cells.length; i++)
      if (
        this.cells[i] != null &&
        this.cells[i].yMax - this.cells[i].yMin + 1 <
          0.9 * (this.yMax - this.yMin) &&
        (this.cells[i].coparent == null ||
          this.cells[i].yMax - this.cells[i].yMin + 1 <
            0.9 * (this.cells[i].coparent.yMax - this.cells[i].coparent.yMin))
      )
        this.cells[i] = null;
    if (verbose) {
      print("HLine purge3 @");
      print(age);
    }
  } //end purge3

  //TRIGGERED ACTION
  trigger() {
    this.purge3();
    this.compress();
  }
} //end HLine
