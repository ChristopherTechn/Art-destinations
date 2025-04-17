const db = require("../Config/dbconfig");
const jwt = require('jsonwebtoken');

exports.getArticles = async (req, res) => {
    const sql = `
        SELECT  articles.title, articles.content,
               users.username AS author 
        FROM articles 
        JOIN users ON articles.user_id = users.user_id
        ORDER BY articles.created_at DESC
    `;

    try {
        const [results] = await db.query(sql); // Use `await` instead of callback
        res.json(results);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database error" });
    }
};


exports.addArticle = async (req, res) => {
    const { title, content } = req.body;
    const token = req.headers.authorization; // Get token from headers

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        // Extract token from "Bearer <token>" format
        const tokenParts = token.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(401).json({ error: "Invalid token format" });
        }
        const actualToken = tokenParts[1];

        // Verify JWT
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        // Debugging - Log the decoded payload
        console.log("Decoded Token Payload:", decoded);

        // Ensure the token contains user_id
        if (!decoded.user_id) {
            return res.status(401).json({ error: "Invalid token: user ID missing" });
        }

        const user_id = decoded.user_id; // Extract user_id

        if (!title || !content) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Insert into database
        const sql = "INSERT INTO articles (title, content, user_id) VALUES (?, ?, ?)";
        const [result] = await db.query(sql, [title, content, user_id]);

        res.json({ message: "Article added successfully", articleId: result.insertId });
    } catch (err) {
        console.error("Error:", err);

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }

        res.status(500).json({ error: "Database error" });
    }
};
