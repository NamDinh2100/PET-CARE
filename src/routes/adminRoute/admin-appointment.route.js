import express from 'express';
import * as appointmentService from '../../models/appointment.model.js';
import * as userService from '../../models/user.model.js';
import * as serviceService from '../../models/service.model.js';
import * as employeeService from '../../models/employee.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const status = req.query.status;
    const searchQuery = req.query.q;
    const searchField = req.query.field || 'all';
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const offset = (page - 1) * limit;

    let total;
    let list;
    let isSearchMode = false;

    if (searchQuery && searchQuery.trim()) {
        // Search mode
        isSearchMode = true;
        
        // Validate ID search - must be a number
        if (searchField === 'id' && isNaN(searchQuery)) {
            // If searching by ID but query is not a number, return no results
            total = { count: 0 };
            list = [];
        } else {
            total = await appointmentService.countSearchAppointments(searchField, searchQuery);
            list = await appointmentService.searchAppointments(searchField, searchQuery, limit, offset);
        }
    } else if (status) {
        // Filter by status
        total = await appointmentService.countByStatus(status);
        list = await appointmentService.findPageByStatus(status, limit, offset);
    } else {
        // Show all appointments
        total = await appointmentService.countByAppointment();
        list = await appointmentService.findPageByAppointment(limit, offset);
    }

    const nPages = Math.ceil(+total.count / limit);
    const pageNumbers = [];

    for (let i = 1; i <= nPages; i++) {
        let href = `?page=${i}`;
        if (isSearchMode) {
            href = `?q=${encodeURIComponent(searchQuery)}&field=${searchField}&page=${i}`;
        } else if (status) {
            href = `?status=${status}&page=${i}`;
        }
        
        pageNumbers.push({
            value: i,
            isCurrent: i === +page,
            href: href
        });
    }

    res.render('vwAdmin/vwAppointment/list', { 
        appointments: list,
        pageNumbers: pageNumbers,
        currentStatus: status,
        searchQuery: searchQuery,
        searchField: searchField,
        isSearchMode: isSearchMode,
        layout: 'admin-layout'
    });
});

router.get('/edit', async function (req, res) {
    const id = req.query.id;
    const appointment = await appointmentService.getAppointmentByID(id);
    const vetList = await employeeService.getAllVeterinarians();

    const serviceList = await serviceService.getServiceByAppointmentID(id);
    res.render('vwAdmin/vwAppointment/edit', {
        appointment: appointment,
        vet: vetList,
        service: serviceList,
        layout: 'admin-layout'
    });
});

router.post('/edit', async function (req, res) {
    const id = req.query.id;
    const updatedAppointment = {
        veterinarian_id: +req.body.veterinarian,
        status: 'confirmed'
    };

    await appointmentService.updateAppointment(id, updatedAppointment);
    res.redirect('/admin/appointments');
});

router.get('/view', async function (req, res) {
    const id = req.query.id;
    const appointment = await appointmentService.getAppointmentByID(id);
    const serviceList = await serviceService.getServiceByAppointmentID(id);

    res.render('vwAdmin/vwAppointment/view', {
        appointment: appointment,
        service: serviceList,
        layout: 'admin-layout'
    });
});

export default router;