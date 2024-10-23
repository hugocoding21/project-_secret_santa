const mongoose = require('mongoose');

const secretSantaAssignmentSchema = new mongoose.Schema({
    giverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

secretSantaAssignmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('SecretSantaAssignment', secretSantaAssignmentSchema);
