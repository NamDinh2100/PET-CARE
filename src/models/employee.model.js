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

export function countByRole(role) {
    return db('users')
        .where('role', role)
        .count('user_id as count').first();
}

export function findPageByRole(role, limit, offset) {
    return db('users')
        .where('role', role)
        .limit(limit)
        .offset(offset)
        .orderBy('user_id', 'asc');
}

export function searchEmployees(field, query, limit, offset) {
    const baseQuery = db('users').whereNot('role', 'customer');

    switch (field) {
        case 'id':
            return baseQuery
                .where('user_id', '=', query)
                .limit(limit)
                .offset(offset)
                .orderBy('user_id', 'asc');
        case 'name':
            return baseQuery
                .where('full_name', 'ilike', `%${query}%`)
                .limit(limit)
                .offset(offset)
                .orderBy('user_id', 'asc');
        case 'email':
            return baseQuery
                .where('email', 'ilike', `%${query}%`)
                .limit(limit)
                .offset(offset)
                .orderBy('user_id', 'asc');
        case 'phone':
            return baseQuery
                .where('phone', 'ilike', `%${query}%`)
                .limit(limit)
                .offset(offset)
                .orderBy('user_id', 'asc');
        case 'role':
            return baseQuery
                .where('role', 'ilike', `%${query}%`)
                .limit(limit)
                .offset(offset)
                .orderBy('user_id', 'asc');
        default:
            return baseQuery
                .where(function() {
                    this.where('user_id', '=', query)
                        .orWhere('full_name', 'ilike', `%${query}%`)
                        .orWhere('email', 'ilike', `%${query}%`)
                        .orWhere('phone', 'ilike', `%${query}%`)
                        .orWhere('role', 'ilike', `%${query}%`);
                })
                .limit(limit)
                .offset(offset)
                .orderBy('user_id', 'asc');
    }
}

export function countSearchEmployees(field, query) {
    const baseQuery = db('users').whereNot('role', 'customer');

    switch (field) {
        case 'id':
            return baseQuery
                .where('user_id', '=', query)
                .count('user_id as count').first();
        case 'name':
            return baseQuery
                .where('full_name', 'ilike', `%${query}%`)
                .count('user_id as count').first();
        case 'email':
            return baseQuery
                .where('email', 'ilike', `%${query}%`)
                .count('user_id as count').first();
        case 'phone':
            return baseQuery
                .where('phone', 'ilike', `%${query}%`)
                .count('user_id as count').first();
        case 'role':
            return baseQuery
                .where('role', 'ilike', `%${query}%`)
                .count('user_id as count').first();
        default:
            return baseQuery
                .where(function() {
                    this.where('user_id', '=', query)
                        .orWhere('full_name', 'ilike', `%${query}%`)
                        .orWhere('email', 'ilike', `%${query}%`)
                        .orWhere('phone', 'ilike', `%${query}%`)
                        .orWhere('role', 'ilike', `%${query}%`);
                })
                .count('user_id as count').first();
    }
}