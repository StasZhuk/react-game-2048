import React, { Component } from 'react';
import styled, { css } from 'styled-components';
// import InlineSVG from 'svg-inline-react';
import '../../styles/css/Button.css';
// import logo from './restart.svg';

class InfoCell extends Component {
    render() {
        const { title, onClick, data, className } = this.props;

        return (
            <Cell
                title={title} 
                onClick={onClick} 
                className={className ? 'info-cell ' +  className : 'info-cell'}
                {...this.props}
            >
                {
                    title && (
                        <CellScore>
                            {title}
                        </CellScore>
                    )
                }
                {
                    data >= 0 && (
                        <CellScore value={data}>
                            {data}
                        </CellScore>
                    )
                }
            </Cell>
        );
    }
}

const Cell = styled.div`
    border: unset;
    padding: 5px;
    background-color: #e8dbcb;
    min-width: 40px;
    border-radius: 5px;
    max-width: 100px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-weight: 600;
    font-size: 24px;
    color: #613942;

    ${props => props.info && css`
        max-width: 112px;
        width: 30%;
    `}
`;

const CellScore = styled.span`
    margin-top: 5px;
    font-size: ${({ value }) => {
        return value > 99999 ? 18 : 20
    }}px;
`

export { InfoCell }