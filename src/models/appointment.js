import db from '../config/database.js';

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
