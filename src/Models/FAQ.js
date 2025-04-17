const db = require("../Config/dbconfig");

const FAQ = {
    // Get all FAQs
    getAll: async () => {
        try {
            const [rows] = await db.query("SELECT * FROM faq");
            return rows;
        } catch (error) {
            console.error("Error fetching FAQs:", error);
            throw error;
        }
    },

    // Get FAQs by category
    getByCategory: async (category) => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM faq WHERE LOWER(category) = LOWER(?)", 
                [category]
            );
            return rows;
        } catch (error) {
            console.error("Error fetching FAQs by category:", error);
            throw error;
        }
    },

    // Search FAQs by keyword (improved for better matching)
    searchByKeyword: async (keyword) => {
        try {
            const query = `
                SELECT answer FROM faq 
                WHERE LOWER(question) LIKE LOWER(?) 
                ORDER BY LENGTH(question) ASC 
                LIMIT 1`; // Get the best match
            
            const [rows] = await db.query(query, [`%${keyword}%`]);
            return rows;
        } catch (error) {
            console.error("Error searching FAQs:", error);
            throw error;
        }
    }
};

module.exports = FAQ;
