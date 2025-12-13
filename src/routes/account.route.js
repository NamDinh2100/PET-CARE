import express from 'express';
import bcrypt, {compareSync, hash} from 'bcryptjs';
import * as userService from '../models/user.model.js';
import * as serviceService from '../models/service.model.js';
import * as appointmentService from '../models/appointment.model.js';
import * as medicineService from '../models/medicine.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    res.render('vwCustomer/home');
});

// router.get('/signup', function (req, res) {
//     res.render('vwAccounts/signup');
// });

// router.post('/signup', async function (req, res) {
//     const hashPassword = bcrypt.hashSync(req.body.password);
//     const user = {
//         full_name: req.body.full_name,
//         password: hashPassword,
//         phone: req.body.phone,
//         email: req.body.email,
//     }
    
//     await userService.add(user);
//     res.redirect('/');
// });

router.get('/signin', function (req, res) {
    res.render('vwAccounts/signin');
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

    console.log('User logged in:', req.session.authUser);

    let url;
    if (user.role !== 'owner')
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
        const pets = await userService.getPetByID(user.user_id);
        req.session.pets = pets;
    }
        
    const retUrl = req.session.retUrl || url;
    delete req.session.retUrl;
    res.redirect(retUrl);
});

router.post('/signout', function (req, res) {
    req.session.isAuth = false;
    delete req.session.authUser;
    res.redirect('/');
});

// router.get('/admin/employees', async function (req, res) {
//     const page = parseInt(req.query.page) || 1;
//     const limit = 8;
//     const offset = (page - 1) * limit;

//     const total = await userService.countByEmpID();

//     const nPages = Math.ceil(+total.count / limit);
//     const pageNumbers = [];

//     for (let i = 1; i <= nPages; i++) {
//         pageNumbers.push({
//             value: i,
//             isCurrent: i === +page,
//         });
//     }

//     const list = await userService.findPageByEmpID(limit, offset);

//     res.render('vwAdmin/vwEmployee/list', {
//         employees: list,
//         pageNumbers: pageNumbers,
//     });
// });

export default router;
