import React, { Component } from 'react';
import _ from 'lodash';
import Layout from './Layout';
import Field from './Field';
import Button from './Button';
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

    // следим за клавиатурой
    componentDidMount() {
        document.addEventListener('keyup', this.handleKeyPress);
    }

    // отписываемся от слежки за клавиатурой
    componentWillUnmount() {
        document.removeEventListener('keypress', this.handleKeyPress);
    }

    // получаем новое начальное состояние
    getNewState = () => {
        return {
            cells: initStart(),
            score: 0,
        };
    };

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
    handleKeyPress = e => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(e.code)) {
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
                score: this.state.score += calcScore(this.state.cells),
            }));

            // clean field
            this.setState(state => ({
                ...state,
                cells: removeAndIncreaseCells(this.state.cells),
            }));





            // add new cell if field changed
            this.setState(state => ({
                ...state,
                cells: newCellAdd(this.state.cells),
            }));
        }
    };

    // новая игра
    newGame = () => {
        this.setState(this.getNewState());
    };

    render() {
        const { cells, score } = this.state;

        return (
            <div className="container">
                <Button value="New game" onClick={this.newGame} />
                <div> {score} </div>
                <Layout>
                    <Field cells={cells} />
                </Layout>
            </div>
        );
    }
}

export default App;
