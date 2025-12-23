import db from '../config/database.js';

export function getAppointmentByID(appointment_id) {
    return db('appointments as ap')
        .join('users as cus', 'ap.customer_id', 'cus.user_id')
        .leftJoin('users as vet', 'ap.veterinarian_id', 'vet.user_id')
        .select('ap.*', 'cus.full_name as customer_name', 'vet.full_name as veterinarian_name')
        .where('appointment_id', appointment_id).first();
}

export function updateAppointmentStatus(appointment_id, status) {
    return db('appointments')
        .where('appointment_id', appointment_id)
        .update({ status: status });
}

export function countByAppointment() {
    return db('appointments as ap')
    .count('ap.appointment_id as count').first();
}

export function findPageByAppointment(limit, offset) {
    return db('appointments as ap')
        .join('users as cus', 'ap.customer_id', 'cus.user_id')
        .leftJoin('users as vet', 'ap.veterinarian_id', 'vet.user_id')
        .select(
            'ap.*',
            'cus.full_name as customer_name',
            'vet.full_name as veterinarian_name',
        )
        .limit(limit)
        .offset(offset).orderBy('ap.appointment_id', 'asc');
}

export function countByStatus(status) {
    return db('appointments')
        .where('status', status)
        .count('appointment_id as count').first();
}

export function findPageByStatus(status, limit, offset) {
    return db('appointments as ap')
        .join('users as cus', 'ap.customer_id', 'cus.user_id')
        .leftJoin('users as vet', 'ap.veterinarian_id', 'vet.user_id')
        .select(
            'ap.*',
            'cus.full_name as customer_name',
            'vet.full_name as veterinarian_name',
        )
        .where('ap.status', status)
        .limit(limit)
        .offset(offset).orderBy('ap.appointment_id', 'asc');
}

export function searchAppointments(field, query, limit, offset) {
    const baseQuery = db('appointments as ap')
        .join('users as cus', 'ap.customer_id', 'cus.user_id')
        .leftJoin('users as vet', 'ap.veterinarian_id', 'vet.user_id')
        .select(
            'ap.*',
            'cus.full_name as customer_name',
            'vet.full_name as veterinarian_name',
        );

    switch (field) {
        case 'id':
            return baseQuery
                .where('ap.appointment_id', '=', query)
                .limit(limit)
                .offset(offset)
                .orderBy('ap.appointment_id', 'asc');
        case 'customer':
            return baseQuery
                .where('cus.full_name', 'ilike', `%${query}%`)
                .limit(limit)
                .offset(offset)
                .orderBy('ap.appointment_id', 'asc');
        case 'veterinarian':
            return baseQuery
                .where('vet.full_name', 'ilike', `%${query}%`)
                .limit(limit)
                .offset(offset)
                .orderBy('ap.appointment_id', 'asc');
        case 'status':
            return baseQuery
                .where('ap.status', 'ilike', `%${query}%`)
                .limit(limit)
                .offset(offset)
                .orderBy('ap.appointment_id', 'asc');
        default:
            // Search all fields
            return baseQuery
                .where(function() {
                    this.where('ap.appointment_id', '=', query)
                        .orWhere('cus.full_name', 'ilike', `%${query}%`)
                        .orWhere('vet.full_name', 'ilike', `%${query}%`)
                        .orWhere('ap.status', 'ilike', `%${query}%`);
                })
                .limit(limit)
                .offset(offset)
                .orderBy('ap.appointment_id', 'asc');
    }
}

export function countSearchAppointments(field, query) {
    const baseQuery = db('appointments as ap')
        .join('users as cus', 'ap.customer_id', 'cus.user_id')
        .leftJoin('users as vet', 'ap.veterinarian_id', 'vet.user_id');

    switch (field) {
        case 'id':
            return baseQuery
                .where('ap.appointment_id', '=', query)
                .count('ap.appointment_id as count').first();
        case 'customer':
            return baseQuery
                .where('cus.full_name', 'ilike', `%${query}%`)
                .count('ap.appointment_id as count').first();
        case 'veterinarian':
            return baseQuery
                .where('vet.full_name', 'ilike', `%${query}%`)
                .count('ap.appointment_id as count').first();
        case 'status':
            return baseQuery
                .where('ap.status', 'ilike', `%${query}%`)
                .count('ap.appointment_id as count').first();
        default:
            // Count all fields
            return baseQuery
                .where(function() {
                    this.where('ap.appointment_id', '=', query)
                        .orWhere('cus.full_name', 'ilike', `%${query}%`)
                        .orWhere('vet.full_name', 'ilike', `%${query}%`)
                        .orWhere('ap.status', 'ilike', `%${query}%`);
                })
                .count('ap.appointment_id as count').first();
    }
}

export async function addAppointment(appointment) {
    const result = await db('appointments')
        .insert(appointment)
        .returning('*');

    const row = result[0];
    return typeof row === 'object' ? row.appointment_id : row;
}

export function addServiceForAppointment(appointmentService) {
    return db('appointment_services').insert(appointmentService);
}

// Get services for a specific appointment
export function getServicesForAppointment(appointment_id) {
    return db('appointment_services as aps')
        .join('services as s', 'aps.service_id', 's.service_id')
        //.join('pets as p', 'aps.pet_id', 'p.pet_id')
        .where('aps.appointment_id', appointment_id)
        .select(
            's.service_id',
            's.service_name',
            's.base_price as price'
        );
}   

export async function getSchedule(veterinarian_id) {
    const rows = await db('appointments as a')
        .join('users as cus', 'a.customer_id', 'cus.user_id')
        .leftJoin('appointment_services as as', 'a.appointment_id', 'as.appointment_id')
        .leftJoin('services as s', 'as.service_id', 's.service_id')
        .where('a.veterinarian_id', veterinarian_id)
        .whereIn('a.status', ['confirmed', 'completed']) // Must fixed statuses
        .select(
            'a.*', 
            'cus.user_id as customer_id',
            'cus.full_name as customer_name',
            's.service_id',
            's.service_name',
            's.base_price'
        );
    
    // Group appointments and their services
    const appointmentMap = new Map();
    
    rows.forEach(row => {
        if (!appointmentMap.has(row.appointment_id)) {
            appointmentMap.set(row.appointment_id, {
                appointment_id: row.appointment_id,
                customer_id: row.customer_id,
                pet_id: row.pet_id,
                customer_name: row.customer_name,
                veterinarian_id: row.veterinarian_id,
                date_start: row.date_start,
                date_end: row.date_end,
                time: row.time,
                status: row.status,
                note: row.note,
                services: []
            });
        }
        
        appointmentMap.get(row.appointment_id).services.push({
            service_id: row.service_id,
            service_name: row.service_name,
            price: row.base_price
        });
    });
    
    return Array.from(appointmentMap.values());
}

export function updateAppointment(appointment_id, updatedAppointment) {
    return db('appointments')
        .where('appointment_id', appointment_id)
        .update(updatedAppointment);
}

export function updateAppointmentPet(appointment_id, pet_id) {
    return db('appointments')
        .where('appointment_id', appointment_id)
        .update({ pet_id: pet_id });
}

export function getMedicalHistoryByPetID(pet_id) {
    return db('appointments as a')
        .where('a.pet_id', pet_id)
        .andWhere('a.status', 'completed')
        .join('users as cus', 'a.customer_id', 'cus.user_id')
        .join('users as vet', 'a.veterinarian_id', 'vet.user_id')
        .select(
            'a.*',
            'cus.full_name as customer_name',
            'vet.full_name as veterinarian_name',
        );
} 

// HOP

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

