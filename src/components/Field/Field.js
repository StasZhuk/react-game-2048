import React, { Component } from 'react';
import styled from 'styled-components';

export default class Field extends Component {
    static defaultProps = {
        cells: [],
    }

    render() {
        const { cells } = this.props;

        return (
            <FieldTag>
                <Background>
                    {
                        Array.from(new Array(16), (_, i) => i)
                        .map(i => <BackgroundCell key={i} />)
                    }
                </Background>
                <Playground>
                    {
                        cells.map(({id, x, y, value}) => {
                            return (
                                <Cell key={id} x={x} y={y} value={value} >
                                    {value}
                                </Cell>
                            );
                        })
                    }
                </Playground>

            </FieldTag>
        );
    }
}

const Background = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    flex-wrap: wrap;
    background-color: #613942;
    justify-content: space-between;
    align-content: space-between;
`

const Playground = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    botttom: 0;
`

const FieldTag = styled.div`
    height: 430px;
    position: relative;
    width: 430px;
    border: 10px solid #613942;
`

const BackgroundCell = styled.div`
    height: 100px;
    width: 100px;
    position: relative;
    border-radius: 10px;
    background-color: #E8DBCB;
    color: #613942;
`

const Cell = BackgroundCell.extend`
    position: absolute;
    line-height: 100px;
    transform: translate(${({ x }) => x * 110}px, ${({ y }) => y * 110}px);
    text-align: center;
    transition-property: transform;
    transition: 0.1s easy-in-out;
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
    }
}px
`

const backgroundColorCalc = (value) => {
    if (value === 0) return 'transparent';

    const step = Math.min(16, Math.log2(value));

    return `hsl(0, ${saturationCalc(step)}%, ${lightnesCalc(step)}%)`
}

const saturationCalc = (step) => Math.floor(100 / 16 * step)

const lightnesCalc = (step) => 100 - Math.floor(50 / 16 * step)