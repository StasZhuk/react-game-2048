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
    getTransformCoords,
    changeCells,
    changeCellValue,
} from '../logic';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cells: initStart(),
            score: 0,
            best: 0,
            scoreToPower: 0,
            power: true, //change false
            powerPanelActive: false,
            mainMenuActive: false,
            selectedPower: false,
            numberOfSelectedCells: 0,
            cellsSelected: [],
            animationIsActive: false,
            storage: JSON.parse(window.localStorage.getItem('gameState')) || null
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
            score: 0,
            scoreToPower: 0,
            power: true, //change false
            powerPanelActive: false,
            mainMenuActive: false,
            selectedPower: false,
            numberOfSelectedCells: 0,
            cellsSelected: [],
            animationIsActive: false,
        };
    };

    // следим за клавиатурой
    componentDidMount() {
        document.addEventListener('keyup', this.handleKeyPress);

        console.log(this.state.storage);

        var el = document.getElementById('root')

        this.swipedetect(el, function(swipedir, app){
            
            if (swipedir !== 'none'){
                let state = app.state;
                const startState = state.cells;
    
                app.setState(state => ({
                    ...state,
                    cells: moveCells(state.cells,  app.keyCodeDirections[swipedir]),
                }));
        
                if (!app.stateIsChanged(startState)) return;
        
                
                app.setState(state => ({
                    ...state,
                    score: state.score += calcScore(state.cells),
                    best: state.best < state.score ? state.score : state.best,
                    scoreToPower: state.scoreToPower += calcScore(state.cells),
                }));

                setTimeout(() => {
                    // clean field
                    app.setState(state => ({
                        ...state,
                        cells: removeAndIncreaseCells(state.cells),
                    }));

                    setTimeout(() => {
                        // add new cell if field changed and power FREE is not active
                        if (app.state.selectedPower !== 'free') {
                            app.setState(state => ({
                                ...state,
                                cells: newCellAdd(state.cells),
                            }));
                        }

                        // проверяем есть ли еще ходы 
                        if (!app.checkIfHasMoves(app.state.cells) && app.state.cells.length === 16) {
                            if (app.state.power) {

                            } else {
                                console.log('the end');
                                window.localStorage.removeItem('gameState', null);
                                return;
                            }
                        }


                        if (app.state.selectedPower === 'free') {
                            app.setState({
                                scoreToPower: 0,
                                power: false, 
                                powerPanelActive: false,
                                selectedPower: false,
                            })
                        }
                        // check power activity

                        if (app.state.scoreToPower >= 2 && !app.state.power) { //change score to power
                            app.setState(state => ({
                                ...state,
                                power: true,
                                scoreToPower: 0,
                            })); 
                        }

                        window.localStorage.setItem('gameState', JSON.stringify(app.state));
                    }, 150);
                }, 50);
        
            }   
        })
    }

    // отписываемся от слежки за клавиатурой
    componentWillUnmount() {
        document.removeEventListener('keypress', this.handleKeyPress);
    }

    // swipe action
    swipedetect = (el, callback) => {
        var touchsurface = el,
                swipedir,
                startX,
                startY,
                distX,
                distY,
                threshold = 50,
                restraint = 100,
                allowedTime = 500,
                elapsedTime,
                startTime,
                handleswipe = callback || function(swipedir){},
                app = this;                
    
        touchsurface.addEventListener('touchstart', function(e){
            var touchobj = e.changedTouches[0];
            swipedir = 'none';
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime(); // record time when finger first makes contact with surface
            e.preventDefault();
        }, false);
    
        touchsurface.addEventListener('touchmove', function(e){
            e.preventDefault(); // prevent scrolling when inside DIV
        }, false);
    
        touchsurface.addEventListener('touchend', function(e){
            if (e.target.tagName === 'BUTTON' || (e.target.hasAttribute('data-cell') && app.state.selectedPower)) {
                e.target.click();

                return;   
            } 

            if (app.state.selectedPower && app.state.selectedPower !== 'free') {
                return;
            }
            
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime; // get time elapsed

            if (elapsedTime <= allowedTime) { // first condition for awipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                    swipedir = (distX < 0)? 'ArrowLeft' : 'ArrowRight';
                }
                else if (Math.abs(distY) >= threshold  && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                    swipedir = (distY < 0)? 'ArrowUp' : 'ArrowDown';
                }
            }
            // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
            handleswipe(swipedir, app);
            e.preventDefault();
        }, false);
    }

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

    // функция нажатие на кнопку
    handleKeyPress = async e => {
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

            // add new cell if field changed
            if (this.state.selectedPower !== 'free') {
                this.setState(state => ({
                    ...state,
                    cells: newCellAdd(this.state.cells),
                }));
            }

            if (!this.checkIfHasMoves(this.state.cells) && this.state.cells.length === 16) {
                console.log('the end');
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
            if (this.state.scoreToPower >= 20 && !this.state.power) { //change score
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
    newGame = () => {
        this.setState(this.getNewState());
    };

    // продолжить последнюю игру
    continueGame = () => {
        this.setState(this.state.storage);
    };

    handleMenuTrigger = () => {
        this.setState({
            mainMenuActive: !this.state.mainMenuActive
        })
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
        let newCellsState;

        newCellsState = moveCells(cells,  directions.DOWN);
        if (this.stateIsChanged(newCellsState)) return true;

        newCellsState = moveCells(cells,  directions.UP);
        if (this.stateIsChanged(newCellsState)) return true;

        newCellsState = moveCells(cells,  directions.LEFT);
        if (this.stateIsChanged(newCellsState)) return true;

        newCellsState = moveCells(cells,  directions.RIGHT);
        if (this.stateIsChanged(newCellsState)) return true;

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
            this.setState({
                cellsSelected: this.state.cellsSelected.concat(target)
            });

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
                    score: this.state.score - 2, //change on 10000
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
        } = this.state;

        return (
            <div className="container">
                <Layout>
                    <AnimationBlock animationGo={animationIsActive} />
                    <MenuModal active={mainMenuActive} className={mainMenuActive ? 'active' : ''} handleNewGame={this.newGame} handleBack={this.handleMenuTrigger} continueGame={this.continueGame}   />
                    <InfoPanel 
                        selectedPower={selectedPower} 
                        gameScore={score} 
                        bestScore={best} 
                        powerPanelActive={powerPanelActive}
                        handleClickPower={this.handlePowerClick}  
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
