import { uniqueId } from 'lodash';

const create = (y, x, value, id) => ({
    y, x, value, id: id ? id : uniqueId()
});

export { create }