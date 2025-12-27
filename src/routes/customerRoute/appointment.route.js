import express from 'express';
import * as appointmentService from '../../models/appointment.model.js';
import * as petService from '../../models/pet.model.js';
import * as serviceService from '../../models/service.model.js';
import * as invoiceService from '../../models/invoice.model.js';
import * as medicineService from '../../models/medicine.model.js';  

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

// Get invoice data for completed appointment
router.get('/:id/invoice', async function (req, res) {
    try {
        const appointmentId = req.params.id;
        
        // Get appointment details
        const appointment = await appointmentService.getAppointmentByID(appointmentId);
        const invoice = await invoiceService.getInvoiceByAppointmentID(appointmentId);
        
        if (!appointment) {
            return res.json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        // Verify appointment belongs to current user
        if (appointment.customer_id !== req.session.authUser.user_id) {
            return res.json({
                success: false,
                message: 'Unauthorized'
            });
        }
        
        // Get services for this appointment
        const services = await appointmentService.getServicesForAppointment(appointmentId);
        
        // Calculate totals
        let subtotal = 0;
        services.forEach(service => {
            subtotal += parseFloat(service.base_price) || 0;
        });
        
        const discount = invoice.discount ? parseFloat(invoice.discount) : 0; // Can be customized based on your business logic
        const total = subtotal - (subtotal * discount / 100);
        
        res.json({
            success: true,
            appointment: {
                appointment_id: appointment.appointment_id,
                date_start: appointment.date_start,
                time: appointment.time,
                customer_name: appointment.customer_name,
                veterinarian_name: appointment.veterinarian_name,
                pet_name: appointment.pet_name,
                status: appointment.status
            },
            services: services,
            summary: {
                subtotal: subtotal,
                discount: discount,
                total: total
            },
            payment: {
                id: invoice.invoice_id,
                method: invoice.payment_method || 'N/A',
                status: invoice.payment_status || 'N/A'
            }
        });
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.json({
            success: false,
            message: 'Error loading invoice'
        });
    }
});

router.get('/:id/record', async function (req, res) {   
    const appointmentId = req.params.id;

    const medicine_records = await medicineService.getMedicineRecords(appointmentId);
    const medicines = await medicineService.getMedicineByRecordID(medicine_records.record_id);

    res.json({
        success: true,
        medicines: medicines,
        medicine_records: medicine_records
    });
});

router.post('/invoice/pay/:id', async function (req, res) {
    try {
        const paymentMethod = req.body.payment_method;
        const invoice_id = req.params.id;
        // Update payment status and method
        await invoiceService.payInvoice(invoice_id, paymentMethod);

        res.redirect('/appointments?success=paid');
    } catch (error) {
        console.error('Error processing payment:', error);
        res.redirect('/appointments?error=payment_failed');
    }
});

export default router;
