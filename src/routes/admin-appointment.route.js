import express from 'express';
import * as appointmentService from '../models/appointment.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const offset = (page - 1) * limit;

    const total = await appointmentService.countByAppointment();

    const nPages = Math.ceil(+total.count / limit);
    const pageNumbers = [];

    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: i === +page,
        });
    }

    const list = await appointmentService.findPageByAppointment(limit, offset);

    res.render('vwAdmin/vwAppointment/list', { 
        appointments: list,
        pageNumbers: pageNumbers,
        layout: 'admin-layout'
    });
});

router.get('/details', async function (req, res) {
    const id = req.query.id;
    const appointment = await appointmentService.getAppointmentByID(id);
    res.render('vwAdmin/vwAppointment/details', {
        appointment: appointment,
        layout: 'admin-layout'
    });
});


export default router;