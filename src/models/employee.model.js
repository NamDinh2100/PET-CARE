import db from '../config/database.js';

export function getAllEmployees() {
    return db('users').whereNot('role', 'customer');
}

export function getAllVeterinarians() {
    return db('users').where('role', 'veterinarian');
}

export function countByEmpID() {
    return db('users')
        .whereNot('role', 'customer')
        .count('user_id as count').first();
}

export function findPageByEmpID(limit, offset) {
    return db('users')
        .whereNot('role', 'customer')
        .limit(limit)
        .offset(offset)
        .orderBy('user_id', 'asc');
}