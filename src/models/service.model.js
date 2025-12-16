import db from '../config/database.js';

export function getAllServices() {
    return db('services');
}

export function countByService() {
    return db('services')
    .count('service_id as count').first();
}

export function findPageByService(limit, offset) {
    return db('services')
        .limit(limit)
        .offset(offset);
}

export function addService(service) {
    return db('services').insert(service);
}

export function updateService(id, service) {
    return db('services').where('id', id).update(service);
}

export function deleteService(id) {
    return db('services').where('id', id).del();
}

export function getServiceByName(name) {
    return db('services').where('name', 'like', `%${name}%`);
}

