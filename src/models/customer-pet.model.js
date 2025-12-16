import db from '../config/database.js';

// Get all pets by owner ID
export function getPetsByOwner(owner_id) {
    return db('pets').where('owner_id', owner_id);
}

// Get single pet by ID
export function getPetById(pet_id) {
    return db('pets').where('pet_id', pet_id).first();
}

// Add new pet
export function addPet(pet) {
    return db('pets').insert(pet);
}

// Update pet
export function updatePet(pet_id, pet) {
    return db('pets').where('pet_id', pet_id).update(pet);
}

// Delete pet
export function deletePet(pet_id) {
    return db('pets').where('pet_id', pet_id).del();
}
