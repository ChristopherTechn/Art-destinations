// src/controllers/addArt.js
const pool = require('../Config/dbconfig');
const cloudinary = require('cloudinary').v2;
const fs = require('fs'); // Add this for file cleanup
const path = require('path'); // Add this for path handling
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const addArt = async (req, res) => {
    const { title, artist_name, price, description } = req.body;
    const images = req.files; // Expecting multiple files from multer
    const userId = req.user?.user_id; // From token

    if (!userId) return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
    if (!images || images.length === 0) return res.status(400).json({ error: 'At least one image is required' });

    try {
        // Insert artwork into artworks table
        const artworkQuery = `
            INSERT INTO artworks (title, artist_name, price, description, user_id, status)
            VALUES (?, ?, ?, ?, ?, 'available')
        `;
        const [artworkResult] = await pool.query(artworkQuery, [title, artist_name, price, description, userId]);
        const artworkId = artworkResult.insertId;

        // Upload images to Cloudinary and store URLs
        const imagePromises = images.map(async (image, index) => {
            const filePath = image.path; // Store path for cleanup
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'artworks',
                public_id: `${artworkId}_${index}_${Date.now()}`,
            });
            // Clean up local file after upload
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
            return {
                image_url: result.secure_url,
                is_primary: index === 0,
            };
        });

        const uploadedImages = await Promise.all(imagePromises);

        // Insert image URLs into artwork_images
        const imageQuery = `
            INSERT INTO artwork_images (artwork_id, image_url, is_primary)
            VALUES ?
        `;
        const imageValues = uploadedImages.map(img => [artworkId, img.image_url, img.is_primary]);
        await pool.query(imageQuery, [imageValues]);

        res.status(201).json({
            message: '✅ Artwork successfully added to the website!',
            artwork: { artwork_id: artworkId, title, artist_name, price, description, images: uploadedImages },
        });
    } catch (err) {
        console.error('Error adding artwork:', err);
        res.status(500).json({ error: `Failed to add artwork: ${err.message}` });
    }
};

// deleteImage function remains unchanged
const deleteImage = async (req, res) => {
    const { image_id } = req.params;
    const userId = req.user?.user_id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });

    try {
        const query = `
            UPDATE artwork_images ai
            INNER JOIN artworks a ON ai.artwork_id = a.artwork_id
            SET ai.deleted_at = NOW()
            WHERE ai.image_id = ?
            AND ai.deleted_at IS NULL
            AND a.user_id = ?
        `;
        const [result] = await pool.query(query, [image_id, userId]);

        if (result.affectedRows === 0) {
            return res.status(403).json({ 
                error: 'Forbidden: Image not found, already deleted, or you do not have permission to delete it' 
            });
        }

        res.status(200).json({ message: '✅ Image soft-deleted successfully' });
    } catch (err) {
        console.error('Error deleting image:', err);
        res.status(500).json({ error: 'Internal server error: Failed to delete image' });
    }
};

module.exports = { addArt, deleteImage };