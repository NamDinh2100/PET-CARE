import express from 'express';
import bcrypt from 'bcryptjs';
import * as userService from '../../models/user.model.js';
import * as serviceService from '../../models/service.model.js';
import * as appointmentService from '../../models/appointment.model.js';
import * as petService from '../../models/pet.model.js';
import * as medicineService from '../../models/medicine.model.js';
import * as emailService from '../../models/email.model.js';
import * as employeeService from '../../models/employee.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const services = await serviceService.getAllServices();
    const employees = await employeeService.getAllVeterinarians();
    
    if (!req.session.isAuth) {
        req.session.isAuth = false;
    }
    res.render('vwAccounts/home', {
        services: services,
        employees: employees
    });
});

router.get('/signup', function (req, res) {
    res.render('vwAccounts/signup');
});

router.post('/signup', async function (req, res) {
    const hashPassword = bcrypt.hashSync(req.body.password);

    const check = await userService.getUserByEmail(req.body.email);
    if (check) {
        return res.render('vwAccounts/signup', {
            err_message: 'Email already in use'
        });
    }

    const user = {
        full_name: req.body.full_name,
        password: hashPassword,
        phone: req.body.phone,
        email: req.body.email,
        role: 'customer',
        status: 'active'
    }
    
    await userService.addUser(user);
    res.render('vwAccounts/signup', {
        success_message: 'Account created successfully!'
    });
});

router.get('/signin', function (req, res) {
    res.render('vwAccounts/signin')
})

router.post('/signin', async function (req, res) {
    const email = req.body.email;
    const user = await userService.getUserByEmail(email);

    if (!user)
    {
        return res.render('vwAccounts/signin', {
            err_message: 'Invalid email or password'
        });
    }

    const password = req.body.password;
    const ret = bcrypt.compareSync(password, user.password);

    if (ret == false)
    {
        return res.render('vwAccounts/signin', {
            err_message: 'Invalid email or password'
        });
    }

    const serviceList = await serviceService.getAllServices();

    req.session.isAuth = true;
    req.session.authUser = user;
    req.session.serviceList = serviceList;

    let url;
    if (user.role !== 'customer')
    {
        const medicines = await medicineService.getAllMedicines();
        req.session.medicines = medicines;

        if (user.role === 'admin') {
            url = '/admin/customers';
        }

        else if (user.role === 'veterinarian') {
            url = '/vet/schedule';
            const schedule = await appointmentService.getSchedule(user.user_id);
            req.session.schedule = schedule;
        }
    }

    else
    {
        url = '/';
        const pets = await petService.getPetByOwnerID(user.user_id);
        req.session.pets = pets;
    }
        
    const retUrl = req.session.retUrl || url;
    delete req.session.retUrl;
    res.redirect(retUrl);
});

router.post('/signout', function (req, res) {
    req.session.isAuth = false;
    delete req.session.authUser;
    delete req.session.serviceList;
    delete req.session.pets;
    res.redirect('/');
});

router.get('/forgot-password', function (req, res) {
    res.render('vwAccounts/forgot-password');
});

router.post('/forgot-password', async function (req, res) {
    const email = req.body.email;
    const user = await userService.getUserByEmail(email);

    if (!user) {
        return res.render('vwAccounts/forgot-password', {
            err_message: 'Email not found'
        });
    }

    const genPassword = emailService.generatePassword();
    console.log('Generated password:', genPassword);
    try {
        const emailText = `Dear, ${user.full_name}!
            \nThis is your new password: ${genPassword}
            \nPlease change your password after your first login.`;
        await emailService.sendEmail(req.body.email, 'Welcome to WEDSITE', emailText);
    } catch (error) {
        console.error('Error sending email:', error);
    }

    const hashPassword = bcrypt.hashSync(genPassword);
    await userService.updatePassword(user.user_id, hashPassword);
    res.render('vwAccounts/signin', {
        success_message: 'A new password has been sent to your email.'
    });
});

export default router;
