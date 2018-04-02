import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '../Button';

class ControlPanel extends Component {
    render() {
        return (
            <MainNavigation className="control-panel">
                <ButtonWrap>
                    <Button onClick={this.props.handleNewGame} restart={true} small className="button-restart" />
                    <Button className="button-power" power value="power" />
                    <Button className="button-menu" menu small />
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
