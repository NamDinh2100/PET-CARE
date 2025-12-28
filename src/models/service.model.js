import db from '../config/database.js';

export function getAllServices() {
    return db('services');
}

export function getServiceByID(service_id) {
    return db('services').where('service_id', service_id).first();
}

export function getServiceByName(name) {
    return db('services').where('service_name', 'like', `%${name}%`);
}

export function countByService() {
    return db('services')
    .count('service_id as count').first();
}

export function findPageByService(limit, offset) {
    return db('services')
        .limit(limit)
        .offset(offset)
        .orderBy('service_id', 'asc');
}

export function addService(service) {
    return db('services').insert(service);
}

export function updateService(id, service) {
    return db('services').where('service_id', id).update(service);
}

export function getServiceByAppointmentID(appointment_id) {
    return db('appointment_services as as')
        .join('services as s', 'as.service_id', 's.service_id')
        .where('as.appointment_id', appointment_id)
        .select('s.service_name');
}

export function searchServices(field, query, limit, offset) {
    const baseQuery = db('services');

    switch (field) {
        case 'id':
            return baseQuery
                .where('service_id', '=', query)
                .limit(limit)
                .offset(offset)
                .orderBy('service_id', 'asc');
        case 'name':
            return baseQuery
                .where('service_name', 'ilike', `%${query}%`)
                .limit(limit)
                .offset(offset)
                .orderBy('service_id', 'asc');
        case 'price':
            return baseQuery
                .where('base_price', '=', query)
                .limit(limit)
                .offset(offset)
                .orderBy('service_id', 'asc');
        default:
            // Search text fields only (exclude service_id and base_price as they require numbers)
            return baseQuery
                .where('service_name', 'ilike', `%${query}%`)
                .limit(limit)
                .offset(offset)
                .orderBy('service_id', 'asc');
    }
}

export function countSearchServices(field, query) {
    const baseQuery = db('services');

    switch (field) {
        case 'id':
            return baseQuery
                .where('service_id', '=', query)
                .count('service_id as count').first();
        case 'name':
            return baseQuery
                .where('service_name', 'ilike', `%${query}%`)
                .count('service_id as count').first();
        case 'price':
            return baseQuery
                .where('base_price', '=', query)
                .count('service_id as count').first();
        default:
            // Search text fields only (exclude service_id and base_price as they require numbers)
            return baseQuery
                .where('service_name', 'ilike', `%${query}%`)
                .count('service_id as count').first();
    }
}