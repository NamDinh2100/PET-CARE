import express from 'express';
import * as appointmentService from '../../models/appointment.model.js';
import * as prescriptionService from '../../models/prescription.model.js';
import * as petService from '../../models/pet.model.js';
import * as invoiceService from '../../models/invoice.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const schedule = await appointmentService.getSchedule(req.session.authUser.user_id);

    res.render('vwVeterinarian/appointment', { 
        schedule, 
        layout: 'vet-layout' 
    });
});

router.post('/prescription', async function (req, res) {
    
    try {
    const medicines = req.body.medicine_id;    

    const record = {
        appointment_id: +req.body.appointment_id,
        pet_id: +req.body.pet_id,
        veterinarian_id: +req.session.authUser.user_id,
        symptoms: req.body.symptoms,
        treatment: req.body.treatment,
        diagnosis: req.body.diagnosis,
        instruction: req.body.instruction,
        visit_date: new Date()
    };

    const record_id = await prescriptionService.addMedicalRecord(record);
    const prescription_id = await prescriptionService.addPrescription(record_id);

    for (const medicine_id of medicines) {
        await prescriptionService.addMedicineForPrescription({
            prescription_id: prescription_id,
            medicine_id: medicine_id
        });
    }

    await appointmentService.updateAppointmentStatus(req.body.appointment_id, 'completed');

    const serviceList = await appointmentService.getServicesForAppointment(req.body.appointment_id);
    let totalCost = 0;
    
    console.log('Service list for appointment', req.body.appointment_id, ':', serviceList);
    
    for (const service of serviceList) {
        const price = parseFloat(service.base_price) || 0;
        console.log('Service:', service.service_name || 'Unknown', 'Price:', service.base_price, 'Parsed:', price);
        totalCost += price;
    }

    console.log('Total cost for appointment', req.body.appointment_id, ':', totalCost);

    await invoiceService.addInvoice({
        appointment_id: req.body.appointment_id,
        total_price: totalCost,
        payment_status: 'unpaid',
        payment_method: null,                                           
        discount: 0,
    });

    res.redirect('/vet/appointment');
    } catch (error) {
        console.error('Error processing prescription:', error);
        res.status(500).send('An error occurred while processing the prescription.');
    }
});

router.get('/pet-info', async function (req, res) {
    const appointment_id = req.query.appointment_id;
    const customer_id = req.query.customer_id;
    const pet_id = req.query.pet_id;
    let pet = null;
    if (pet_id) 
        pet = await petService.getPetByID(pet_id);

    res.render('vwVeterinarian/petInfo', {
        pet: pet,
        customer_id: customer_id,
        appointment_id: appointment_id,
        layout: 'vet-layout'
    });

});

router.post('/pet-info', async function (req, res) {
    const pet_id = req.query.pet_id;
    const updatedPet = {
        name: req.body.name,
        species: req.body.species,
        sex: req.body.sex,
        weight: req.body.weight,
        notes: req.body.notes
    };

    console.log('Updating pet info for pet_id:', pet_id, 'with data:', updatedPet);
    await petService.updatePetInfo(pet_id, updatedPet);
    res.redirect('/vet/appointment');
});

router.post('/pet-info/add', async function (req, res) {
    const newPet = {
        owner_id: req.body.owner_id,
        name: req.body.name,
        species: req.body.species,
        sex: req.body.sex,
        day_born: req.body.dob,
        weight: req.body.weight,
        notes: req.body.notes
    };

    const pet_id = await petService.addPet(newPet);
    await appointmentService.updateAppointmentPet(req.body.appointment_id, pet_id[0].pet_id);

    res.redirect('/vet/appointment');
});

router.get('/pet-info/medical-history', async function (req, res) {
    const pet_id = req.query.pet_id;
    const medicalHistory = await appointmentService.getMedicalHistoryByPetID(pet_id);
    res.render('vwVeterinarian/medicalHistory', {
        medicalHistory: medicalHistory,
        layout: 'vet-layout'
    });
});

export default router;