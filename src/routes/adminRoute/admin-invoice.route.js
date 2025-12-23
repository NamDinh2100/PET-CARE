import express from 'express';
import * as invoiceService from '../../models/invoice.model.js';
import * as appointmentService from '../../models/appointment.model.js';

const router = express.Router();

// List invoices
router.get('/', async function (req, res) {
    const status = req.query.status;
    const searchQuery = req.query.q;
    const searchField = req.query.field || 'all';
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const offset = (page - 1) * limit;

    let total;
    let list;
    let isSearchMode = false;

    if (searchQuery && searchQuery.trim()) {
        // Search mode
        isSearchMode = true;
        
        // Validate ID search - must be a number
        if ((searchField === 'id' || searchField === 'appointment_id') && isNaN(searchQuery)) {
            total = { count: 0 };
            list = [];
        } else {
            total = await invoiceService.countSearchInvoices(searchField, searchQuery);
            list = await invoiceService.searchInvoices(searchField, searchQuery, limit, offset);
        }
    } else if (status) {
        // Filter by status
        total = await invoiceService.countByStatus(status);
        list = await invoiceService.findPageByStatus(status, limit, offset);
    } else {
        // Show all invoices
        total = await invoiceService.countAllInvoices();
        list = await invoiceService.findPageInvoices(limit, offset);
    }

    const nPages = Math.ceil(+total.count / limit);
    const pageNumbers = [];

    for (let i = 1; i <= nPages; i++) {
        let href = `?page=${i}`;
        if (isSearchMode) {
            href = `?q=${encodeURIComponent(searchQuery)}&field=${searchField}&page=${i}`;
        } else if (status) {
            href = `?status=${status}&page=${i}`;
        }

        pageNumbers.push({
            value: i,
            active: i === page,
            href: href
        });
    }

    res.render('vwAdmin/vwInvoice/list', {
        layout: 'admin-layout',
        invoices: list,
        empty: list.length === 0,
        pageNumbers: pageNumbers,
        currentPage: page,
        showPagination: nPages > 1,
        currentStatus: status,
        searchQuery: searchQuery,
        searchField: searchField,
        isSearchMode: isSearchMode
    });
});

// View invoice detail
router.get('/:id', async function (req, res) {
    const invoice_id = req.params.id;
    const invoice = await invoiceService.getInvoiceByID(invoice_id);

    if (!invoice) {
        return res.redirect('/admin/invoices');
    }

    res.render('vwAdmin/vwInvoice/view', {
        layout: 'admin-layout',
        invoice: invoice
    });
});

// Show edit invoice form
router.get('/edit/:id', async function (req, res) {
    const invoice_id = req.params.id;
    const invoice = await invoiceService.getInvoiceByID(invoice_id);

    if (!invoice) {
        return res.redirect('/admin/invoices');
    }

    res.render('vwAdmin/vwInvoice/edit', {
        layout: 'admin-layout',
        invoice: invoice
    });
});

// Update invoice (only payment_method, discount, and payment_status)
router.post('/edit/:id', async function (req, res) {
    const invoice_id = req.params.id;
    const invoice = {
        payment_method: req.body.payment_method || null,
        discount: req.body.discount || 0,
        payment_status: req.body.payment_status
    };

    if (invoice.payment_status === 'paid') {
        invoice.payment_date = new Date();
    }

    await invoiceService.updateInvoice(invoice_id, invoice);
    res.redirect('/admin/invoices');
});

// Update payment status
router.post('/update-status/:id', async function (req, res) {
    const invoice_id = req.params.id;
    const status = req.body.status;

    await invoiceService.updatePaymentStatus(invoice_id, status);
    res.redirect('/admin/invoices');
});

// Delete invoice
router.post('/delete/:id', async function (req, res) {
    const invoice_id = req.params.id;
    await invoiceService.deleteInvoice(invoice_id);
    res.redirect('/admin/invoices');
});

export default router;
