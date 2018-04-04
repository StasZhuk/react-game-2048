import { cloneDeep } from 'lodash';
import matrixRotate from 'matrix-rotate';
import { cellStates } from './cellManager';

const directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
};

const moveCells = (initCells, direction) => {
    const cells = cloneDeep(initCells);
    const matrix = Array.from(new Array(4), () =>
        Array.from(new Array(4), () => 0),
    );

    cells.forEach(cell => {
        matrix[cell.y][cell.x] = cell;
    });

    rotateMatrixDirectionToMove(matrix, direction);

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (matrix[y][x] === 0) continue;

            moveCell(matrix, y, x);
        }
    }

    rotateMatrixDirectionToStart(matrix, direction);

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (matrix[y][x] === 0) continue;

            matrix[y][x].y = y;
            matrix[y][x].x = x;
        }
    }

    cells
        .filter(cell => 'by' in cell)
        .forEach(cell => {
            cell.x = cell.by.x;
            cell.y = cell.by.y;
            delete cell.by;
        })

    return cells;
};

const moveCell = (matrix, y, x) => {
    let currentRow = y;
    let nextRow = y - 1;

    while (nextRow >= 0) {
        if (matrix[nextRow][x] === 0) {
            matrix[nextRow][x] = matrix[currentRow][x];
            matrix[currentRow][x].state = cellStates.MOVING;
            matrix[currentRow][x] = 0;

            currentRow = nextRow;
        } else if (matrix[nextRow][x].value === matrix[currentRow][x].value && (matrix[nextRow][x].state === cellStates.IDLE || matrix[nextRow][x].state === cellStates.MOVING || matrix[nextRow][x].state === cellStates.NEW)) {
            matrix[nextRow][x].state = cellStates.DIEING;
            matrix[nextRow][x].by = matrix[currentRow][x];
            matrix[currentRow][x].state = cellStates.INCRISE;
            matrix[nextRow][x] = matrix[currentRow][x];
            matrix[currentRow][x] = 0;

            currentRow = nextRow;
        } else {
            break;
        }

        nextRow -= 1;
    }
};

function rotateMatrixDirectionToMove(matrix, direction) {
    switch (direction) {
        case directions.LEFT:
            matrixRotate(matrix);
            break;

        case directions.DOWN:
            matrixRotate(matrix);
            matrixRotate(matrix);
            break;

        case directions.RIGHT:
            matrixRotate(matrix);
            matrixRotate(matrix);
            matrixRotate(matrix);
            break;

        default:
            break;
    }
}

function rotateMatrixDirectionToStart(matrix, direction) {
    switch (direction) {
        case directions.LEFT:
            matrixRotate(matrix);
            matrixRotate(matrix);
            matrixRotate(matrix);
            break;

        case directions.DOWN:
            matrixRotate(matrix);
            matrixRotate(matrix);
            break;

        case directions.RIGHT:
            matrixRotate(matrix);
            break;

        default:
            break;
    }
}

export { moveCells, directions };