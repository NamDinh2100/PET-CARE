import express from 'express';
import * as serviceService from '../models/service.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const list = await serviceService.getAllServices();
    res.render('vwAdmin/vwService/list',{
        services: list,
        isAddMode: false
    }) ;
});

router.get('/add', async function (req, res) {
    const list = await serviceService.getAllServices();
    res.render('vwAdmin/vwService/add', {
        services: list,
        isAddMode: true
    });
});

router.post('/add', async function (req, res) {
    const service = {
        service_name: req.body.service_name,
        base_price: req.body.base_price,
        description: req.body.description,
    };
    await serviceService.addService(service);
    res.redirect('/admin/services');
});

router.get('/edit', async function (req, res) {
    const id = req.query.id;
    const service = await serviceService.getServiceByID(id);
    res.render('vwAccounts/vwService/edit', { 
        service: service
    });

});

router.post('/edit', async function (req, res) {
    const id = req.query.id;
    const service = {
        service_name: req.body.service_name,
        base_price: req.body.base_price,
        description: req.body.description,
    };
    await serviceService.updateService(id, service);
    res.redirect('/admin/services');
});

export default router;