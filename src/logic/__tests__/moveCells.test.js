/* eslint-no-undef */
import { create, cellStates } from '../cellManager';
import { moveCells, directions } from '../moveCells';

const finalPosition = {
    [directions.UP]: {
        x: 1,
        y: 0,
        value: 2,
        id: 'test',
        state: cellStates.MOVING,
    },
    [directions.RIGHT]: {
        x: 3,
        y: 1,
        value: 2,
        id: 'test',
        state: cellStates.MOVING,
    },
    [directions.DOWN]: {
        x: 1,
        y: 3,
        value: 2,
        id: 'test',
        state: cellStates.MOVING,
    },
    [directions.LEFT]: {
        x: 0,
        y: 1,
        value: 2,
        id: 'test',
        state: cellStates.MOVING,
    },
};

Object.keys(directions).forEach(direction => {
    describe(`move ${direction}`, () => {
        it('move to last', () => {
            const initCells = [create(1, 1, 2, 'test')];

            expect(moveCells(initCells, direction)).toEqual([
                finalPosition[direction],
            ]);
        });
    });
});

describe('Increaset', () => {
    it('2 cells right', () => {
        const initCells = [create(1, 1, 2, 't1'), create(1, 2, 2, 't2')];

        expect(moveCells(initCells, directions.RIGHT)).toEqual([
            { x: 3, y: 1, value: 4, id: 't1', state: cellStates.INCRISE },
            { x: 2, y: 1, value: 2, id: 't2', state: cellStates.DIEING },
        ]);
    });

    it('2 cells left', () => {
        const initCells = [create(2, 1, 4, 't1'), create(2, 3, 4, 't2')];

        expect(moveCells(initCells, directions.LEFT)).toEqual([
            { x: 0, y: 2, value: 4, id: 't1', state: cellStates.DIEING },
            { x: 0, y: 2, value: 8, id: 't2', state: cellStates.INCRISE },
        ]);
    });
});