import Complex from "complex.js";
import { Mat2 } from "./calcMat2";

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

// 誤差が蓄積してBloch球を超過していたら縮小する
export const normalize = (r:Mat2) => {
 // TODO
}