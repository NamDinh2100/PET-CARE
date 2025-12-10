import express from 'express'
import * as petService from '../models/pet.model.js'

const router = express.Router();

router.get('/', function (req, res) {
    res.render('vwCustomer/profile', {
        activeTab: 'profile'
    });
})

router.get('/my-pets', async function (req, res) {
    const user = req.session.authUser;
    const list = await petService.getPetByID(user.user_id);

    res.render('vwCustomer/pet', {
        activeTab: 'pet',
        pets: list
    })
})

export default router;