import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import { InfoCell } from '../ControlPanel';
import _ from 'lodash';

const superPower = [
    { name: 'double', icon: 'spinner'}, 
    // { name: 'half', icon: 'spinner'}, 
    { name: 'change', icon: 'spinner'}, 
    { name: 'free', icon: 'spinner'},
    // { name: 'destroy', icon: 'spinner'}, 
];

export default class InfoPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initPowers: this.getPowers(superPower),
        }
    }


    getPowers = (powersArray) => {
        let powers = _.clone(powersArray);
        let initPower = [];
        let item;

        for (let i = 0; i < 3; i++) {
            powers = _.shuffle(powers);
            item = powers[0];
            powers.shift();
            initPower[i] = item;

        }

        return initPower;
    }

    render() {
        const { gameScore, bestScore, powerPanelActive, selectedPower, handleClickPower } = this.props;
        const { initPowers } = this.state;

        return (
            <Info className="info-panel">
                <ButtonWrap className="button-wrap" powerPanelActive={powerPanelActive}>
                    {
                        initPowers.map((power, i) => {
                            return (
                                <Button 
                                    key={i}
                                    className="button-superpower" 
                                    data-active={selectedPower === initPowers[i].name && true} 
                                    info={true} 
                                    value={initPowers[i].name} 
                                    icon={initPowers[i].icon} 
                                    onClick={handleClickPower}
                                />
                            );
                        })
                    }
                </ButtonWrap>
                <InfoWrap className="info-wrap" powerPanelActive={powerPanelActive}>
                    <InfoCell className="cell-logo" info={true} title="LOGO" />
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

const PanelWrap = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    transition: transform 0.5s ease-in-out;
`;

const ButtonWrap = PanelWrap.extend`
    transform: ${({ powerPanelActive }) => {
        return powerPanelActive ? 'scale(1) translateY(0%)' : 'scale(0.8) translateY(-150%)'; 
    }};
`;

const InfoWrap = PanelWrap.extend`
    transform: ${({ powerPanelActive }) => {
        return !powerPanelActive ? 'scale(1) translateY(0%)' : 'scale(0.8) translateY(150%)'; 
    }};
`;

