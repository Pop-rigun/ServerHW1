// TODO: add method to get all positions, export this new method
const fs = require('fs');
const path = require('path');
const requireFields = ['category', 'level', 'company', 'japaneseRequired'];
const dbPath = path.resolve(__dirname, './db/positions');

async function addNewPosition(position) {
    checkRequiredFields(requireFields,position);
    position.id = `${position.company}-${(new Date).getTime()}`;
    // TODO: use 'path' library to construct file paths: https://nodejs.org/api/path.html
    await fs.promises.writeFile(`${dbPath}/${position.id}.txt`, JSON.stringify(position));
    return position.id;
}

async function getAllPositions() {
    const positionFilesList = await fs.promises.readdir(dbPath);
    return Promise.all(positionFilesList.map(async positionFile => {
        const positionRaw = await fs.promises.readFile(`${dbPath}/${positionFile}`, 'utf8');
        return JSON.parse(positionRaw);
    }));
}

function checkRequiredFields(requiredFields, objectToCheck) {
    requireFields.forEach(requireField => {
        if (!objectToCheck.hasOwnProperty(requireField)) {
            throw new Error(`No required property '${requireField}' in a new position`);
        }
    });
}

module.exports = {
    addNewPosition,
    getAllPositions
}