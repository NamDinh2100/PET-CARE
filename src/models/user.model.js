import db from '../utils/db.js';

export function listAllUser() {
    return db('customers');
}

export function listAllEmployee() {
    return db('employees');
}




export function add(user) {
    return db('customers').insert(user);
}

export function findByEmail(email) {
    return db('customers').where('email', email).first();
}