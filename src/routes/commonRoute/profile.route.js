import express from 'express';
import bcrypt from 'bcryptjs';
import * as userService from '../../models/user.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const success = req.query.success;
    const error = req.query.error;
    
    // Lấy thông tin user đầy đủ từ database
    const user = await userService.getUserByEmail(req.session.authUser.email);

    res.render('vwAccounts/profile', {
        user: user,
        success: success,
        error: error,
    });
});

router.post('/change-password', async function (req, res) {
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

router.post('/update', async function (req, res) {
    const userId = req.session.authUser.user_id;
    const updatedUser = {
        full_name: req.body.full_name,
        phone: req.body.phone,
        address: req.body.address
    };

    await userService.updateUser(userId, updatedUser);

    req.session.authUser.full_name = updatedUser.full_name;
    req.session.authUser.phone = updatedUser.phone;
    req.session.authUser.address = updatedUser.address;

    res.redirect('/profile?success=updated');
});

export default router;
