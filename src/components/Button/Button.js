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
                {...this.props}
            >
                {
                    this.props.value && (
                        <span>
                            {this.props.value}
                        </span>
                    )
                }
            </MainButton>
        );
    }
}

const MainButton = styled.button`
    border: unset;
    padding: 10px;
    background-color: #e8dbcb;
    min-width: 40px;
    border-radius: 5px;
    max-width: 100px;
    width: 100%;

    ${props => props.power && css`

    `}

    ${props => props.restart && css`

    `}

    ${props => props.small && css`
        max-width: 70px;
        width: 15%;
    `}

    ${props => props.info && css`
        max-width: 112px;
        width: 30%;
    `}
`;