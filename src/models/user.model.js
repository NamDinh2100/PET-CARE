import db from '../config/database.js';

export function getUserByID(id) {
    return db('users').where('user_id', id).first();
}

export function getUserByEmail(email) {
    return db('users').where('email', email).first();
}

export function addUser(user) {
    return db('users').insert(user);
}

export function updateUser(id, user) {
    return db('users').where('user_id', id).update(user);
}

export function updatePassword(id, hashedPassword) {
    return db('users').where('user_id', id).update({ password: hashedPassword });
}

export function deleteUser(id) {
    return db('users').where('user_id', id).del();
}