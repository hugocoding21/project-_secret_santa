
exports.validateMembership = (req, res, next) => {
    const { groupId } = req.params;
  
    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }
  
    // Pour la route POST (ajouter un membre), vérifier l'email
    if (req.method === "POST") {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
    }
  
    // Pour la route PUT (mettre à jour un membre), vérifier le statut
    if (req.method === "PUT") {
      const { isAccepted } = req.body;
      if (typeof isAccepted !== "boolean") {
        return res.status(400).json({ message: "isAccepted must be a boolean value" });
      }
    }
  
    next();
  };
  
  