import db from '../config/database.js'

export function getPetByID(cus_id) {
    return db('pets').where('owner_id', cus_id);
}