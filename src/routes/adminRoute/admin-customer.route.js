import express from 'express';
import * as customerService from '../../models/customer.model.js';
import * as userService from '../../models/user.model.js';

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
        
        if (searchField === 'id' && isNaN(searchQuery)) {
            total = { count: 0 };
            list = [];
        } else {
            total = await customerService.countSearchCustomers(searchField, searchQuery);
            list = await customerService.searchCustomers(searchField, searchQuery, limit, offset);
        }
    } else {
        total = await customerService.countByCustomer();
        list = await customerService.findPageByCustomer(limit, offset);
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

    res.render('vwAdmin/vwCustomer/list', { 
        customers: list,
        isAddMode: false,
        pageNumbers: pageNumbers,
        searchQuery: searchQuery,
        searchField: searchField,
        isSearchMode: isSearchMode,
        success: req.query.success,
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
    res.redirect('/admin/customers?success=delete');
});


export default router;
