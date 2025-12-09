import express from 'express';
import bcrypt, {compareSync, hash} from 'bcryptjs';
import * as employeeService from '../models/user.model.js';
import * as emailService from '../models/email.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const list = await employeeService.getAllEmployees();
    res.render('vwAdmin/vwEmployee/list', {
        employees: list,
        isAddMode: false
    });
});

router.get('/add', async function (req, res) {
    const list = await employeeService.getAllEmployees();
    res.render('vwAdmin/vwEmployee/list', {
        employees: list,
        isAddMode: true
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

    console.log(employee);

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