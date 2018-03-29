import React, { Component } from 'react';
import Layout from './Layout';
import Field from './Field';
import Button from './Button';
import initStart from '../logic';
import { moveCells, directions } from '../logic/moveCells';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = this.getNewState();
  }

  keyCodeDirections = {
    'ArrowLeft': directions.LEFT,
    'ArrowRight': directions.RIGHT,
    'ArrowDown': directions.DOWN,
    'ArrowUp': directions.UP,
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
    }
  }

  // функция нажатие на кнопку
  handleKeyPress = (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(e.code)) {
      this.setState((state) => ({
        ...state, 
        cells: moveCells(this.state.cells, this.keyCodeDirections[e.code])
      }));
    }
  }

  // новая игра
  newGame = () => {
    this.setState(this.getNewState())
  }

  render() {
    const { cells, score } = this.state;

    return(
      <div className="container">
        <Button value="New game" onClick={this.newGame} />
        <div>
          { score }
        </div>
        <Layout>
          <Field cells={cells} />
        </Layout>
      </div>
    );
  }
}

export default App;
