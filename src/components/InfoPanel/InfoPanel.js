import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import { InfoCell } from '../ControlPanel';

export default class InfoPanel extends Component {
    render() {
        const { gameScore, bestScore } = this.props;

        return (
            <Info className="info-panel">
                <ButtonWrap className="button-wrap">
                    <Button onClick={this.props.handleNewGame} info={true} className="button-restart" />
                    <Button className="button-power" info={true} value="power" />
                    <Button className="button-menu" info={true} />
                </ButtonWrap>
                <InfoWrap className="info-wrap">
                    <InfoCell className="cell-logo" onClick={this.props.handleNewGame} info={true} title="LOGO" />
                    <InfoCell className="cell-best" info={true} data={bestScore}  title="Best" />
                    <InfoCell className="cell-score" info={true} data={gameScore} title="Score" />
                </InfoWrap>
            </Info>
        )
    }
}

const Info = styled.div`
    width: 100%;
    padding-top: 25%;
    min-height: 80px;
    position: relative;
    border: 10px solid #613942;
    background-color: #613942;
    overflow: hidden;
`

const ButtonWrap = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    transform: translateY(-100%);
`

const InfoWrap = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
`

