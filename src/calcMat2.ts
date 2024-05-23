// testQuaternion.ts
import Complex from "complex.js";

//複素３次元ベクトル
export class Vec3 {
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

  // 複素数を"考慮しない"内積
  prod(other:Vec3): Complex {
    return Complex(0,0)
      .add(this.x.mul(other.x))
      .add(this.y.mul(other.y))
      .add(this.z.mul(other.z))
  }

  // 外積
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

  abs(): Complex {
    return this.conjugate().prod(this).pow(0.5)
  }

  toString(): string {
    return `(${this.x.toString()}) + (${this.y.toString()}) + (${this.z.toString()})`;
  }
  
}

// パウリ行列による複素2*2行列の計算代行
export class Mat2 {
  id: Complex; // 単位行列の係数
  v: Vec3 // パウリ行列展開したときの係数

  constructor(id: Complex,v:Vec3) {
      this.id = id;
      this.v = v;
  }

  // (1+XS)/2による状態のD^3表現.D^3に収まらない場合は収まるまで縮小される。
  densityMat(v:Vec3): Mat2 {
    var v_ = v
    let abs = v.abs()
    if (abs.re > 1) {
      v_  = v.coeff(abs.inverse())
    }
    return new Mat2(Complex(0.5,0),v_)
  }

  add(other: Mat2): Mat2 {
      return new Mat2(
          this.id.add(other.id),
          this.v.add(other.v)
      );
  }

  sub(other: Mat2): Mat2 {
    return new Mat2(
        this.id.sub(other.id),
        this.v.sub(other.v)
    );
  }

  coeff(coeff: Complex): Mat2 {
    return new Mat2(
      this.id.mul(coeff),
      this.v.coeff(coeff)
    )
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