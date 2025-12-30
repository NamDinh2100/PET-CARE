import express from 'express';
import * as userService from '../../models/customer.model.js';
import * as serviceService from '../../models/service.model.js';
import * as medicineService from '../../models/medicine.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const query = req.query.q || '';
    const type = req.query.type || 'all';

    if (!query.trim()) {
        return res.redirect('back');
    }

    const results = {
        employees: [],
        customers: [],
        services: [],
        medicines: []
    };

    try {
        if (type === 'all' || type === 'employees') {
            const employees = await userService.getAllEmployees();
            results.employees = employees.filter(emp =>
                emp.full_name.toLowerCase().includes(query.toLowerCase()) ||
                emp.email.toLowerCase().includes(query.toLowerCase()) ||
                (emp.phone && emp.phone.includes(query))
            );
        }

        if (type === 'all' || type === 'customers') {
            const customers = await userService.getAllUsers();
            results.customers = customers.filter(cus =>
                cus.full_name.toLowerCase().includes(query.toLowerCase()) ||
                cus.email.toLowerCase().includes(query.toLowerCase()) ||
                (cus.phone && cus.phone.includes(query))
            );
        }

        if (type === 'all' || type === 'services') {
            try {
                const services = await serviceService.getServiceByName(query);
                results.services = services || [];
            } catch (e) {
                results.services = [];
            }
        }

        if (type === 'all' || type === 'medicines') {
            try {
                const medicines = await medicineService.getMedicineByName(query);
                results.medicines = medicines || [];
            } catch (e) {
                results.medicines = [];
            }
        }

        res.render('vwAdmin/search-results', {
            results,
            query,
            type,
            totalResults: results.employees.length + results.customers.length +
                results.services.length + results.medicines.length
        });

    } catch (error) {
        console.error('Search error:', error);
        res.render('vwAdmin/search-results', {
            results: { employees: [], customers: [], services: [], medicines: [] },
            query,
            type,
            totalResults: 0,
            error: 'An error occurred while searching'
        });
    }
});

export default router;
