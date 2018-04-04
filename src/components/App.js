import React, { Component } from 'react';
import _ from 'lodash';
import Layout from './Layout';
import Field from './Field';
import { ControlPanel } from './ControlPanel';
import InfoPanel from './InfoPanel';
import { initStart } from '../logic';
import {
    moveCells,
    directions,
    removeAndIncreaseCells,
    newCellAdd,
    calcScore,
} from '../logic';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = this.getNewState();
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
            best: 0,
            scoreToPower: 0,
            power: true, //change false
            powerPanelActive: false,
            selectedPower: false,
            selectedCells: 0,
        };
    };

    // следим за клавиатурой
    componentDidMount() {
        document.addEventListener('keyup', this.handleKeyPress);

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
                    scoreToPower: state.scoreToPower += calcScore(state.cells),
                }));

                setTimeout(() => {
                    // clean field
                    app.setState(state => ({
                        ...state,
                        cells: removeAndIncreaseCells(state.cells),
                    }));

                    setTimeout(() => {
                        // add new cell if field changed
                        app.setState(state => ({
                            ...state,
                            cells: newCellAdd(state.cells),
                        }));

                        // check power activity

                        if (app.state.scoreToPower >= 0 && !app.state.power) {
                            app.setState(state => ({
                                ...state,
                                power: true,
                                scoreToPower: 0,
                            })); 
                        }
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
            var touchobj = e.changedTouches[0]
            swipedir = 'none'
            startX = touchobj.pageX
            startY = touchobj.pageY
            startTime = new Date().getTime() // record time when finger first makes contact with surface
            e.preventDefault();
        }, false)
    
        touchsurface.addEventListener('touchmove', function(e){
            e.preventDefault() // prevent scrolling when inside DIV
        }, false)
    
        touchsurface.addEventListener('touchend', function(e){
            if (e.target.tagName === 'BUTTON' || e.target.hasAttribute('data-cell')) {
                e.target.click();

                return;   
            } 
            
            var touchobj = e.changedTouches[0]
            distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime // get time elapsed
            if (elapsedTime <= allowedTime){ // first condition for awipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                    swipedir = (distX < 0)? 'ArrowLeft' : 'ArrowRight'
                }
                else if (Math.abs(distY) >= threshold  && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                    swipedir = (distY < 0)? 'ArrowUp' : 'ArrowDown'
                }
            }
            // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
            handleswipe(swipedir, app);
            e.preventDefault()
        }, false)
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
        if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(e.code) && !this.state.selectedPower) {
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
                scoreToPower: this.state.scoreToPower + calcScore(this.state.cells),
            }));

            await delay(150);

            // clean field
            this.setState(state => ({
                ...state,
                cells: removeAndIncreaseCells(this.state.cells),
            }));

            await delay(50);

            // add new cell if field changed
            this.setState(state => ({
                ...state,
                cells: newCellAdd(this.state.cells),
            }));

            // check power activity
            if (this.state.scoreToPower >= 0 && !this.state.power) {
                this.setState(state => ({
                    ...state,
                    power: true,
                    scoreToPower: 0,
                })); 

            }
        }
    };

    // новая игра
    newGame = () => {
        this.setState(this.getNewState());
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
                selectedCells: 0
            })
        )
    }

    handlePowerClick = (e) => {
        let target = e.target,
            powerName = target.getAttribute('value');

        if (target.getAttribute('data-active') && powerName === this.state.selectedPower) {
            this.setState({
                selectedPower: false,
                selectedCells: 0
            });
        } else {
        // выбранная сила
            this.setState({
                selectedPower: powerName
            });
        }
    }   

    handleCellClick = (e) => {
        if (!this.state.selectedPower) {
            console.log('не выбрано')
            this.setState({
                selectedCells: 0
            })
        }

        if (this.state.selectedPower) {
            if (e.target.classList.contains('active')) {
                e.target.classList.remove('active');

                this.setState({
                    selectedCells: this.state.selectedCells - 1
                });
            } else {
                if (this.state.selectedCells < 2){
                    this.setState({
                        selectedCells: this.state.selectedCells + 1
                    });

                    e.target.classList.add('active');
                }
            }
        }
    }

    render() {
        const { cells, score, best, power, powerPanelActive, selectedPower } = this.state;

        return (
            <div className="container">
                <Layout>
                    <InfoPanel 
                        selectedPower={this.state.selectedPower} 
                        gameScore={score} 
                        bestScore={best} 
                        powerPanelActive={powerPanelActive}
                        handleClickPower={this.handlePowerClick}  
                     />
                    <ControlPanel 
                        power={power} 
                        handleNewGame={this.newGame} 
                        handleClickPanelPowerButton={this.clickPower}  
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
