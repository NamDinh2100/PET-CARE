import express from 'express';
import * as userService from '../../models/user.model.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get('/', async function (req, res) {
    const user = await userService.getUserByEmail(req.session.authUser.email);
    const success = req.query.success;
    const error = req.query.error;

    res.render('vwCustomer/profile', {
        user: user,
        activeTab: 'profile',
        success: success,
        error: error
    });
});

router.post('/update', async function (req, res) {
    const userId = req.session.authUser.user_id;
    const updatedUser = {
        full_name: req.body.full_name,
        phone: req.body.phone
    };

    await userService.updateUser(userId, updatedUser);

    // Update session
    req.session.authUser.full_name = updatedUser.full_name;
    req.session.authUser.phone = updatedUser.phone;

    res.redirect('/profile?success=updated');
});

router.post('/password', async function (req, res) {
    const user = await userService.getUserByEmail(req.session.authUser.email);

    const isMatch = bcrypt.compareSync(req.body.current_password, user.password);
    if (!isMatch) {
        return res.redirect('/profile?error=wrong_password');
    }

    if (req.body.new_password !== req.body.confirm_password) {
        return res.redirect('/profile?error=password_mismatch');
    }

    const hashPassword = bcrypt.hashSync(req.body.new_password);
    await userService.updatePassword(user.user_id, hashPassword);

    res.redirect('/profile?success=password_changed');
});

export default router;