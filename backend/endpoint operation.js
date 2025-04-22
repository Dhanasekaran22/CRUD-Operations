
const usersDB = require('./couchdb connection');

module.exports = {
  createUser: async (req, res) => {
    try {
      const response = await usersDB.insert(req.body);
      res.status(201).json({
        id: response.id,
        rev: response.rev
      });
    } catch (err) {
      if (err.statusCode === 409) {
        res.status(409).json({ error: "User already exists" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
};