import db from '../config/database.js';

// Get all appointments by customer ID
export function getAppointmentsByCustomer(customer_id) {
    return db('appointments as ap')
        .leftJoin('users as vet', 'ap.veterinarian_id', 'vet.user_id')
        .leftJoin('pets as p', 'ap.pet_id', 'p.pet_id')
        .leftJoin('appointment_services as aps', 'ap.appointment_id', 'aps.appointment_id')
        .leftJoin('services as s', 'aps.service_id', 's.service_id')
        .where('ap.customer_id', customer_id)
        .select(
            'ap.appointment_id',
            'ap.customer_id',
            'ap.pet_id',
            'ap.veterinarian_id',
            'ap.status',
            'ap.time',
            'ap.note',
            db.raw("TO_CHAR(ap.date_start, 'DD/MM/YYYY') as date_start"),
            'vet.full_name as veterinarian_name',
            'p.name as pet_name',
            db.raw('STRING_AGG(s.service_name, \', \') as services')
        )
        .groupBy('ap.appointment_id', 'vet.full_name', 'p.name')
        .orderBy('ap.appointment_id', 'desc');
}

// Get single appointment by ID (for customer)
export function getAppointmentById(appointment_id, customer_id) {
    return db('appointments as ap')
        .leftJoin('users as vet', 'ap.veterinarian_id', 'vet.user_id')
        .leftJoin('pets as p', 'ap.pet_id', 'p.pet_id')
        .where('ap.appointment_id', appointment_id)
        .where('ap.customer_id', customer_id)
        .select(
            'ap.*',
            'vet.full_name as veterinarian_name',
            'p.name as pet_name'
        )
        .first();
}

// Cancel appointment
export function cancelAppointment(appointment_id, customer_id) {
    return db('appointments')
        .where('appointment_id', appointment_id)
        .where('customer_id', customer_id)
        .where('status', 'scheduled')
        .update({ status: 'cancelled' });
}

// Get upcoming appointments
export function getUpcomingAppointments(customer_id) {
    return db('appointments as ap')
        .leftJoin('users as vet', 'ap.veterinarian_id', 'vet.user_id')
        .leftJoin('pets as p', 'ap.pet_id', 'p.pet_id')
        .where('ap.customer_id', customer_id)
        .where('ap.status', 'scheduled')
        .where('ap.date_start', '>=', db.fn.now())
        .select(
            'ap.*',
            'vet.full_name as veterinarian_name',
            'p.name as pet_name'
        )
        .orderBy('ap.date_start', 'asc');
}

// Get past appointments
export function getPastAppointments(customer_id) {
    return db('appointments as ap')
        .leftJoin('users as vet', 'ap.veterinarian_id', 'vet.user_id')
        .leftJoin('pets as p', 'ap.pet_id', 'p.pet_id')
        .where('ap.customer_id', customer_id)
        .whereIn('ap.status', ['completed', 'cancelled'])
        .select(
            'ap.*',
            'vet.full_name as veterinarian_name',
            'p.name as pet_name'
        )
        .orderBy('ap.date_start', 'desc');
}

// Add new appointment
export function addAppointment(appointment) {
    return db('appointments').insert(appointment).returning('*');
}

// Add service to appointment
export function addAppointmentService(appointment_id, service_id) {
    return db('appointment_services').insert({
        appointment_id: appointment_id,
        service_id: service_id
    });
}

