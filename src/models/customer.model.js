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

export function searchCustomers(field, query, limit, offset) {
    const baseQuery = db('users').where('role', 'customer');

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
        default:
            // Search text fields only (exclude user_id as it's integer)
            return baseQuery
                .where(function() {
                    this.where('full_name', 'ilike', `%${query}%`)
                        .orWhere('email', 'ilike', `%${query}%`)
                        .orWhere('phone', 'ilike', `%${query}%`);
                })
                .limit(limit)
                .offset(offset)
                .orderBy('user_id', 'asc');
    }
}

export function countSearchCustomers(field, query) {
    const baseQuery = db('users').where('role', 'customer');

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
        default:
            // Search text fields only (exclude user_id as it's integer)
            return baseQuery
                .where(function() {
                    this.where('full_name', 'ilike', `%${query}%`)
                        .orWhere('email', 'ilike', `%${query}%`)
                        .orWhere('phone', 'ilike', `%${query}%`);
                })
                .count('user_id as count').first();
    }
}



