import Complex from 'complex.js';
import React from 'react';

interface ComplexMatrixProps {
  matrix: Complex[][];
}

const MatrixShow: React.FC<ComplexMatrixProps> = ({ matrix }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <div>(</div>
      <div style={{ display: 'flex', flexDirection: 'column', margin: '0 10px' }}>
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', flexDirection: 'row' }}>
            {row.map((value, colIndex) => (
              <div
                key={colIndex}
                style={{
                  width: '50px',
                  textAlign: 'center',
                  border: '1px solid black',
                  padding: '5px'
                }}
              >
                {value.toString()}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>)</div>
    </div>
  );
};

export default MatrixShow;