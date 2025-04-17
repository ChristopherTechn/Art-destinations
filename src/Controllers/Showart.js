// src/controllers/showcaseController.js
const pool = require('../Config/dbconfig');

// Fetch all available arts with their images
const showcaseArts = async (req, res) => {
    try {
        // Query to fetch artworks with status 'available' and their images
        const query = `
        SELECT 
                a.artwork_id, a.title, a.description, a.artist_name, a.price, 
                a.created_at, a.user_id, a.status,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'image_id', i.image_id,
                            'image_url', i.image_url,
                            'is_primary', i.is_primary
                        )
                    ),
                    JSON_ARRAY()
                ) AS images
            FROM artworks a
            LEFT JOIN artwork_images i ON a.artwork_id = i.artwork_id AND i.deleted_at IS NULL
            WHERE a.status = 'available'
            GROUP BY a.artwork_id;
    `;
        const [results] = await pool.query(query);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching artworks:', err.message);
        res.status(500).json({ error: 'Failed to fetch artworks' });
    }
};


const getArtworkById = async (req, res) => {
    const { id } = req.params;
    try {
      const [artRows] = await pool.query(
        'SELECT * FROM artworks WHERE artwork_id = ? AND status = "available"',
        [id]
      );
      if (artRows.length === 0) {
        return res.status(404).json({ error: 'Artwork not found' });
      }
  
      const [imageRows] = await pool.query(
        'SELECT image_id, image_url, is_primary FROM artwork_images WHERE artwork_id = ? AND deleted_at IS NULL',
        [id]
      );
  
      const artwork = {
        ...artRows[0],
        images: imageRows,
      };
  
      res.json(artwork);
    } catch (error) {
      console.error('Error fetching artwork:', error);
      res.status(500).json({ error: 'Failed to fetch artwork' });
    }
  };

// Export the showcaseArts function
module.exports = { showcaseArts,  getArtworkById};