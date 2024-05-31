import Complex from "complex.js";
import { Mat2, Vec3 } from "./calcMat2";

export const randomH = ()=>{
  return new Mat2(Complex(0,0),new Vec3(Complex(r1(),0),Complex(r1(),0),Complex(r1(),0)))
}

export const randomL = ()=>{
  let r = r1()*0.3;
  return new Mat2(Complex(r2(r*r),r2(r*r)),new Vec3(Complex(r2(r),r2(r)),Complex(r2(r),r2(r)),Complex(r2(r),r2(r))))
}

const r1 = ()=> {
  return (Math.random() * 2) - 1;
}

const r2 = (range:number)=> {
  return (Math.random()*Math.random() * range * 2) - range;
}

export const initH = new Mat2(new Complex(0,0), new Vec3(new Complex(0,0), new Complex(0,0), new Complex(1,0)))
export const initL = new Mat2(new Complex(0,0), new Vec3(new Complex(0,0.2), new Complex(0.2,0), new Complex(0,0))) 

