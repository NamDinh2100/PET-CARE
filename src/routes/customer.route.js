import express from 'express'
import * as appointmentService from '../models/appointment.model.js'
import * as petService from '../models/pet.model.js'

const router = express.Router();

router.post('/appointment/book', async function (req, res) {
  try {
    // Prepare data
    const appointmentData = {
      customer_id: req.session?.authUser?.user_id,
      pet_id: req.body.pet_id,
      date_start: req.body.date_start,
      time: req.body.time,
      note: req.body.note,
      status: 'scheduled'
    };

    // Add appointment - service may return many shapes; normalize to an integer id
    const insertResult = await appointmentService.addAppointment(appointmentData);

    // Normalize appointment_id from insertResult
    let appointment_id;
    if (Array.isArray(insertResult)) {
      // handle [38], [{ appointment_id: 38 }], [{ id: 38 }]
      const first = insertResult[0];
      if (typeof first === 'object' && first !== null) {
        appointment_id = first.appointment_id ?? first.id ?? first[Object.keys(first)[0]];
      } else {
        appointment_id = first;
      }
    } else if (typeof insertResult === 'object' && insertResult !== null) {
      appointment_id = insertResult.appointment_id ?? insertResult.id;
    } else {
      appointment_id = insertResult;
    }

    // ensure it's a number
    appointment_id = Number(appointment_id);
    if (!Number.isFinite(appointment_id)) throw new Error('Invalid appointment_id returned from DB');

    // services may be single value or array; normalize
    let servicesList = req.body.services;
    if (!servicesList) servicesList = [];
    else if (!Array.isArray(servicesList)) servicesList = [servicesList];

    // add each service (convert service_id to number too)
    for (const svc of servicesList) {
      const service_id = Number(svc);
      if (!Number.isFinite(service_id)) {
        console.warn('Skipping invalid service_id:', svc);
        continue;
      }
      const appointmentServiceRecord = {
        appointment_id,
        service_id
      };
      console.log('Adding service to appointment:', appointmentServiceRecord);
      await appointmentService.addServiceForAppointment(appointmentServiceRecord);
    }

    res.redirect('/');
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).render('403', {
      err_message: 'Failed to book appointment. Please try again.'
    });
  }
});

router.get('/my-profile', function (req, res) {
    res.render('vwCustomer/profile', {
        activeTab: 'profile'
    });
})

router.get('/my-pets', async function (req, res) {
    const user = req.session.authUser;
    const list = await petService.getPetByID(user.user_id);

    res.render('vwCustomer/profile', {
        activeTab: 'pet',
        pets: list
    })
})

router.get('/my-appointments', function (req, res) {
    res.render('vwCustomer/profile', {
        activeTab: 'appointments'
    });
});

export default router;