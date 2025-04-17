const FAQ = require('../Models/FAQ');

exports.getAllFAQs = async (req, res) => {
    try {
        const results = await FAQ.getAll();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

exports.getFAQsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const results = await FAQ.getByCategory(category);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};
