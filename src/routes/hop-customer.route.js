/**
 * Hop Customer Routes - New features for Branch Hop
 * File này thêm các routes mới cho Customer mà không đụng vào customer.route.js hiện có
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import * as userService from '../models/user.model.js';
import * as petService from '../models/customer-pet.model.js';
import * as appointmentService from '../models/customer-appointment.model.js';
import * as serviceService from '../models/service.model.js';

const router = express.Router();

// Middleware to check if user is logged in and is a customer (owner)
function isCustomer(req, res, next) {
    if (!req.session.isAuth) {
        req.session.retUrl = req.originalUrl;
        return res.redirect('/account/signin');
    }
    if (req.session.authUser.role !== 'owner') {
        return res.status(403).render('403');
    }
    next();
}

// ==================== PROFILE ROUTES ====================

// GET /customer/profile - View profile (enhanced version)
router.get('/profile', isCustomer, async function (req, res) {
    const user = await userService.getUserByEmail(req.session.authUser.email);
    const success = req.query.success;
    const error = req.query.error;

    res.render('vwCustomer/customer-profile', {
        user: user,
        activeTab: 'profile',
        success: success,
        error: error
    });
});

// POST /customer/profile/update - Update profile
router.post('/profile/update', isCustomer, async function (req, res) {
    const userId = req.session.authUser.user_id;
    const updatedUser = {
        full_name: req.body.full_name,
        phone: req.body.phone
    };

    await userService.updateUser(userId, updatedUser);

    // Update session
    req.session.authUser.full_name = updatedUser.full_name;
    req.session.authUser.phone = updatedUser.phone;

    res.redirect('/customer/profile?success=updated');
});

// POST /customer/profile/password - Change password
router.post('/profile/password', isCustomer, async function (req, res) {
    const user = await userService.getUserByEmail(req.session.authUser.email);

    const isMatch = bcrypt.compareSync(req.body.current_password, user.password);
    if (!isMatch) {
        return res.redirect('/customer/profile?error=wrong_password');
    }

    if (req.body.new_password !== req.body.confirm_password) {
        return res.redirect('/customer/profile?error=password_mismatch');
    }

    const hashPassword = bcrypt.hashSync(req.body.new_password);
    await userService.updateUser(user.user_id, { password: hashPassword });

    res.redirect('/customer/profile?success=password_changed');
});

// ==================== PET ROUTES (CRUD) ====================

// GET /customer/pets - View all pets with full CRUD
router.get('/pets', isCustomer, async function (req, res) {
    const pets = await petService.getPetsByOwner(req.session.authUser.user_id);
    const success = req.query.success;

    res.render('vwCustomer/pet-list', {
        pets: pets,
        activeTab: 'pets',
        success: success,
        isAddMode: false
    });
});

// GET /customer/pets/add - Show add pet modal
router.get('/pets/add', isCustomer, async function (req, res) {
    const pets = await petService.getPetsByOwner(req.session.authUser.user_id);
    res.render('vwCustomer/pet-list', {
        pets: pets,
        activeTab: 'pets',
        isAddMode: true
    });
});

// POST /customer/pets/add - Add new pet
router.post('/pets/add', isCustomer, async function (req, res) {
    const pet = {
        owner_id: req.session.authUser.user_id,
        name: req.body.name,
        species: req.body.species,
        sex: req.body.sex || null,
        day_born: req.body.day_born || null,
        weight: req.body.weight || null,
        notes: req.body.notes || null
    };

    await petService.addPet(pet);

    // Update session pets
    const pets = await petService.getPetsByOwner(req.session.authUser.user_id);
    req.session.pets = pets;

    res.redirect('/customer/pets?success=added');
});

// GET /customer/pets/edit - Show edit pet modal
router.get('/pets/edit', isCustomer, async function (req, res) {
    const petId = req.query.id;
    const pet = await petService.getPetById(petId);

    // Check if pet belongs to this customer
    if (!pet || pet.owner_id !== req.session.authUser.user_id) {
        return res.status(404).render('404');
    }

    const pets = await petService.getPetsByOwner(req.session.authUser.user_id);
    res.render('vwCustomer/pet-list', {
        pets: pets,
        editPet: pet,
        activeTab: 'pets',
        isEditMode: true
    });
});

// POST /customer/pets/edit - Update pet
router.post('/pets/edit', isCustomer, async function (req, res) {
    const petId = req.query.id;
    const pet = await petService.getPetById(petId);

    // Check if pet belongs to this customer
    if (!pet || pet.owner_id !== req.session.authUser.user_id) {
        return res.status(404).render('404');
    }

    const updatedPet = {
        name: req.body.name,
        species: req.body.species,
        sex: req.body.sex || null,
        day_born: req.body.day_born || null,
        weight: req.body.weight || null,
        notes: req.body.notes || null
    };

    await petService.updatePet(petId, updatedPet);

    // Update session pets
    const pets = await petService.getPetsByOwner(req.session.authUser.user_id);
    req.session.pets = pets;

    res.redirect('/customer/pets?success=updated');
});

// GET /customer/pets/delete - Delete pet
router.get('/pets/delete', isCustomer, async function (req, res) {
    const petId = req.query.id;
    const pet = await petService.getPetById(petId);

    // Check if pet belongs to this customer
    if (!pet || pet.owner_id !== req.session.authUser.user_id) {
        return res.status(404).render('404');
    }

    await petService.deletePet(petId);

    // Update session pets
    const pets = await petService.getPetsByOwner(req.session.authUser.user_id);
    req.session.pets = pets;

    res.redirect('/customer/pets?success=deleted');
});

// ==================== APPOINTMENT ROUTES ====================

// GET /customer/appointments - View all appointments with filters
router.get('/appointments', isCustomer, async function (req, res) {
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

    const pets = await petService.getPetsByOwner(req.session.authUser.user_id);
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

// POST /customer/appointments/cancel - Cancel appointment
router.post('/appointments/cancel', isCustomer, async function (req, res) {
    const appointmentId = req.body.appointment_id;

    await appointmentService.cancelAppointment(appointmentId, req.session.authUser.user_id);

    res.redirect('/customer/appointments?success=cancelled');
});

// POST /customer/appointments/book - Book new appointment
router.post('/appointments/book', isCustomer, async function (req, res) {
    try {
        const appointment = {
            customer_id: req.session.authUser.user_id,
            pet_id: parseInt(req.body.pet_id),
            date_start: req.body.appointment_date,
            date_end: req.body.appointment_date,
            time: req.body.appointment_time,
            status: 'scheduled',
            note: req.body.notes || null,
            created_at: new Date()
        };

        // Insert appointment and get the ID
        const [newAppointment] = await appointmentService.addAppointment(appointment);

        // Add service to appointment_services
        if (req.body.service_id && newAppointment) {
            await appointmentService.addAppointmentService(newAppointment.appointment_id || newAppointment, parseInt(req.body.service_id));
        }

        res.redirect('/customer/appointments?success=booked');
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.redirect('/customer/appointments?error=booking_failed');
    }
});

export default router;

