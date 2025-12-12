import db from '../config/database.js';

export function updateAppointmentStatus(appointment_id, status) {
    return db('appointments')
        .where('appointment_id', appointment_id)
        .update({ status: status });
}

export function getAllAppointments() {
    return db('appointments as ap')
        .join('users as cus', 'customer_id', 'cus.user_id')
        .join('users as vet', 'veterinarian_id', 'vet.user_id')
        .select(
            'ap.*',
            'cus.full_name as customer_name',
            'vet.full_name as veterinarian_name',
        );
}

export async function addAppointment(appointment) {
    const result = await db('appointments')
        .insert(appointment)
        .returning('appointment_id');

    const row = result[0];
    return typeof row === 'object' ? row.appointment_id : row;
}


export function addServiceForAppointment(appointmentService) {
    return db('appointment_services').insert(appointmentService);
}   

export async function getSchedule(veterinarian_id) {
    const rows = await db('appointments as a')
        .join('users as cus', 'a.customer_id', 'cus.user_id')
        .leftJoin('appointment_services as as', 'a.appointment_id', 'as.appointment_id')
        .leftJoin('services as s', 'as.service_id', 's.service_id')
        .where('a.veterinarian_id', veterinarian_id)
        .whereIn('a.status', ['scheduled', 'completed'])
        .select(
            'a.*', 
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