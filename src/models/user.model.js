import db from '../config/database.js';

export function getAllUsers() {
    return db('users');
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