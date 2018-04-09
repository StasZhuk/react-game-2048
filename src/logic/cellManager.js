import { uniqueId } from 'lodash';
import { getRandomCoord } from './initStart'

const cellStates = {
    IDLE: 'IDLE',
    DIEING: 'DIEING',
    MOVING: 'MOVING',
    INCRISE: 'INCRISE',
    NEW: 'NEW',
};

function randomNumber() {
    return (Math.random() * 1000).toFixed();
}

const create = (y, x, value, id) => ({
    y,
    x,
    value,
    id: id || uniqueId(randomNumber()),
    state: cellStates.NEW,
});

const removeAndIncreaseCells = cells => {
    return cells.filter(cell => cell.state !== cellStates.DIEING).map(cell => {
        if (cell.state === cellStates.INCRISE) cell.value *= 2;

        cell.state = cellStates.IDLE;

        return cell;
    });
};

const checkValueCell2048 = cells => {
    return cells.filter(cell => cell.value === 2048);
}

const calcScore = cells => {
    let score = 0;

    cells.forEach((cell) => {
        if (cell.state !== cellStates.INCRISE) return ;

        score += (cell.value * 2);
    });

    return score;
};

const newCellAdd = cells => {
    const filledCells = new Set();

    cells.forEach(cell => {
        filledCells.add(cell.x * 4 + cell.y);
    });

    if (filledCells.size === 16) return;

    let x,
        y,
        startSize = filledCells.size;

    do {
        x = getRandomCoord();
        y = getRandomCoord();

        const sum = x * 4 + y;

        filledCells.add(sum);
    } while (filledCells.size === startSize);

    return [...cells, create(y, x, 2)];
};

const destroyCell = (cells, target) => {
    const targetX = +target.getAttribute('x');
    const targetY = +target.getAttribute('y');

    cells = cells.filter(cell => {
        return (cell.x !== targetX || cell.y !== targetY);
    });

    return cells;
}

const changeCells = (cells, activeCells) => {
    const firstElement = activeCells[0],
          secondElement = activeCells[1],
          firstElemCoordX = firstElement.getAttribute('x'),
          firstElemCoordY = firstElement.getAttribute('y'),
          secondElemCoordX = secondElement.getAttribute('x'),
          secondElemCoordY = secondElement.getAttribute('y');

    let activeCellsIdx = [],
        hashX,
        hashY;

    for (let i = 0; i < cells.length; i++) {
        // console.log(cells[i].x, cells[i].y);
        if ((cells[i].x === +firstElemCoordX && cells[i].y === +firstElemCoordY) || (cells[i].x === +secondElemCoordX && cells[i].y === +secondElemCoordY)) {
            activeCellsIdx.push(i);
        }
    }

    hashX = cells[activeCellsIdx[0]].x;
    hashY = cells[activeCellsIdx[0]].y;

    cells[activeCellsIdx[0]].x = cells[activeCellsIdx[1]].x; 
    cells[activeCellsIdx[0]].y = cells[activeCellsIdx[1]].y;

    cells[activeCellsIdx[1]].x = hashX; 
    cells[activeCellsIdx[1]].y = hashY;

    return cells;
}

// уменьшаем значение ячейки в 2 раза
const changeCellValue = (cells, target, operation) => {
    let i = 0;

    while (cells[i].id !== target.id && i < cells.length - 1) {
        ++i;
    }

    operation === 'half' ? cells[i].value /= 2 : cells[i].value *= 2;
     
    return cells;
}

export {
    create,
    cellStates,
    removeAndIncreaseCells,
    newCellAdd,
    calcScore,
    destroyCell,
    changeCells,
    changeCellValue,
    checkValueCell2048,
};