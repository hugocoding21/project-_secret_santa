const SecretSantaAssignment = require("../models/secretSantaAssignmentModel");
const Membership = require("../models/membershipModel");
const User = require("../models/userModel");
const Group = require("../models/GroupModel");
const { sendSantaAttributionEmail } = require("../../utils/mailer");

function assignSecretSantas(members) {
    const assignments = [];
    const shuffledMembers = [...members].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < shuffledMembers.length; i++) {
        const giver = shuffledMembers[i];
        const receiver = shuffledMembers[(i + 1) % shuffledMembers.length];
        assignments.push({ giverId: giver._id, receiverId: receiver._id });
    }
    
    return assignments;
}

exports.assignSecretSantas = async (req, res) => {
    try {
        const { groupId } = req.params;
        
        const memberships = await Membership.find({ groupId, isAccepted: true }).populate('userId');
        const members = memberships.map(m => m.userId);        
        
        if (members.length < 2) {
            return res.status(400).json({ message: 'Pas assez de membres pour effectuer l\'assignation' });
        }

        const assignments = assignSecretSantas(members);

    await SecretSantaAssignment.deleteMany({ groupId });
    await SecretSantaAssignment.insertMany(
      assignments.map((a) => ({
        ...a,
        groupId,
      }))
    );
    await Promise.all(
      members.map(async (v) => {
        const recipientEmail = v?.email;
        await sendSantaAttributionEmail(recipientEmail);
      })
    );
    res.status(200).json({ message: "Assignations de Secret Santa effectuées avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur d'assignation Secret Santa", error });
  }
};

exports.getAllAssignments = async (req, res) => {
    try {
        const { groupId } = req.params;

        const assignments = await SecretSantaAssignment.find({ groupId }).populate('giverId receiverId');
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des assignations', error });
    }
};


exports.clearAssignSecretSantas = async (req, res) => {
    try {
      const { groupId } = req.params;
      const result = await SecretSantaAssignment.deleteMany({ groupId });
      if (result.deletedCount > 0) {
        res.status(200).json({ message: `Assignments cleared for group ${groupId}` });
      } else {
        res.status(404).json({ message: `No assignments found for group ${groupId}` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error clearing Secret Santa assignments', error });
    }
  };
  
  exports.getAssignmentsByUserId = async (req, res) => {
    try {
      const { groupId, userId } = req.params;
      const assignment = await SecretSantaAssignment.findOne({
        groupId,
        giverId: userId,
      }).populate('receiverId','username email');
  
      if (!assignment) {
        return res.status(404).json({ message: 'No assignment found for this user in this group.' });
      }
  
      res.status(200).json(assignment.receiverId);
    } catch (error) {
      console.error('Error fetching Secret Santa assignment:', error);
      res.status(500).json({ message: 'Error fetching Secret Santa assignment', error });
    }
};