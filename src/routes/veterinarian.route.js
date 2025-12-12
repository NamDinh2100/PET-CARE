import express from 'express';
import * as appointmentService from '../models/appointment.model.js';
import * as prescriptionService from '../models/prescription.model.js';

const router = express.Router();

router.get('/schedule', async function (req, res) {
    res.render('vwVeterinarian/schedule')
});

router.get('/appointment', async function (req, res) {
    const schedule = await appointmentService.getSchedule(req.session.authUser.user_id);
    //const medicines = await prescriptionService.getAllMedicines();
    res.render('vwVeterinarian/appointment', { schedule });
});

router.post('/appointment/prescription', async function (req, res) {
    
    const medicines = req.body.medicine_id;
    
    const record = {
        appointment_id: req.body.appointment_id,
        pet_id: req.body.pet_id,
        veterinarian_id: req.session.authUser.user_id,
        symptoms: req.body.symptoms,
        treatment: req.body.treatment,
        diagnosis: req.body.diagnosis,
        instruction: req.body.instruction
    };

    console.log(record);
    const record_id = await prescriptionService.addMedicalRecord(record);
    const prescription_id = await prescriptionService.addPrescription(record_id);

    for (const medicine_id of medicines) {
        await prescriptionService.addMedicineForPrescription({
            prescription_id: prescription_id,
            medicine_id: medicine_id
        });
    }

    await appointmentService.updateAppointmentStatus(req.body.appointment_id, 'completed');

    res.redirect('/vet/appointment');
});

export default router;