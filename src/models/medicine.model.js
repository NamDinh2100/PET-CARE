import db from '../config/database.js';

export function getAllMedicines() {
    return db('medicines');
}

export function getMedicineByID(id) {
    return db('medicines').where('medicine_id', id).first();
}

export function getMedicineByName(name) {
    return db('medicines').where('name', 'like', `%${name}%`);
}

export function getMedicineRecords(appointmentId) {
    return db('medical_records as mr')
        .where('mr.appointment_id', appointmentId).first();
}

export function getMedicineByRecordID(recordId) {
    return db('medicines as m')
        .join('prescription_medicine as pm', 'pm.medicine_id', 'm.medicine_id')
        .join('prescription as p', 'pm.prescription_id', 'p.prescription_id')
        .where('p.record_id', recordId)
        .select('m.*');
}

export function countByMedicine() {
    return db('medicines')
    .count('medicine_id as count').first();
}

export function findPageByMedicine(limit, offset) {
    return db('medicines')
        .limit(limit)
        .offset(offset);
}

export function addMedicine(medicine) {
    return db('medicines').insert(medicine);
}

export function updateMedicine(id, medicine) {
    return db('medicines').where('medicine_id', id).update(medicine);
}



export function searchMedicines(field, query, limit, offset) {
    const baseQuery = db('medicines');

    switch (field) {
        case 'id':
            return baseQuery
                .where('medicine_id', '=', query)
                .limit(limit)
                .offset(offset)
                .orderBy('medicine_id', 'asc');
        case 'name':
            return baseQuery
                .where('medicine_name', 'ilike', `%${query}%`)
                .limit(limit)
                .offset(offset)
                .orderBy('medicine_id', 'asc');
        case 'form':
            return baseQuery
                .where('form', 'ilike', `%${query}%`)
                .limit(limit)
                .offset(offset)
                .orderBy('medicine_id', 'asc');
        case 'category':
            return baseQuery
                .where('category', 'ilike', `%${query}%`)
                .limit(limit)
                .offset(offset)
                .orderBy('medicine_id', 'asc');
        default:
            return baseQuery
                .where(function() {
                    this.where('medicine_id', '=', query)
                        .orWhere('name', 'ilike', `%${query}%`)
                        .orWhere('form', 'ilike', `%${query}%`)
                        .orWhere('category', 'ilike', `%${query}%`);
                })
                .limit(limit)
                .offset(offset)
                .orderBy('medicine_id', 'asc');
    }
}

export function countSearchMedicines(field, query) {
    const baseQuery = db('medicines');

    switch (field) {
        case 'id':
            return baseQuery
                .where('medicine_id', '=', query)
                .count('medicine_id as count').first();
        case 'name':
            return baseQuery
                .where('medicine_name', 'ilike', `%${query}%`)
                .count('medicine_id as count').first();
        case 'form':
            return baseQuery
                .where('form', 'ilike', `%${query}%`)
                .count('medicine_id as count').first();
        case 'category':
            return baseQuery
                .where('category', 'ilike', `%${query}%`)
                .count('medicine_id as count').first();
        default:
            return baseQuery
                .where(function() {
                    this.where('medicine_id', '=', query)
                        .orWhere('name', 'ilike', `%${query}%`)
                        .orWhere('form', 'ilike', `%${query}%`)
                        .orWhere('category', 'ilike', `%${query}%`);
                })
                .count('medicine_id as count').first();
    }
}