import Complex from "complex.js";
import { create, all, Matrix } from 'mathjs';
import { Mat2, Vec3 } from "./calcMat2";

export const operateLindblad = (r:Mat2,H:Mat2,L:Mat2)=>{
  // ユニタリ部分
  let Hr = H.mul(r);
  let rH = r.mul(H);
  let comm_Hr = Hr.sub(rH);
  let _icomm_Hr = comm_Hr.coeff(Complex(0,1));

  // 挟まってるやつ
  let LrLd = L.mul(r).mul(L.conjugate());

  // 反交換子/2のやつ
  let LdL = L.conjugate().mul(L);
  let LdLr = LdL.mul(r);
  let rLdL = r.mul(LdL);
  let LdLr_p_rLdL_2 = LdLr.add(rLdL).coeff(Complex(0.5,0));

  return _icomm_Hr.add(LrLd).sub(LdLr_p_rLdL_2)
}

// 単純オイラー法で次の状態へ
export const eularLindblad = (r:Mat2,dt:number,H:Mat2,L:Mat2) => {
  return r.add(operateLindblad(r,H,L).coeff(Complex(dt,0)));
}


// やっぱやめた。超演算子の指数写像をやります。

// 以下mathjsを使った実装。complexjsをすでに使ってしまったのでコンバータ
const c = (v:Complex): math.Complex => {
  return math.complex(v.re,v.im);
}

const d = (v:math.Complex): Complex => {
  return Complex(v.re,v.im)
}

// mathコンテキスト
export const math = create(all, {});

// Mat2からのコンバータを噛ませた指数写像
export const expDevelop = (m:Mat2,generator:Matrix,t:number): Mat2 => {
  let as4Vec = math.matrix([
    [c(m.id)],
    [c(m.v.x)],
    [c(m.v.y)],
    [c(m.v.z)],
  ])
  let dev = math.multiply(math.expm(math.multiply(generator,t)),as4Vec);
  return new Mat2(d(dev.get([0,0])),new Vec3(d(dev.get([1,0])),d(dev.get([2,0])),d(dev.get([3,0]))));
}
// パウリ行列展開氏た場合の4*4リンドブラディアン
export const HyperLindbladian = (H:Mat2,L:Mat2): Matrix => {
  let V = L.v;
  let w = L.id;

  let _2K = H.v.coeff(Complex(-2,0));
  let _2K_4mat = crossAs4Matrix(_2K); // つかう

  let _2iVdxV = V.cross(V.conjugate()).coeff(Complex(0,-2));
  let _2iVdxV_4mat = vec3As4Matrix(_2iVdxV); // つかう

  let _2absV2 = V.prod(V.conjugate()).mul(Complex(-2,0));
  let _2absV2_4mat = scalarAs4Matrix(_2absV2); // つかう

  let VdV_4mat = diadAs4Matrix(V.conjugate(),V);
  let VVd_4mat = diadAs4Matrix(V,V.conjugate());
  let VdVpVVd_4mat = math.add(VdV_4mat,VVd_4mat); // つかう

  let wdV = V.coeff(w.conjugate());
  let wVd = V.conjugate().coeff(w);
  let iwdViwVd = wdV.add(wVd);
  let iwdViwVd_4mat = crossAs4Matrix(iwdViwVd); // つかう

  return math.add(_2K_4mat,_2iVdxV_4mat,_2absV2_4mat,VdVpVVd_4mat,iwdViwVd_4mat);
}

// 外積を行列として
const crossAs4Matrix = (v:Vec3): Matrix => {
  return math.matrix([
    [0,0,0,0],
    [0,0,c(v.z.mul(Complex(-1,0))),c(v.y)],
    [0,c(v.z),0,c(v.x.mul(Complex(-1,0)))],
    [0,c(v.y.mul(Complex(-1,0))),c(v.x),0],
  ]);
}

// ダイアド積を行列として
const diadAs4Matrix = (a:Vec3,b:Vec3):Matrix => {
  let a_mat = math.matrix([
    [0],
    [c(a.x)],
    [c(a.y)],
    [c(a.z)],
  ]);
  let b_t_mat = math.matrix([
    [0,c(b.x),c(b.y),c(b.z)]
  ]);
  return math.multiply(a_mat,b_t_mat);
}

// 左下ベクトル成分
const vec3As4Matrix = (v:Vec3):Matrix => {
  return math.matrix([
    [0,0,0,0],
    [c(v.x),0,0,0],
    [c(v.y),0,0,0],
    [c(v.z),0,0,0],
  ]);
}

// 1,2,3成分の単位行列×スカラー
const scalarAs4Matrix = (w:Complex):Matrix => {
  return math.matrix([
    [0,0,0,0],
    [0,c(w),0,0],
    [0,0,c(w),0],
    [0,0,0,c(w)],
  ]);
}

