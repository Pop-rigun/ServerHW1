// TODO: add skipped functions
const fs = require('fs');
const requireFields = ["category","level", "company", "japaneseRequired"]; // TODO: add here all required fields for positions
const path = require('path');
const dbPath = path.resolve(__dirname, './db/positions');
const findApp = require('./mailSender')
const EventEmitter = require('events')
EventEmitter.captureRejection = true;

const emitter = new EventEmitter

async function addNewPosition(position) {
    const errorMessage = getRequiredFieldsCheckError(requireFields, position);
    if (errorMessage) {
        throw new Error(errorMessage);
    }
    position.id = `${position.company}-${(new Date).getTime()}`;
    await fs.promises.writeFile(`${dbPath}/${position.id}.txt`, JSON.stringify(position));
    emitter.emit('addpos',position,'New position added')
    return position.id;
}

function getRequiredFieldsCheckError(requiredFields, objectToCheck) {
    const errors = [];
    requireFields.forEach(requireField => {
        if (!objectToCheck.hasOwnProperty(requireField)) {
            errors.push(requireField);
        }
    });
    return errors.length ? 'No required property(ies): ' + errors : false;
}

async function getPositionById(id) {
    const file = await fs.promises.readFile(`${dbPath}/${id}.txt`, 'utf8')
    return  JSON.parse(file)
}

async function removePosition(id) {
    const position = await fs.promises.readFile(`${dbPath}/${id}.txt`, 'utf8')
    const pos = JSON.parse(position)
    emitter.emit('del',pos,'Position removed')
   return fs.promises.unlink(`${dbPath}/${id}.txt`)
}

async function updatePosition(id,body) {
    const position = await fs.promises.readFile(`${dbPath}/${id}.txt`, 'utf8')
    pos = JSON.parse(position)
    return fs.promises.writeFile(`${dbPath}/${id}.txt`,JSON.stringify(Object.assign(pos,body)))
}

async function getAllPositions(req) {
    const {category,level,tag} = req.query
    const positionFilesList = await fs.promises.readdir(dbPath);
    return Promise.all(positionFilesList.map(async (positionFile) => {
        const positionRaw = await fs.promises.readFile(`${dbPath}/${positionFile}`, 'utf8');
        const pos = JSON.parse(positionRaw)
        if(category == undefined || pos.category == category){}
        else{return}
        if(level == undefined || pos.level == level){}
        else{return }
        if(tag == undefined || pos.description.includes(tag)){}
        else{return}
        return (pos)
    })).then( res => res.filter((item) => item != null))
}


emitter.on('addpos', async (arg,text) => { await findApp(arg,text)})
emitter.on('del', async (arg,text) => { await findApp(arg,text)})


module.exports = {
    addNewPosition,
    getAllPositions,
    getPositionById,
    removePosition,
    updatePosition
}