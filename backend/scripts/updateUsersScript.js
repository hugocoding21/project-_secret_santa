//script to update User table
const mongoose = require('mongoose');
const User = require('../src/models/userModel'); // Modifie le chemin en fonction de ta structure de projet

async function updateUsers() {
  try {
    const result = await User.updateMany(
      { roles: { $exists: true } }, // Tous les utilisateurs sans ce champ
      { $set: { roles: [Number(1)] } } // Ajouter le champ avec une valeur par défaut
    );
    console.log(`${result.modifiedCount} users updated.`);
  } catch (error) {
    console.error('Error updating users:', error);
  }
}

module.exports = updateUsers;