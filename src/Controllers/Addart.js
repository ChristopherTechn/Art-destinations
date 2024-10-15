// controllers/addController.js
const connection = require('../Config/dbconfig');


const addArt = (req, res) => {
    const { title, artist, year, description, image_url } = req.body; 

    const query = 'INSERT INTO arts (title, artist, year, description, image_url) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [title, artist, year, description, image_url], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.status(201).json({ id: results.insertId, title, artist, year, description, image_url });
    });
};

module.exports = addArt;
