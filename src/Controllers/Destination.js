const db = require("../Config/dbconfig");

const showDestinations = async (req, res) => {
  try {
    // SQL query to fetch destinations and their images using a LEFT JOIN
    const query = `
      SELECT 
        d.id,
        d.name,
        d.description,
        d.price,
        d.duration,
        d.activities,
        d.status,
        d.created_at,
        di.image_url,
        di.is_primary
      FROM destinations d
      LEFT JOIN destination_images di ON d.id = di.destination_id
      ORDER BY d.id, di.is_primary DESC
    `;
  
    // Use async/await to execute the query
    const [results] = await db.query(query); // Assuming db.query is now returning a Promise
  
    // Group results by destination to combine images into an array
    const destinationsMap = new Map();
    results.forEach(row => {
      const destinationId = row.id;
      if (!destinationsMap.has(destinationId)) {
        destinationsMap.set(destinationId, {
          id: row.id,
          name: row.name,
          description: row.description,
          price: parseFloat(row.price), // Ensure price is a number
          duration: row.duration,
          activities: row.activities.split(','), // Convert string to array
          status: row.status,
          created_at: row.created_at,
          images: [],
        });
      }
      if (row.image_url) {
        destinationsMap.get(destinationId).images.push({
          image_url: row.image_url,
          is_primary: row.is_primary === 1, // Convert MySQL BOOLEAN (0/1) to true/false
        });
      }
    });
  
    // Convert Map to array for JSON response
    const destinations = Array.from(destinationsMap.values());
  
    res.status(200).json(destinations);
  } catch (err) {
    console.error('Error fetching destinations:', err);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
};

// Export the controller
module.exports = { showDestinations };
