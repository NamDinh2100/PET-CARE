import express from 'express';
import * as medicineService from '../../models/medicine.model.js';

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
        // Search mode - only if both query and field are provided
        isSearchMode = true;
        
        // Validate ID/quantity search - must be a number
        if ((searchField === 'id' || searchField === 'quantity') && isNaN(searchQuery)) {
            total = { count: 0 };
            list = [];
        } else {
            total = await medicineService.countSearchMedicines(searchField, searchQuery);
            list = await medicineService.searchMedicines(searchField, searchQuery, limit, offset);
        }
    } else {
        // Show all medicines
        total = await medicineService.countByMedicine();
        list = await medicineService.findPageByMedicine(limit, offset);
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

    res.render('vwAdmin/vwMedicine/list', { 
        medicines: list,
        isAddMode: false,
        pageNumbers: pageNumbers,
        searchQuery: searchQuery,
        searchField: searchField,
        isSearchMode: isSearchMode,
        success: req.query.success,
        layout: 'admin-layout'
    });
});

router.get('/add', function (req, res) {
    res.render('vwAdmin/vwMedicine/list', { 
        isAddMode: true,
        layout: 'admin-layout'
    });
});

router.post('/add', async function (req, res) {
    const medicine = {
        medicine_name: req.body.medicine_name,
        form: req.body.form,
        category: req.body.category,
        description: req.body.description,
    };
    await medicineService.addMedicine(medicine);
    res.redirect('/admin/medicines?success=add');
});

router.get('/edit', async function (req, res) {
    const id = req.query.id;
    const medicine = await medicineService.getMedicineByID(id);
    res.render('vwAdmin/vwMedicine/edit', { 
        medicine: medicine,
        layout: 'admin-layout'
    });
});

router.post('/edit', async function (req, res) {
    const id = req.query.id;
    const medicine = {
        medicine_name: req.body.medicine_name,
        form: req.body.form,
        category: req.body.category,
        description: req.body.description,
    };
    await medicineService.updateMedicine(id, medicine);
    res.redirect('/admin/medicines?success=edit');
});

export default router;