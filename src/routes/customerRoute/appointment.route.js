import express from 'express';
import * as appointmentService from '../../models/appointment.model.js';
import * as petService from '../../models/pet.model.js';
import * as serviceService from '../../models/service.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const filter = req.query.filter || 'all';
    const success = req.query.success;
    let appointments;

    if (filter === 'upcoming') {
        appointments = await appointmentService.getUpcomingAppointments(req.session.authUser.user_id);
    } else if (filter === 'past') {
        appointments = await appointmentService.getPastAppointments(req.session.authUser.user_id);
    } else {
        appointments = await appointmentService.getAppointmentsByCustomer(req.session.authUser.user_id);
    }

    const pets = await petService.getPetByOwnerID(req.session.authUser.user_id);
    const services = await serviceService.getAllServices();

    res.render('vwCustomer/appointments', {
        appointments: appointments,
        pets: pets,
        services: services,
        activeTab: 'appointments',
        currentFilter: filter,
        success: success
    });
});

router.post('/book', async function (req, res) {
    try {
        const appointment_id = await appointmentService.addAppointment({
            customer_id: req.session.authUser.user_id,
            pet_id: req.body.pet_id,
            date_start: req.body.date_start,
            time: req.body.time,
            note: req.body.note,
            status: 'scheduled'
        });

        const servicesList = Array.isArray(req.body.services)
            ? req.body.services
            : [req.body.services];

        for (const service_id of servicesList) {
            await appointmentService.addServiceForAppointment({
                appointment_id,
                service_id
            });
        }

        res.redirect('/');
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).render('403', {
            err_message: 'Failed to book appointment. Please try again.'
        });
    }
});

router.post('/cancel', async function (req, res) {
    const appointmentId = req.body.appointment_id;

    await appointmentService.cancelAppointment(appointmentId, req.session.authUser.user_id);

    res.redirect('/appointments?success=cancelled');
});

export default router;
