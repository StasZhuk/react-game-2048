import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import 'font-awesome/css/font-awesome.min.css';

export default class AnimationBlock extends Component {
    render() {
        const { animationGo } = this.props;

        return (
            <AnimationWrapper className={animationGo ? 'active' : ''}>
                <LeftBlock className={animationGo ? 'animate' : ''} />
                <RightBlock className={animationGo ? 'animate' : ''} />
            </AnimationWrapper>
        );
    }
}

const swipeLeft = keyframes`
    0%, 100% { transform: translateX(0%) }
    30%, 50%, 70% { transform: translateX(100%) }
`

const swipeRight = keyframes`
    0%, 100% { transform: translateX(0%) }
    30%, 50%, 70% { transform: translateX(-100%) }
`

const AnimationWrapper = styled.div`
    position: fixed;
    display: flex;
    z-index: 1001;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translateY(9999px);

    &.active {
        transform: translate(0, 0);
    }
`
const LeftBlock = styled.div`
    position: absolute;
    width: 50%;
    top: 0;
    bottom: 0;
    left: -50%;
    border-right: 5px solid #613942;
    background-color: #839973;

    &.animate {
        animation: ${swipeLeft} 1s ease-in-out running;
    }
`


const RightBlock = LeftBlock.extend`
    left: unset;
    right: -50%;
    border-left: 5px solid #613942;
    border-right: unset;

    &.animate {
        animation: ${swipeRight} 1s ease-in-out running;
    }
`