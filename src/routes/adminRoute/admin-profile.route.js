import express from 'express';
import bcrypt from 'bcryptjs';
import * as userService from '../../models/user.model.js';

const router = express.Router();

// GET /admin/profile - View admin profile
router.get('/', async function (req, res) {
    const user = await userService.getUserByEmail(req.session.authUser.email);
    const success = req.query.success;
    const error = req.query.error;

    res.render('vwAdmin/profile', {
        user: user,
        success: success,
        error: error
    });
});

// POST /admin/profile/update - Update admin profile
router.post('/update', async function (req, res) {
    const userId = req.session.authUser.user_id;
    const updatedUser = {
        full_name: req.body.full_name,
        phone: req.body.phone
    };

    await userService.updateEmployee(userId, updatedUser);

    // Update session
    req.session.authUser.full_name = updatedUser.full_name;
    req.session.authUser.phone = updatedUser.phone;

    res.redirect('/admin/profile?success=updated');
});

// POST /admin/profile/password - Change admin password
router.post('/password', async function (req, res) {
    const user = await userService.getUserByEmail(req.session.authUser.email);

    const isMatch = bcrypt.compareSync(req.body.current_password, user.password);
    if (!isMatch) {
        return res.redirect('/admin/profile?error=wrong_password');
    }

    if (req.body.new_password !== req.body.confirm_password) {
        return res.redirect('/admin/profile?error=password_mismatch');
    }

    if (req.body.new_password.length < 6) {
        return res.redirect('/admin/profile?error=password_short');
    }

    const hashPassword = bcrypt.hashSync(req.body.new_password);
    await userService.updateEmployee(user.user_id, { password: hashPassword });

    res.redirect('/admin/profile?success=password_changed');
});

export default router;
