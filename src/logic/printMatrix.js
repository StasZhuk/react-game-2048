function printMatrix(matrix) {
    let printString = '[\n';

    Array.from(new Array(4), (x, i) => i).forEach(colNum => {
        printString += '  ';
        printString += Array.from(new Array(4), (x, i) => i)
            .map(rowNum =>
                JSON.stringify(matrix[colNum][rowNum])
                .toString()
                .padStart(36, ' '),
            )
            .join(', ');
        printString += ',\n';
    });

    printString += ']';
    console.log(printString);
}

export default printMatrix;