import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import 'font-awesome/css/font-awesome.min.css';

export default class AnimationBlock extends Component {
    render() {
        return (
            <AnimationWrapper>
                <LeftBlock />
                <RightBlock />
            </AnimationWrapper>
        );
    }
}

const LeftBlock = styled.div`
    position: absolute;
    widht: 50%;
    height: 100%;
    background-color: yellow;
`

const RightBlock = LeftBlock.extend`

`

const AnimationWrapper = styled.div`
    position: fixed;
    display: flex;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #839973;
    transform: translateY(-100%);
    transition: transform 0.3s ease-in;
    
    &.active {
        transform: translate(0, 0);
    }
`