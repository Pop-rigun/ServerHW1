// TODO: add logic for applicants CRUD operations and all other required logic
// TODO: add skipped functions
const fs = require('fs');
const requireFields = ["email","categories", "japaneseKnowledge", "level"]; // TODO: add here all required fields for Applicants
const path = require('path');
const dbPath = path.resolve(__dirname, './db/applicants');

async function addNewApplicant(Applicant) {
    const errorMessage = getRequiredFieldsCheckError(requireFields, Applicant);
    if (errorMessage) {
        throw new Error(errorMessage);
    }
    Applicant.id = `${Applicant.email}-${(new Date).getTime()}`;
    await fs.promises.writeFile(`${dbPath}/${Applicant.id}.txt`, JSON.stringify(Applicant));
    return Applicant.id;
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

async function getApplicantById(id) {
    const file = await fs.promises.readFile(`${dbPath}/${id}.txt`, 'utf8')
    return  JSON.parse(file)
}

async function removeApplicant(id) {
   return fs.promises.unlink(`${dbPath}/${id}.txt`)
}

async function updateApplicant(id,body) {
    const applicant = await fs.promises.readFile(`${dbPath}/${id}.txt`, 'utf8')
    appl = JSON.parse(applicant)
    return fs.promises.writeFile(`${dbPath}/${id}.txt`,JSON.stringify(Object.assign(appl,body)))
}
async function getAllApplicants() {
    const ApplicantFilesList = await fs.promises.readdir(dbPath);
    return Promise.all(ApplicantFilesList.map(async ApplicantFile => {
        const ApplicantRaw = await fs.promises.readFile(`${dbPath}/${ApplicantFile}`, 'utf8');
        return JSON.parse(ApplicantRaw);
    }));
}


module.exports = {
    addNewApplicant,
    getAllApplicants,
    getApplicantById,
    removeApplicant,
    updateApplicant
}