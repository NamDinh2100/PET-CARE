import express from 'express';
import bcrypt, {compareSync, hash} from 'bcryptjs';
import * as userService from '../models/user.model.js';

const router = express.Router();

router.get('/signup', function (req, res) {
    res.render('vwAccounts/signup');
});

router.post('/signup', async function (req, res) {
    const hashPassword = bcrypt.hashSync(req.body.password);
    const user = {
        full_name: req.body.full_name,
        password: hashPassword,
        phone: req.body.phone,
        email: req.body.email,
    }
    console.log(user);
    await userService.add(user);
    res.redirect('/');
});

router.get('/signin', function (req, res) {
    res.render('vwAccounts/signin');
})

router.post('/signin', async function (req, res) {
    const email = req.body.email;
    const user = await userService.findByEmail(email);

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

    req.session.isAuth = true;
    req.session.authUser = user;

    const retUrl = req.session.retUrl || '/';
    delete req.session.retUrl;
    res.redirect(retUrl);
});

router.get('/profile', function (req, res) {
    res.render('vwAccounts/profile', {
        user: req.session.authUser
    });
});

router.post('/signout', function (req, res) {
    req.session.isAuth = false;
    delete req.session.authUser;
    const retUrl = req.headers.referer || '/';
    res.redirect(retUrl);
});

router.get('/admin/employees', async function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const offset = (page - 1) * limit;

    const total = await userService.countByEmpID();

    const nPages = Math.ceil(+total.count / limit);
    const pageNumbers = [];

    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: i === +page,
        });
    }

    const list = await userService.findPageByEmpID(limit, offset);

    res.render('vwAdmin/vwEmployee/list', {
        employees: list,
        pageNumbers: pageNumbers,
    });
});



export default router;
