import express from 'express';
import * as appointmentService from '../models/appointment.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const list = await appointmentService.getAllAppointments();
    res.render('vwAdmin/vwAppointment/list', { 
        appointments: list,
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