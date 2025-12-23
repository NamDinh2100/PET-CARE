import express from 'express';
import bcrypt from 'bcryptjs';
import * as userService from '../../models/user.model.js';
import * as emailService from '../../models/email.model.js';
import * as employeeService from '../../models/employee.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const role = req.query.role;
    const searchQuery = req.query.q;
    const searchField = req.query.field || 'all';
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const offset = (page - 1) * limit;

    let total;
    let list;
    let isSearchMode = false;

    if (searchQuery && searchQuery.trim()) {
        // Search mode
        isSearchMode = true;
        
        // Validate ID search - must be a number
        if (searchField === 'id' && isNaN(searchQuery)) {
            total = { count: 0 };
            list = [];
        } else {
            total = await employeeService.countSearchEmployees(searchField, searchQuery);
            list = await employeeService.searchEmployees(searchField, searchQuery, limit, offset);
        }
    } else if (role) {
        // Filter by role
        total = await employeeService.countByRole(role);
        list = await employeeService.findPageByRole(role, limit, offset);
    } else {
        // Show all employees (except customers)
        total = await employeeService.countByEmpID();
        list = await employeeService.findPageByEmpID(limit, offset);
    }

    const nPages = Math.ceil(+total.count / limit);
    const pageNumbers = [];

    for (let i = 1; i <= nPages; i++) {
        let href = `?page=${i}`;
        if (isSearchMode) {
            href = `?q=${encodeURIComponent(searchQuery)}&field=${searchField}&page=${i}`;
        } else if (role) {
            href = `?role=${role}&page=${i}`;
        }
        
        pageNumbers.push({
            value: i,
            isCurrent: i === +page,
            href: href
        });
    }

    res.render('vwAdmin/vwEmployee/list', {
        employees: list,
        pageNumbers: pageNumbers,
        currentRole: role,
        searchQuery: searchQuery,
        searchField: searchField,
        isSearchMode: isSearchMode,
        layout: 'admin-layout'
    });
}); 

router.get('/add', async function (req, res) {
    res.render('vwAdmin/vwEmployee/add', {
        layout: 'admin-layout'
    });
});

router.post('/add', async function (req, res) {

    const genPassword = emailService.generatePassword();
    try {
        const emailText = `Welcome to the our WEDSITE, ${req.body.full_name}!\nYour account has been created with the following credentials:
        \nEmail: ${req.body.email}
        \nPassword: ${genPassword}
        \nRole: ${req.body.role}
        \nPlease change your password after your first login.`;
        await emailService.sendEmail(req.body.email, 'Welcome to WEDSITE', emailText);
    } catch (error) {
        console.error('Error sending email:', error);
    }

    const hashPassword = bcrypt.hashSync(genPassword);

    const employee = {
        full_name: req.body.full_name,
        password: hashPassword,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        status: 'active'
    };

    await userService.addUser(employee);
    res.redirect('/admin/employees');
});

router.get('/edit', async function (req, res) {
    const id = req.query.id;
    const employee = await userService.getUserByID(id);
    res.render('vwAdmin/vwEmployee/edit', {
        employee: employee,
        layout: 'admin-layout'
    });
});

router.post('/edit', async function (req, res) {
    const id = req.query.id;

    const employee = {
        full_name: req.body.full_name,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role
    };
    await userService.updateUser(id, employee);
    res.redirect('/admin/employees');
});

export default router;