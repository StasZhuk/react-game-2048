import React, { Component } from 'react';
import _ from 'lodash';
import Layout from './Layout';
import Field from './Field';
import { ControlPanel } from './ControlPanel';
import InfoPanel from './InfoPanel';
import MenuModal from './MenuModal';
import AnimationBlock from './AnimationBlock';
import { initStart } from '../logic';
import {
    moveCells,
    directions,
    removeAndIncreaseCells,
    newCellAdd,
    calcScore,
    destroyCell,
    changeCells,
    changeCellValue,
    checkValueCell2048
} from '../logic';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cells: initStart(),
            score: 0,
            best: window.localStorage.getItem('gameState') ? JSON.parse(window.localStorage.getItem('gameState')).best : 0,
            scoreToPower: 0,
            power: false,
            powerPanelActive: false,
            mainMenuActive: window.localStorage.getItem('gameState') && true,
            selectedPower: false,
            numberOfSelectedCells: 0,
            cellsSelected: [],
            animationIsActive: false,
            storage: JSON.parse(window.localStorage.getItem('gameState')) || null,
            gameIsOver: false,
            beginingOfGame: true,
            score2048: false,
        };;
    }

    keyCodeDirections = {
        ArrowLeft: directions.LEFT,
        ArrowRight: directions.RIGHT,
        ArrowDown: directions.DOWN,
        ArrowUp: directions.UP,
    };

    getNewState = () => {
        return {
            cells: initStart(),
            best: window.localStorage.getItem('gameState') ? JSON.parse(window.localStorage.getItem('gameState')).best : 0,
            score: 0,
            scoreToPower: 0,
            power: false,
            powerPanelActive: false,
            mainMenuActive: false,
            selectedPower: false,
            numberOfSelectedCells: 0,
            cellsSelected: [],
            animationIsActive: true,
            gameIsOver: false,
            beginingOfGame: false,
            score2048: false,
        };
    };

    needScoreToPower = 5;
    // переменные для тач событий
    swipedir = 'none';
    startX = null;
    startY = null;
    distX = null;
    distY = null;
    threshold = 50;
    restraint = 100;
    allowedTime = 500;
    elapsedTime = 0;
    startTime = 0;

    componentDidMount() { 
        document.addEventListener('keyup', this.handleKeyPress);
        root.addEventListener('touchstart', this.handleTouchStart);
        root.addEventListener('touchend', this.handleTouchEnd);
    }

    handleTouchStart = (e) => {        
        var touchobj = e.changedTouches[0];

        this.swipedir = 'none';
        this.startX = touchobj.pageX;
        this.startY = touchobj.pageY;
        this.startTime = new Date().getTime(); // record time when finger first makes contact with surface

        e.preventDefault();
    }

    handleTouchEnd = (e) => { 
        // если косание кнопки или ячейки, инициируем клик
        if (e.target.tagName === 'BUTTON' || (e.target.hasAttribute('data-cell') && this.state.selectedPower)) {
            e.target.click();

            return;   
        } 

        var touchobj = e.changedTouches[0];

        this.distX = touchobj.pageX - this.startX; // get horizontal dist traveled by finger while in contact with surface
        this.distY = touchobj.pageY - this.startY; // get vertical dist traveled by finger while in contact with surface
        this.elapsedTime = new Date().getTime() - this.startTime; // get time elapsed

        if (this.elapsedTime <= this.allowedTime) { // first condition for awipe met
            if (Math.abs(this.distX) >= this.threshold && Math.abs(this.distY) <= this.restraint) { // 2nd condition for horizontal swipe met
                this.swipedir = (this.distX < 0) ? 'ArrowLeft' : 'ArrowRight';
            }
            else if (Math.abs(this.distY) >= this.threshold  && Math.abs(this.distX) <= this.restraint) { // 2nd condition for vertical swipe met
                this.swipedir = (this.distY < 0) ? 'ArrowUp' : 'ArrowDown';
            }
        }
        // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
        this.handleKeyPress(this.swipedir);
        e.preventDefault();    
    }

    componentWillUnmount() {
        document.removeEventListener('keypress', this.handleKeyPress);
        root.removeEventListener('touchstart', this.handleTouchStart); 
        root.removeEventListener('touchend', this.handleTouchEnd);
    }

    // проверка, изменения состояния игрового поля
    stateIsChanged = startState => {
        if (startState.length === this.state.cells.length) {
            let flag = 0;

            for (let i = 0; i < startState.length; i++) {
                for (let j = 0; j < startState.length; j++) {
                    if (_.isEqual(startState[i], this.state.cells[j])) ++flag;
                    if (flag === startState.length) return false;
                }
            }
        }

        return true;
    }

    // функция нажатие на кнопку и тач события
    handleKeyPress = async e => {
        if(this.state.mainMenuActive) return false;
        // если пришло тач событие, создаем объект с событием как на клавиатуре
        if (typeof e === 'string') {
            e = {code: e};
        }

        if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(e.code) && (!this.state.selectedPower || this.state.selectedPower === 'free')) {
            let startState = this.state.cells;

            // move cells
            this.setState(state => ({
                ...state,
                cells: moveCells(this.state.cells, this.keyCodeDirections[e.code]),
            }));

            // check changes on field after move
            if (!this.stateIsChanged(startState)) return;

            this.setState(state => ({
                ...state,
                score: this.state.score + calcScore(this.state.cells),
                best: state.best <= this.state.score + calcScore(this.state.cells) ? state.score + calcScore(this.state.cells)  : state.best,
                scoreToPower: state.power ? this.state.scoreToPower : this.state.scoreToPower + calcScore(this.state.cells),
            }));

            await delay(150);

            // clean field
            this.setState(state => ({
                ...state,
                cells: removeAndIncreaseCells(this.state.cells),
            }));

            await delay(50);

            // проверяем на наличие ячейки со значением 2048
            if(checkValueCell2048(this.state.cells).length) {
                this.setState({
                    score2048: true
                });
            }

            // add new cell if field changed
            if (this.state.selectedPower !== 'free') {
                this.setState(state => ({
                    ...state,
                    cells: newCellAdd(this.state.cells),
                }));
            }

            // check game is over?
            if (!this.checkIfHasMoves(this.state.cells) && this.state.cells.length === 16) {
                if (this.state.power) {
                    let buttonPower = document.querySelector('.button-power');

                    buttonPower.classList.add('warning');
                    setTimeout(() => {
                        buttonPower.classList.remove('warning');
                    }, 2000);

                    return;
                }

                this.setState({
                    gameIsOver: true
                });

                return;
            }

            if (this.state.selectedPower === 'free') {
                this.setState({
                    scoreToPower: 0,
                    power: false, 
                    powerPanelActive: false,
                    selectedPower: false,
                })
            }

            // check power activity
            if (this.state.scoreToPower >= this.needScoreToPower && !this.state.power) { //change score
                this.setState(state => ({
                    ...state,
                    power: true,
                    scoreToPower: 0,
                })); 
            }
 
            window.localStorage.setItem('gameState', JSON.stringify(this.state));
        }
    };

    // новая игра
    newGame = async () => {
        this.animationLaunch();

        await delay(300);

        this.setState(this.getNewState());

        await delay(200);

        this.setState({
            storage: null
        });
    };

    // продолжить последнюю игру
    continueGame = async () => {
        this.animationLaunch();

        this.setState(this.getStateFromStorage());

        await delay(500);

        this.setState({
            storage: null
        });
    };

    handleMenuTrigger = () => {
        this.setState({
            mainMenuActive: !this.state.mainMenuActive,
            beginingOfGame: false,
        });

        this.animationLaunch();
    };

    clickPower = () => {
        this.state.power && (
          this.setState({
              powerPanelActive: !this.state.powerPanelActive
          })  
        );

        // сбрасываем выбраную силу при переключении меню
        this.state.powerPanelActive && (
            this.setState({
                selectedPower: false,
                numberOfSelectedCells: 0,
                cellsSelected: [],
            })
        )
    }

    getStateFromStorage = () => {
        const state = this.state.storage;

        return {
            cells: state.cells,
            score: state.score,
            best: state.best,
            scoreToPower: state.scoreToPower,
            power: state.power,
            powerPanelActive: false,
            mainMenuActive: false,
            selectedPower: false,
            numberOfSelectedCells: 0,
            cellsSelected: [],
            animationIsActive: true,
            gameIsOver: false,
            storage: this.state.storage,
            score2048: state.score2048,
        }
    }

    animationLaunch = async () => {
        this.setState({
            animationIsActive: true
        });

        await delay(1000);

        this.setState({
            animationIsActive: false
        });
    }

    handlePowerClick = (e) => {
        let target = e.target,
            powerName = target.getAttribute('value');

        if (target.getAttribute('data-active') && powerName === this.state.selectedPower) {
            this.setState({
                selectedPower: false,
                numberOfSelectedCells: 0,
                cellsSelected: [],
            });
        } else {
        // выбранная сила
            this.setState({
                selectedPower: false,
            });

            setTimeout(() => {
                this.setState({
                    selectedPower: powerName,
                    numberOfSelectedCells: 0,
                    cellsSelected: [],
                });
            }, 10);
        }
    }
    
    checkIfHasMoves = (cells) => {
        var newCellsState;

        for (var direction in directions) {
            newCellsState = moveCells(cells,  direction);
            if (this.stateIsChanged(newCellsState)) return true;
        }

        return false;
    }

    handleCellClick = async (e) => {
        const target = e.target;

        if (!this.state.selectedPower) {
            this.setState({
                numberOfSelectedCells: 0,
                cellsSelected: [],
            })
        }

        if (this.state.selectedPower) {
            // отменяем клики при свободном ходе
            if (this.state.selectedPower === 'free') {
                this.setState(state => ({
                    ...state,
                    selectedPower: false,
                    powerPanelActive: false,
                    power: false,
                    score: this.state.score - this.needScoreToPower,
                }));
            }

            if (target !== this.state.cellsSelected[0]) {
                this.setState({
                    cellsSelected: this.state.cellsSelected.concat(target)
                });
            }

            await delay(100);

            if (this.state.selectedPower === 'destroy') {
                target.classList.add('destroy');

                await delay(100);

                this.setState(state => ({
                    ...state,
                    cells: destroyCell(this.state.cells, target),
                    selectedPower: false,
                    powerPanelActive: false,
                    power: false,
                    score: this.state.score - this.needScoreToPower,
                }));

                return;
            }

            // меняем местами ячейки
            if (this.state.selectedPower === 'change' && this.state.cellsSelected.length === 2) {
                this.setState(state => ({
                    ...state,
                    cells: changeCells(this.state.cells, this.state.cellsSelected),
                    selectedPower: false,
                    powerPanelActive: false,
                    power: false,
                    cellsSelected: [],
                    score: this.state.score - this.needScoreToPower,
                }));

                return;
            }

            // уменьшаем значение ячейки в 2 раза
            if (this.state.selectedPower === 'half') {
                this.setState(state => ({
                    ...state,
                    cells: changeCellValue(this.state.cells, target, 'half'),
                    selectedPower: false,
                    powerPanelActive: false,
                    power: false,
                    cellsSelected: [],
                    score: this.state.score - this.needScoreToPower,
                }));

                return;
            }

            // увеличиваем значение ячейки в 2 раза
            if (this.state.selectedPower === 'double') {
                this.setState(state => ({
                    ...state,
                    cells: changeCellValue(this.state.cells, target, 'double'),
                    selectedPower: false,
                    powerPanelActive: false,
                    power: false,
                    cellsSelected: [],
                    score: this.state.score - this.needScoreToPower,
                }));

                return;
            }

            if (target.classList.contains('active')) {
                target.classList.remove('active');

                this.setState({
                    numberOfSelectedCells: this.state.numberOfSelectedCells - 1,
                    cellsSelected: []
                });
            } else {
                if (this.state.numberOfSelectedCells < 2){
                    this.setState({
                        numberOfSelectedCells: this.state.numberOfSelectedCells + 1
                    });

                    target.classList.add('active');
                }
            }
        }
    }

    render() {
        const { 
            cells,
            score, 
            best, 
            power, 
            powerPanelActive, 
            selectedPower, 
            mainMenuActive, 
            animationIsActive,
            gameIsOver,
            storage,
            beginingOfGame,
        } = this.state;

        return (
            <div className="container">
                <Layout>
                    <AnimationBlock animationGo={animationIsActive} />
                    <MenuModal 
                        beginingOfGame={beginingOfGame}
                        active={mainMenuActive} 
                        className={mainMenuActive || gameIsOver ? 'active' : ''} 
                        handleNewGame={this.newGame} 
                        handleBack={this.handleMenuTrigger} 
                        continueGame={this.continueGame} 
                        gameIsOver={gameIsOver}
                        storage={storage}
                    />
                    <InfoPanel 
                        selectedPower={selectedPower} 
                        gameScore={score} 
                        bestScore={best} 
                        powerPanelActive={powerPanelActive}
                        handleClickPower={this.handlePowerClick}
                        powerIsActive={power}  
                     />
                    <ControlPanel 
                        power={power} 
                        handleNewGame={this.newGame} 
                        handleClickPanelPowerButton={this.clickPower}
                        handleClickMenuButton={this.handleMenuTrigger}  
                    />
                    <Field 
                        handleCellClick={this.handleCellClick}
                        cells={cells} 
                        powerIsActive={selectedPower} 
                    />
                </Layout>
            </div>
        );
    }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default App;
