import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import 'font-awesome/css/font-awesome.min.css';

class ControlPanel extends Component {
    render() {
        const { handleNewGame, handleClickPanelPowerButton, power, handleClickMenuButton } = this.props;

        return (
            <MainNavigation className="control-panel">
                <ButtonWrap>
                    <Button 
                        onClick={handleNewGame}
                        small
                        className="button-restart"
                        icon="retweet" 
                    />
                    <Button 
                        className="button-power" 
                        power={power} 
                        value="Power" 
                        onClick={handleClickPanelPowerButton} 
                    />
                    <Button 
                        className="button-menu" 
                        small 
                        icon="bars" 
                        onClick={handleClickMenuButton}
                    />
                </ButtonWrap>
            </MainNavigation>
        )
    }
}

const MainNavigation = styled.div`
    width: 100%;
    padding-top: 15%;
    min-height: 40px;
    position: relative;
    margin: 20px 0;
`

const ButtonWrap = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
`
export { ControlPanel };
