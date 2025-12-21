import db from '../config/database.js';

export function getAllCustomer() {
    return db('users').where('role', 'customer');
}

export function countByCustomer() {
    return db('users')
    .where('role', 'customer')
    .count('user_id as count').first();
}

export function findPageByCustomer(limit, offset) {
    return db('users')
        .where('role', 'customer')
        .limit(limit)
        .offset(offset);
}



