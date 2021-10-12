// TODO: add routes for Applicants
// TODO: add skipped logic for
// TODO: Connect this file with server.js and with app variable
const express = require('express');
const app = express();
const router = require('express').Router();
const positionModel = require('./positions');
const applicantModel = require('./applicants');

// routes for positions 
router.get('/position', async (req, res, next) => {
    try {
        const positions = await positionModel.getAllPositions(req);
        res.setHeader('content-type', 'application/json');
        res.statusCode = 200;
        res.json(positions)
    } catch (e) {
        next(e);
    }
});

router.get('/position/:id',async (req, res, next) => {
    try{
        pos = await positionModel.getPositionById(req.params.id)
        res.setHeader('content-type', 'application/json');
        res.statusCode = 200;
       return res.json(pos)
    } catch (e) {
        next(e);
    }
    
});
router.post('/position', async (req, res, next) => {
    try{
        const pos = await positionModel.addNewPosition(req.body)
        res.setHeader('content-type', 'application/json');
        res.statusCode = 201;
        return res.json(pos)
    } catch (e) {
        next(e);
    }
});
router.patch('/position/:id',async (req, res,next) => {
    try{
        const pos = await positionModel.updatePosition(req.params.id, req.body)
        res.setHeader('content-type', 'application/json');
        res.statusCode = 200;
        return res.json(pos)
    } catch (e) {
        next(e);
    }
});

router.delete('/position/:id',async (req, res, next) => {
    try{ 
       await positionModel.removePosition(req.params.id)
        res.setHeader('content-type', 'application/json');
        return res.sendStatus(204)
    } catch (e) {
        next(e);
    }
});


// routes for applicants 
router.get('/applicant', async (req, res, next) => {
    try {
        const positions = await applicantModel.getAllApplicants();
        res.setHeader('content-type', 'application/json');
        res.statusCode = 200;
        res.json(positions)
    } catch (e) {
        next(e);
    }
});

router.get('/applicant/:id',async (req, res, next) => {
    try{
        pos = await applicantModel.getApplicantById(req.params.id)
        res.setHeader('content-type', 'application/json');
        res.statusCode = 200;
       return res.json(pos)
    } catch (e) {
        next(e);
    }
    
});
router.post('/applicant', async (req, res, next) => {
    try{
        const appl = await applicantModel.addNewApplicant(req.body)
        res.setHeader('content-type', 'application/json');
        res.statusCode = 201;
        return res.json(appl)
    } catch (e) {
        next(e);
    }
});
router.put('/applicant/:id',async (req, res,next) => {
    try{
        const appl = await applicantModel.addNewApplicant(req.body)
        res.setHeader('content-type', 'application/json');
        res.statusCode = 200;
        return res.json(appl)
    } catch (e) {
        next(e);
    }
});

router.delete('/applicant/:id',async (req, res,next) => {
    try{ 
       await applicantModel.removeApplicant(req.params.id)
        res.setHeader('content-type', 'application/json');
        return res.sendStatus(204)
    } catch (e) {
        next(e);
    }
});


app.use((err, request, response, next) => {
    console.log(err)
    response.status(500).send("Unexpected server error: " + JSON.stringify(err))
})

module.exports = router