import React, { useCallback, useEffect, useState } from "react";

interface InputNumberProps {
  value: number
  onChange: (v:number)=> void
  placeHolder: string
}

const InputNumber : React.FC<InputNumberProps> = ({value , onChange, placeHolder}) => {
  const [innerValue, setInnerValue] = useState(value.toString());
  const callback = useCallback((value_s: string)=>{
    let newValue = parseFloat(value_s);
    if (isNaN(newValue)) {
      // 不正なので通知しない。手元だけ更新して編集は許す。
      setInnerValue(value_s);
      return;
    }
    setInnerValue(value_s);
    onChange(newValue);
  },[setInnerValue]);
  const restoreValidValue = useCallback(()=>{
    setInnerValue(value.toString());
  },[value]);
  useEffect(()=>{
    setInnerValue(value.toString());
  },[value])
  return(
    <input
      className="input-number"
      type="number"
      step="0.02"
      value={innerValue}
      onChange={(e) => callback(e.target.value)}
      onBlur={restoreValidValue}
      placeholder={placeHolder}
  />);
};

export default InputNumber;