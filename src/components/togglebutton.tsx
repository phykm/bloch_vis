import React from "react";
import { useState } from "react";

const ToggleButton: React.FC = () => {
    // ボタンの状態を管理するためにuseStateフックを使用
    const [isOn, setIsOn] = useState<boolean>(false);

    // ボタンがクリックされたときに呼び出される関数
    const handleClick = () => {
      setIsOn(!isOn); // 現在の状態を反転させる
    };
  
    return (
      <button onClick={handleClick} style={{
        backgroundColor: isOn ? 'green' : 'red',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}>
        {isOn ? 'ON' : 'OFF'}
      </button>
    );
}

export default ToggleButton;

// TODO、状態遷移アニメーションを開始するためのボタン。
// 標示テキストとかもpropにするとかする。