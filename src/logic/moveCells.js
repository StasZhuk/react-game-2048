import { cloneDeep } from 'lodash';
const rotate = require('matrix-rotate');

const directions = {
    'UP': 'UP',
    'DOWN': 'DOWN',
    'RIGHT': 'RIGHT',
    'LEFT': 'LEFT',
};

const moveCells = (initCells, direction) => {
    const cells = cloneDeep(initCells);
    const matrix = Array.from(new Array(4), () => Array.from(new Array(4), () => 0) );

    cells.forEach(cell => {
        matrix[cell.y][cell.x] = cell;
    })

    // console.log(printMatrix(matrix));

    rotateMatrixDirectionToMove(matrix, direction);

    for (let y = 0; y < 3; y++) {
        for (let x = 0; x <= 3; x++) {
            if (matrix[y][x] === 0) continue;

            moveCell(matrix, y, x);
        }
    }


    rotateMatrixDirectionToStart(matrix, direction);

    for (let y = 0; y <= 3; y++) {
        for (let x = 0; x <= 3; x++) {
            if (matrix[y][x] === 0) continue;

            matrix[y][x].y = y;
            matrix[y][x].x = x;
        }
    }

    // console.log(printMatrix(matrix));
    // console.log('\n\n*\n*****************************\n*');

    return cells;
};

const moveCell = (matrix, y, x) => {
    let nextRow = y + 1;
    let currentRow = y;

    while (nextRow <= 3) {
        if (matrix[nextRow][x] === 0) {
            matrix[nextRow][x] = matrix[currentRow][x];
            matrix[currentRow][x] = 0;

            currentRow = nextRow;
        } 

        else if (matrix[nextRow][x].value !== 0 && matrix[nextRow][x].value === matrix[currentRow][x].value) {
                matrix[nextRow][x].value *= 2;
                matrix[currentRow][x] = 0;

                currentRow = nextRow;
            }

        nextRow += 1; 
    }
}

// function printMatrix(matrix) {
//     let printString = '[\n';
    
//     Array
//       .from(new Array(4), (x, i) => i)
//       .forEach((colNum) => {
//         printString += '  ';
//         printString += Array
//           .from(new Array(4), (x, i) => i)
//           .map(rowNum =>
//             JSON.stringify(matrix[colNum][rowNum]).toString().padStart(36, ' ')
//           )
//           .join(', ');
//         printString += ',\n';
//       });
      
//     printString += ']';
//     console.log(printString);
//   }

  function rotateMatrixDirectionToMove(matrix, direction) {
      switch(direction) {
        case directions.RIGHT:
            rotate(matrix);
            break;

        case directions.UP:
            rotate(matrix);
            rotate(matrix);
            break;

        case directions.LEFT:
            rotate(matrix);
            rotate(matrix);
            rotate(matrix);
            break;

        default:
            break;
      }
  }

  function rotateMatrixDirectionToStart(matrix, direction) {
    switch(direction) {
        case directions.RIGHT:
            rotate(matrix);
            rotate(matrix);
            rotate(matrix);
            break;

        case directions.UP:
            rotate(matrix);
            rotate(matrix);
            break;

        case directions.LEFT:
            rotate(matrix);
            break;
            
        default:
            break;
    }
}

export { moveCells, directions };