export default function getTransformCoords(property) {
    property = property.substr(0, property.length - 1).split(',');

    return [property[property.length - 2].trim(), property[property.length - 1].trim()]
}

export { getTransformCoords };