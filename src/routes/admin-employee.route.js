import express from 'express';
import * as employeeService from '../models/user.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const list = await employeeService.getAllEmployees();
    res.render('vwAdmin/vwEmployee/list', {
        employees: list
    });
});

router.get('/add', function (req, res) {
    res.render('vwAdmin/vwEmployee/add');
});

router.post('/add', async function (req, res) {
    const hashPassword = bcrypt.hashSync(req.body.password);

    const employee = {
        full_name: req.body.full_name,
        password: hashPassword,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role
    };

    await employeeService.addEmployee(employee);
    res.redirect('/admin/employees');
});

router.get('/edit', async function (req, res) {
    const id = req.query.id;
    const employee = await employeeService.getEmployeeByID(id);
    res.render('vwAdmin/vwEmployee/edit', {
        employee: employee
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
    await employeeService.updateEmployee(id, employee);
    res.redirect('/admin/employees');
});

router.get('/delete', async function (req, res) {
    const id = req.query.id;
    await employeeService.deleteEmployee(id);

    res.redirect('/admin/employees');
});

export default router;