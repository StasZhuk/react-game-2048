import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

export default class Field extends Component {
    static defaultProps = {
        cells: [],
    };

    render() {
        const { cells, powerIsActive, handleCellClick } = this.props;

        return ( 
          <FieldTag>
            <Background className="background"> 
              {
                Array.from(new Array(16), (_, i) => i).map(i => ( <BackgroundCell key = { i }/>))
              }
            </Background>
            <Playground>
              {
                cells.map(({ id, x, y, value, state }) => {
                  return ( 
                    <Cell
                        data-active={false} 
                        key={ id }
                        x={ x }
                        y={ y }
                        value={ value }
                        className="cell"
                        data-cell="width"
                        state={ state }
                        powerIsActive={ powerIsActive }
                        onClick={handleCellClick}
                    >
                        <CellNumm>
                          { value }
                        </CellNumm>
                    </Cell>
                  );
                })
              }
            </Playground>
          </FieldTag>
        );
    }
}

const increaseCell = keyframes`
  0%, 40% { width: 23%; padding-top: 23% }
  60% { width: 24%; padding-top: 24% }
  90%, 100% { width: 23%; padding-top: 23% }
`;

const dieingCell = keyframes`
  0% { opacity: 1 }
  100% { opacity: 0.5 }
`;

const newCell = keyframes`
  0% { opacity: 0;
  }
  100% { opacity: 1;
  }
`;


const Background = styled.div `
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  background-color: #613942;
  justify-content: space-between;
  align-content: space-between;
`;

const Playground = styled.div `
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
`;

const FieldTag = styled.div `
  padding-top: calc(100% - 20px);
  max-height: 400px;
  position: relative;
  max-width: 400px;
  width: 100%;
  border: 10px solid #613942;
`;

const BackgroundCell = styled.div `
  max-height: 0;
  max-width: 100px;
  width: 23%;
  padding-top: 23%;
  position: relative;
  border-radius: 10px;
  background-color: #e8dbcb;
  color: #613942;
`;

const Cell = BackgroundCell.extend `
  display: flex;
  justify-content: center;
  align-content: center;
  position: absolute;
  padding-top: 21.4%;
  width: 23%;
  line-height: 100px;
  transform: 
    translate(${({ x }) => {
      return  window.innerWidth <= 400 ? ((window.innerWidth - 20) * (0.08 / 3) + (window.innerWidth - 64) * 0.23) * x : 97.54 * x}
    }px,
    ${({ y }) => {
      return  window.innerWidth <= 400 ? ((window.innerWidth - 20) * (0.08 / 3) + (window.innerWidth - 64) * 0.23) * y : 97.54 * y}
    }px);
  animation: ${({ state }) => {
    if (state === 'INCRISE') return `${increaseCell} 0.1s ease-in-out forwards running`; 
    if (state === 'DIEING') return `${dieingCell} 0.1s ease-in forwards running`; 
    if (state === 'NEW') return `${newCell} 0.1s ease-in forwards running`;
    return 'unset';

  }};
  text-align: center;
  transform-origin: center;
  transition: transform 0.1s ease-in-out, opacity 0.1s ease-in-out, border-color 0.3s ease-in-out;
  font-weight: 600;
  background-color: ${({ value }) => backgroundColorCalc(value)};
  border: ${({ powerIsActive }) => powerIsActive ? '3px solid #1e9eb4' : '3px solid transparent'};
  z-index: ${({ state }) => {
    let idx = 5;

    switch (state) {
      case 'IDLE':
        idx = 5;
        break;
      case 'DIEING':
        idx = 1;
        break;
      case 'MOVING':
        idx = 8;
        break;
      default:
        idx = 5;
        break;
    }
    return idx;
  }};
  font-size: ${({ value }) => {
    let size = 40;

    switch (value.toString().length) {
      case 1:
        size = 30;
        break;
      case 2:
        size = 28;
        break;
      case 3:
        size = 24;
        break;
      case 4:
        size = 20;
        break;
      case 5:
        size = 16;
        break;
      default:
        size = 36;
        break;
    }
    return size;
  }}px;

  &.active {
    border-color: red;
  }
`;

const CellNumm = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`

const backgroundColorCalc = value => {
    if (value === 0) return 'transparent';

    const step = Math.min(16, Math.log2(value));

    return `hsl(25, ${saturationCalc(step)}%, ${lightnesCalc(step)}%)`;
};

const saturationCalc = step => Math.floor(100 / 16 * step);

const lightnesCalc = step => 100 - Math.floor(50 / 9 * step);