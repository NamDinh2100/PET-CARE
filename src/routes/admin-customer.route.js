import express from 'express';
import * as userService from '../models/user.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const list = await userService.getAllUsers();
    res.render('vwAdmin/vwCustomer/list', { 
        customers: list,
        isAddMode: false,
        layout: 'admin-layout'
    });
});

router.get('/edit', async function (req, res) {
    const id = req.query.id;
    const customer = await userService.getUserByID(id);
    res.render('vwAdmin/vwCustomer/edit', { 
        customer: customer,
        layout: 'admin-layout'
    });
});

router.get('/delete', async function (req, res) {
    const id = req.query.id;
    await userService.deleteUser(id);
    res.redirect('/admin/customers');
});


export default router;
