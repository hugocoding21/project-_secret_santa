const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Assure-toi que bcrypt est installé

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true,
        unique: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now
    },
    updatedAt: { 
        type: Date, 
        default: Date.now
    }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (error) {
            return next(error);
        }
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);

