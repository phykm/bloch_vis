import React from "react";
import { useState } from "react";

const ToggleButton: React.FC = () => {
    const [isOn, setIsOn] = useState<boolean>(false);

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
