import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import 'font-awesome/css/font-awesome.min.css';

export default class MenuModal extends Component {
    render() {
        const { handleNewGame, className, handleBack, continueGame, gameIsOver, storage, beginingOfGame } = this.props;

        return (
            <MainMenuWrap className={className}>
                <MainMenu>
                    <MenuHeading>
                        {gameIsOver ? 'Game Over' : 'Menu'}
                    </MenuHeading>
                    <Button value="New Game" menu onClick={handleNewGame} />
                    {
                        !gameIsOver && storage && <Button value="Continue" menu onClick={continueGame}/>
                    }
                    {
                        !gameIsOver && !beginingOfGame && <Button value="Back" menu onClick={handleBack} />
                    }
                </MainMenu>
            </MainMenuWrap>
        );
    }
}

const MainMenu = styled.div`
    max-width: 300px;
    width: 100%;
    margin: auto;
    background-color: transparent;
    padding: 20;
    text-align: center;
    border-radius: 10px;
`

const MainMenuWrap = styled.div`
    position: fixed;
    display: flex;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #839973;
    transform: translateY(-100%);
    transition-property: transform;
    transition-delay: 0.5s;
    
    &.active {
        transform: translate(0, 0);
    }
`

const MenuHeading = styled.h1`
    color: #fff;
`