import { HyperLindbladian, expDevelop } from './calcLindblad';
import { Mat2, Vec3 } from './calcMat2';
import Complex from 'complex.js';

export const testLB1 = HyperLindbladian(
  new Mat2(Complex(0,0),new Vec3(Complex(0,0),Complex(0,0),Complex(1,0))),
  new Mat2(Complex(0,0),new Vec3(Complex(0,0),Complex(0,0),Complex(0,0)))
)

export const testLB2 = HyperLindbladian(
  new Mat2(Complex(0,0),new Vec3(Complex(0,0),Complex(0,0),Complex(0,0))),
  new Mat2(Complex(0,0),new Vec3(Complex(1,0),Complex(0,1),Complex(0,0)))
)

// Lindblad指数写像の動作チェック。
let dm = new Mat2(Complex(1,0),new Vec3(Complex(1,0),Complex(0,0),Complex(0,0)))
for (let i=0;i<200;i++) {
  let dm_ = expDevelop(dm,testLB1,0.05*i);
  console.log(dm_.v.toString());
}
for (let i=0;i<200;i++) {
  let dm_ = expDevelop(dm,testLB2,0.05*i);
  console.log(dm_.v.toString());
}



