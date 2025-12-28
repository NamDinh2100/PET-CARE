import db from '../config/database.js';

// Get invoice by ID
export function getInvoiceByID(invoice_id) {
    return db('invoices as inv')
        .join('appointments as ap', 'inv.appointment_id', 'ap.appointment_id')
        .join('users as cus', 'ap.customer_id', 'cus.user_id')
        .leftJoin('users as vet', 'ap.veterinarian_id', 'vet.user_id')
        .select(
            'inv.*',
            'cus.full_name as customer_name',
            'cus.phone as customer_phone',
            'vet.full_name as veterinarian_name',
            'ap.date_start',
            //'ap.service_id'
        )
        .where('invoice_id', invoice_id)
        .first();
}

export function getInvoiceByAppointmentID(appointment_id) {
    return db('invoices as inv')
        .where('inv.appointment_id', appointment_id).first();
} 

export function payInvoice(invoice_id, payment_method) {
    return db('invoices')
        .where('invoice_id', invoice_id)
        .update({
            payment_status: 'paid',
            payment_date: db.fn.now(),
            payment_method: payment_method
        });
}

// Count all invoices
export function countAllInvoices() {
    return db('invoices').count('invoice_id as count').first();
}

// Get invoices with pagination
export function findPageInvoices(limit, offset) {
    return db('invoices as inv')
        .join('appointments as ap', 'inv.appointment_id', 'ap.appointment_id')
        .join('users as cus', 'ap.customer_id', 'cus.user_id')
        .leftJoin('users as vet', 'ap.veterinarian_id', 'vet.user_id')
        .select(
            'inv.*',
            'cus.full_name as customer_name',
            'vet.full_name as veterinarian_name',
            'ap.date_start'
        )
        .limit(limit)
        .offset(offset)
        .orderBy('inv.invoice_id', 'desc');
}

// Count invoices by status
export function countByStatus(status) {
    return db('invoices')
        .where('payment_status', status)
        .count('invoice_id as count')
        .first();
}

// Find invoices by status with pagination
export function findPageByStatus(status, limit, offset) {
    return db('invoices as inv')
        .join('appointments as ap', 'inv.appointment_id', 'ap.appointment_id')
        .join('users as cus', 'ap.customer_id', 'cus.user_id')
        .leftJoin('users as vet', 'ap.veterinarian_id', 'vet.user_id')
        .select(
            'inv.*',
            'cus.full_name as customer_name',
            'vet.full_name as veterinarian_name',
            'ap.date_start'
        )
        .where('inv.payment_status', status)
        .limit(limit)
        .offset(offset)
        .orderBy('inv.invoice_id', 'desc');
}

// Search invoices
export function countSearchInvoices(searchField, searchQuery) {
    const query = db('invoices as inv')
        .join('appointments as ap', 'inv.appointment_id', 'ap.appointment_id')
        .join('users as cus', 'ap.customer_id', 'cus.user_id');

    if (searchField === 'id') {
        query.where('inv.invoice_id', searchQuery);
    } else if (searchField === 'customer_name') {
        query.where('cus.full_name', 'like', `%${searchQuery}%`);
    } else if (searchField === 'appointment_id') {
        query.where('inv.appointment_id', searchQuery);
    } else {
        // Search text fields only (exclude invoice_id and appointment_id as they require numbers)
        query.where('cus.full_name', 'like', `%${searchQuery}%`);
    }

    return query.count('inv.invoice_id as count').first();
}

export function searchInvoices(searchField, searchQuery, limit, offset) {
    const query = db('invoices as inv')
        .join('appointments as ap', 'inv.appointment_id', 'ap.appointment_id')
        .join('users as cus', 'ap.customer_id', 'cus.user_id')
        .leftJoin('users as vet', 'ap.veterinarian_id', 'vet.user_id')
        .select(
            'inv.*',
            'cus.full_name as customer_name',
            'vet.full_name as veterinarian_name',
            'ap.date_start'
        );

    if (searchField === 'id') {
        query.where('inv.invoice_id', searchQuery);
    } else if (searchField === 'customer_name') {
        query.where('cus.full_name', 'like', `%${searchQuery}%`);
    } else if (searchField === 'appointment_id') {
        query.where('inv.appointment_id', searchQuery);
    } else {
        // Search text fields only (exclude invoice_id and appointment_id as they require numbers)
        query.where('cus.full_name', 'like', `%${searchQuery}%`);
    }

    return query.limit(limit).offset(offset).orderBy('inv.invoice_id', 'desc');
}

// Add new invoice
export function addInvoice(invoice) {
    return db('invoices').insert(invoice);
}

// Update invoice
export function updateInvoice(invoice_id, invoice) {
    return db('invoices')
        .where('invoice_id', invoice_id)
        .update(invoice);
}

// Update payment status
export function updatePaymentStatus(invoice_id, status) {
    return db('invoices')
        .where('invoice_id', invoice_id)
        .update({ 
            payment_status: status,
            payment_date: status === 'paid' ? db.fn.now() : null
        });
}

// Delete invoice
export function deleteInvoice(invoice_id) {
    return db('invoices')
        .where('invoice_id', invoice_id)
        .delete();
}

// Get all appointments without invoice (for creating new invoice)
export function getAppointmentsWithoutInvoice() {
    return db('appointments as ap')
        .leftJoin('invoices as inv', 'ap.appointment_id', 'inv.appointment_id')
        .join('users as cus', 'ap.customer_id', 'cus.user_id')
        .select(
            'ap.appointment_id',
            'ap.date_start',
            'cus.full_name as customer_name',
            'ap.status'
        )
        .whereNull('inv.invoice_id')
        .where('ap.status', 'completed')
        .orderBy('ap.date_start', 'desc');
}

// Calculate total revenue
export function getTotalRevenue() {
    return db('invoices')
        .where('payment_status', 'paid')
        .sum('total_amount as total')
        .first();
}

// Get revenue by date range
export function getRevenueByDateRange(startDate, endDate) {
    return db('invoices')
        .where('payment_status', 'paid')
        .whereBetween('payment_date', [startDate, endDate])
        .sum('total_amount as total')
        .first();
}
