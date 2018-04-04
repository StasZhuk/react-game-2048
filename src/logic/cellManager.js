import { uniqueId } from 'lodash';
import { getRandomCoord } from './initStart'

const cellStates = {
    IDLE: 'IDLE',
    DIEING: 'DIEING',
    MOVING: 'MOVING',
    INCRISE: 'INCRISE',
    NEW: 'NEW',
};

const create = (y, x, value, id) => ({
    y,
    x,
    value,
    id: id || uniqueId(),
    state: cellStates.NEW,
});

const removeAndIncreaseCells = cells => {
    return cells.filter(cell => cell.state !== cellStates.DIEING).map(cell => {
        if (cell.state === cellStates.INCRISE) cell.value *= 2;

        cell.state = cellStates.IDLE;

        return cell;
    });
};

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

export {
    create,
    cellStates,
    removeAndIncreaseCells,
    newCellAdd,
    calcScore,
};