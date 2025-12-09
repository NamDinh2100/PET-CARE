import db from '../config/database.js';

export function getAllUsers() {
    return db('users').where('role', 'owner');
}

export function countByEmpID() {
    return db('users')
    .whereNot('role', 'owner')
    .count('user_id as count').first();
}

export function findPageByEmpID(limit, offset) {
    return db('users')
        .whereNot('role', 'owner')
        .limit(limit)
        .offset(offset);
}

export function addUser(user) {
    return db('users').insert(user);
}

export function updateUser(id, user) {
    return db('users').where('id', id).update(user);
}

export function deleteUser(id) {
    return db('users').where('id', id).del();
}

export function getUserByName(name) {
    return db('users').where('name', 'like', `%${name}%`);
}

// Employee-specific functions
export function getAllEmployees() {
    return db('users').whereNot('role', 'owner');
}

export function addEmployee(employee) {
    return db('users').insert(employee);
}

export function getEmployeeByID(id) {
    return db('users').where('user_id', id).first();
}

export function updateEmployee(id, employee) {
    return db('users').where('user_id', id).update(employee);
}

export function deleteEmployee(id) {
    return db('users').where('user_id', id).del();
}
