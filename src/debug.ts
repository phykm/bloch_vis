import Complex from "complex.js";
import { Mat2, Vec3 } from "./calcMat2";

// npx ts-nodeでデバッグするときのスクリプト置き場
// 使用例
const q1 = new Mat2(new Complex(1, 0), new Vec3(new Complex(0, 1), new Complex(1, -1), new Complex(0, 0)));
const q2 = new Mat2(new Complex(0, 1), new Vec3(new Complex(1, 0), new Complex(0, 1), new Complex(1, -1)));

const q3 = q1.add(q2);
console.log(`Sum: ${q3.toString()}`);

const q4 = q1.mul(q2);
console.log(`Product: ${q4.toString()}`);

const q5 = q1.conjugate();
console.log(`Conjugate: ${q5.toString()}`);