import React, { Component } from 'react';
import styled, { css } from 'styled-components';
// import InlineSVG from 'svg-inline-react';
import '../../styles/css/Button.css';
// import logo from './restart.svg';

export default class Button extends Component {
    render() {
        return (
            <MainButton 
                value={this.props.value} 
                onClick={this.props.onClick} 
                className={this.props.className ? 'button ' +  this.props.className : 'button'}
                dataActive={this.props['data-active']}
                {...this.props}
            >
                {
                    this.props.value && (
                        <ButtonTitle>
                            {this.props.value}
                        </ButtonTitle>
                    )
                }
                {
                    this.props.icon && (
                        <ButtonTitle className={'fa fa-' + this.props.icon} />
                    )
                }
            </MainButton>
        );
    }
}

const MainButton = styled.button`
    border: unset;
    padding: 10px;
    background-color: ${({ dataActive }) => dataActive ? 'red' : '#e8dbcb' };
    min-width: 40px;
    border-radius: 5px;
    max-width: 100px;
    width: 100%;
    font-size: 18px;
    color: ${({ dataActive }) => dataActive ? '#fff' : '#613942' } ;
    font-weight: bold;
    transition: 0.5s background-color, 1s border, 1s color;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    ${props => props.power && css`
        background-color: ${({ power }) => {
            return power === true ? '#1e9eb4' : '#613942';
        }};
        border: ${({ power }) => {
            return power === true ? '2px solid #fff' : 'none';
        }};
        color: ${({ power }) => {
            return power === true ? '#fff' : '#613942';
        }};
    `}

    ${props => props.restart && css`

    `}

    ${props => props.small && css`
        max-width: 70px;
        width: 15%;
        font-size: 30px;
    `}

    ${props => props.info && css`
        max-width: 112px;
        width: 30%;
    `}
`;

const ButtonTitle = styled.span`
    pointer-events: none;
`