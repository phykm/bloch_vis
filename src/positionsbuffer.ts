// 軌道を描かせるためのringedbuffer
export class PositionsBuffer {
  body: Float32Array
  logicalsize: number
  old: number // 最も古い位置
  new: number // 次に書き込む位置
  writed: boolean // 
  constructor(size:number) {
    this.body = new Float32Array(3 * size);
    this.logicalsize  = size;
    this.old = 0;
    this.new = 0;
    this.writed = false;
  }

  append = (x:number,y:number,z:number)=>{
    if (this.old == this.new && this.writed) {
      // 一回以上書き込みが発生したあとでold == newの場合はfullになってる。oldを一つ捨てる。
      // 最初の一回だけは空なので、oldは動かさない。
      this.old = (this.old+1) % this.logicalsize;  
    }
    this.body.set([x,y,z],this.new * 3);
    this.new = (this.new+1) % this.logicalsize;
    this.writed = true; // old置き去りは一回のみ。
    return this;
  }

  filledSize = () => {
    if (this.writed) {
      if (this.new === this.old) {
        return this.logicalsize;
      }
      return (this.new - this.old + this.logicalsize) % this.logicalsize;
    } else {
      return 0;
    }
  }
  // attributebufferに食わせるように組み替えて投げる。
  getBuffer() {
    if (!this.writed) {
      return new Float32Array();
    }
    const size = this.filledSize();
    const result = new Float32Array(size * 3);
    if (this.new > this.old) {
      result.set(this.body.subarray(this.old * 3, this.new * 3));
    } else {
      const part1 = this.body.subarray(this.old * 3);
      const part2 = this.body.subarray(0, this.new * 3);
      result.set(part1);
      result.set(part2, part1.length);
    }
    return result;
  }
}