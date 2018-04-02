import React, { Component } from 'react';
import styled from 'styled-components';

export default class Field extends Component {
    static defaultProps = {
        cells: [],
    };

    render() {
        const { cells } = this.props;

        return ( 
          <FieldTag>
            <Background className="background"> 
              {
                Array.from(new Array(16), (_, i) => i).map(i => ( <BackgroundCell key = { i }/>))
              }
            </Background>
            <Playground>
              {
                cells.map(({ id, x, y, value }) => {
                  return ( 
                    <Cell 
                        key={id}
                        x={x}
                        y={y}
                        value={ value }
                        className="cell"
                        data-cell="width"
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
  max-height: 450px;
  position: relative;
  max-width: 450px;
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
  line-height: 100px;
  transform: translate(${({ x }) => window.innerWidth <= 450 ? ((window.innerWidth - 20) * (0.08 / 3) + (window.innerWidth - 40) * 0.23) * x : 110 * x}px, ${({ y }) => window.innerWidth <= 450 ? ((window.innerWidth - 20) * (0.08 / 3) + (window.innerWidth - 40) * 0.23) * y : 110 * y}px);
  text-align: center;
  transition-property: transform;
  transition: 1s easy-in-out;
  font-weight: 600;
  background-color: ${({ value }) => backgroundColorCalc(value)};
  font-size: ${({ value }) => {
    let size = 40;

    switch (value.toString().length) {
      case 1:
        size = 46;
        break;
      case 2:
        size = 40;
        break;
      case 3:
        size = 34;
        break;
      case 4:
        size = 30;
        break;
      case 5:
        size = 26;
        break;
      default:
        size = 40;
        break;
    }
    return size;
  }}px;
`;

const CellNumm = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const backgroundColorCalc = value => {
    if (value === 0) return 'transparent';

    const step = Math.min(16, Math.log2(value));

    return `hsl(0, ${saturationCalc(step)}%, ${lightnesCalc(step)}%)`;
};

const saturationCalc = step => Math.floor(100 / 16 * step);

const lightnesCalc = step => 100 - Math.floor(50 / 16 * step);