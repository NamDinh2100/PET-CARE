import db from '../config/database.js';

export function getAllMedicines() {
    return db('medicines');
}

export function addMedicine(medicine) {
    return db('medicines').insert(medicine);
}

export function updateMedicine(id, medicine) {
    return db('medicines').where('id', id).update(medicine);
}

export function deleteMedicine(id) {
    return db('medicines').where('id', id).del();
}

export function getMedicineByName(name) {
    return db('medicines').where('name', 'like', `%${name}%`);
}