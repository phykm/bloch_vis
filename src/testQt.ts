// testQuaternion.ts

import Complex from "complex.js";


//複素３次元ベクトル
class Vec3 {
  x:Complex;
  y:Complex;
  z:Complex;

  constructor(x:Complex,y:Complex,z:Complex) {
    this.x=x;
    this.y=y;
    this.z=z;
  }
  conjugate(): Vec3 {
    return new Vec3(
        this.x.conjugate(),
        this.y.conjugate(),
        this.z.conjugate(),
    );
  }

  prod(other:Vec3): Complex {
    return Complex(0,0)
      .add(this.x.mul(other.x))
      .add(this.y.mul(other.y))
      .add(this.z.mul(other.z))
  }

  cross(other:Vec3): Vec3 {
    return new Vec3(
      Complex(0,0)
      .add(this.y.mul(other.z))
      .sub(this.z.mul(other.y)),
      Complex(0,0)
      .add(this.z.mul(other.x))
      .sub(this.x.mul(other.z)),
      Complex(0,0)
      .add(this.x.mul(other.y))
      .sub(this.y.mul(other.x))
    )
  }

  add(other:Vec3): Vec3 {
    return new Vec3(
      this.x.add(other.x),
      this.y.add(other.y),
      this.z.add(other.z)
    )
  }

  sub(other:Vec3): Vec3 {
    return new Vec3(
      this.x.sub(other.x),
      this.y.sub(other.y),
      this.z.sub(other.z)
    )
  }

  coeff(coeff:Complex): Vec3 {
    return new Vec3(
      coeff.mul(this.x),
      coeff.mul(this.y),
      coeff.mul(this.z),
    )
  }

  toString(): string {
    return `(${this.x.toString()}) + (${this.y.toString()}) + (${this.z.toString()})`;
  }
  
}

// パウリ行列による複素2*2行列の計算代行
class Mat2 {
  id: Complex;
  v: Vec3

  constructor(id: Complex,v:Vec3) {
      this.id = id;
      this.v = v;
  }

  add(other: Mat2): Mat2 {
      return new Mat2(
          this.id.add(other.id),
          this.v.add(other.v)
      );
  }

  mul(other: Mat2): Mat2 {
      return new Mat2(
        this.id.mul(other.id).add(this.v.prod(other.v)),
        this.v.cross(other.v).coeff(Complex(0,1)).add(this.v.coeff(other.id)).add(other.v.coeff(this.id))
      );
  }

  conjugate(): Mat2 {
      return new Mat2(
        this.id.conjugate(),
        this.v.conjugate()
      );
  }

  toString(): string {
      return `(${this.id.toString()})I + (${this.v.toString()})S`;
  }
}

// 使用例
const q1 = new Mat2(new Complex(1, 0), new Vec3(new Complex(0, 1), new Complex(1, -1), new Complex(0, 0)));
const q2 = new Mat2(new Complex(0, 1), new Vec3(new Complex(1, 0), new Complex(0, 1), new Complex(1, -1)));

const q3 = q1.add(q2);
console.log(`Sum: ${q3.toString()}`);

const q4 = q1.mul(q2);
console.log(`Product: ${q4.toString()}`);

const q5 = q1.conjugate();
console.log(`Conjugate: ${q5.toString()}`);
