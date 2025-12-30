import express from 'express';
import * as serviceService from '../../models/service.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const searchQuery = req.query.q;
    const searchField = req.query.field || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const offset = (page - 1) * limit;

    let total;
    let list;
    let isSearchMode = false;

    if (searchQuery && searchQuery.trim() && searchField && searchField !== '') {
        isSearchMode = true;
        
        if ((searchField === 'id' || searchField === 'price') && isNaN(searchQuery)) {
            total = { count: 0 };
            list = [];
        } else {
            total = await serviceService.countSearchServices(searchField, searchQuery);
            list = await serviceService.searchServices(searchField, searchQuery, limit, offset);
        }
    } else {
        total = await serviceService.countByService();
        list = await serviceService.findPageByService(limit, offset); 
    }

    const nPages = Math.ceil(+total.count / limit);
    const pageNumbers = [];

    for (let i = 1; i <= nPages; i++) {
        let href = `?page=${i}`;
        if (isSearchMode) {
            href = `?q=${encodeURIComponent(searchQuery)}&field=${searchField}&page=${i}`;
        }
        
        pageNumbers.push({
            value: i,
            isCurrent: i === +page,
            href: href
        });
    }

    res.render('vwAdmin/vwService/list',{
        services: list,
        isAddMode: false,
        pageNumbers: pageNumbers,
        searchQuery: searchQuery,
        searchField: searchField,
        isSearchMode: isSearchMode,
        success: req.query.success,
        layout: 'admin-layout'
    });
});

router.get('/add', async function (req, res) {
    const list = await serviceService.getAllServices();
    res.render('vwAdmin/vwService/list', {
        services: list,
        isAddMode: true,
        layout: 'admin-layout'
    });
});

router.post('/add', async function (req, res) {
    const service = {
        service_name: req.body.service_name,
        base_price: req.body.base_price,
        description: req.body.description,
    };
    await serviceService.addService(service);
    res.redirect('/admin/services?success=add');
});

router.get('/edit', async function (req, res) {
    const id = req.query.id;
    const service = await serviceService.getServiceByID(id);
    res.render('vwAdmin/vwService/edit', { 
        service: service,
        layout: 'admin-layout'
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
    res.redirect('/admin/services?success=edit');
});

export default router;