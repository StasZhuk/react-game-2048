import { create } from './cellManager';

const initStart = () => {
    const cell1 = create(getRandomCoord(), getRandomCoord(), 2);
    const cell2 = create(getRandomCoord(), getRandomCoord(), 2);

    if (cell1.x === cell2.x && cell1.y === cell2.y) {
        return initStart();
    }

    return [cell1, cell2];
};

const getRandomCoord = () => {
    return Math.floor(Math.random() * 3.9);
};

export { initStart, getRandomCoord };