import express from 'express';
import * as petService from '../../models/pet.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    const pets = await petService.getPetByOwnerID(req.session.authUser.user_id);
    const success = req.query.success;

    res.render('vwCustomer/pet-list', {
        pets: pets,
        activeTab: 'pets',
        success: success,
        isAddMode: false
    });
});

router.get('/add', async function (req, res) {
    const pets = await petService.getPetByOwnerID(req.session.authUser.user_id);
    res.render('vwCustomer/pet-list', {
        pets: pets,
        activeTab: 'pets',
        isAddMode: true
    });
});

// POST /customer/pets/add - Add new pet
router.post('/add', async function (req, res) {
    const pet = {
        owner_id: req.session.authUser.user_id,
        name: req.body.name,
        species: req.body.species,
        sex: req.body.sex || null,
        day_born: req.body.day_born || null,
        weight: req.body.weight || null,
        notes: req.body.notes || null
    };

    await petService.addPet(pet);

    // Update session pets
    const pets = await petService.getPetByOwnerID(req.session.authUser.user_id);
    req.session.pets = pets;

    res.redirect('/pets?success=added');
});

// GET /customer/pets/edit - Show edit pet modal
router.get('/edit', async function (req, res) {
    const petId = req.query.id;
    const pet = await petService.getPetByID(petId);

    // Check if pet belongs to this customer
    if (!pet || pet.owner_id !== req.session.authUser.user_id) {
        return res.status(404).render('404');
    }

    const pets = await petService.getPetByOwnerID(req.session.authUser.user_id);
    res.render('vwCustomer/pet-list', {
        pets: pets,
        editPet: pet,
        activeTab: 'pets',
        isEditMode: true
    });
});

// POST /customer/pets/edit - Update pet
router.post('/edit', async function (req, res) {
    const petId = req.query.id;
    const pet = await petService.getPetByID(petId);

    // Check if pet belongs to this customer
    if (!pet || pet.owner_id !== req.session.authUser.user_id) {
        return res.status(404).render('404');
    }

    const updatedPet = {
        name: req.body.name,
        species: req.body.species,
        sex: req.body.sex || null,
        day_born: req.body.day_born || null,
        weight: req.body.weight || null,
        notes: req.body.notes || null
    };

    await petService.updatePetInfo(petId, updatedPet);

    // Update session pets
    const pets = await petService.getPetByOwnerID(req.session.authUser.user_id);
    req.session.pets = pets;

    res.redirect('/pets?success=updated');
});

export default router;