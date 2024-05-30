import { PositionsBuffer } from "./positionsbuffer";

let b = new PositionsBuffer(5);
b.append(1,2,3)
console.log(p(b.getBuffer()))
b.append(11,12,13)
console.log(p(b.getBuffer()))
b.append(21,22,23)
console.log(p(b.getBuffer()))
b.append(31,32,33)
console.log(p(b.getBuffer()))
b.append(41,42,43)
console.log(p(b.getBuffer()))
b.append(51,52,53)
console.log(p(b.getBuffer()))
b.append(61,62,63)
console.log(p(b.getBuffer()))
b.append(71,72,73)
console.log(p(b.getBuffer()))

function p(array: Float32Array): string {
  return Array.from(array).map(num => num.toFixed(2)).join(', ');
}