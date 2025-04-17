// controllers/bookingController.js
const db = require('../Config/dbconfig'); // Your MySQL connection
const transporter = require('../Config/nodemailerConfig'); // Your existing Nodemailer setup

// Send booking confirmation email
const sendBookingConfirmationEmail = async (email, bookingData, destination) => {
  // Ensure price is a number; convert if necessary
  const price = Number(destination.price); // Convert to number
  if (isNaN(price)) {
    throw new Error('Invalid price value in destination');
  }
  const totalPrice = (price * (bookingData.adults + bookingData.children)).toFixed(2);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Booking Confirmation - ${destination.name}`,
    html: `
      <h2>Booking Confirmation</h2>
      <p>Dear ${bookingData.full_name},</p>
      <p>Your booking for <strong>${destination.name}</strong> has been successfully confirmed!</p>
      <h3>Booking Details:</h3>
      <ul>
        <li><strong>Destination:</strong> ${destination.name}</li>
        <li><strong>Description:</strong> ${destination.description}</li>
        <li><strong>Price per Person:</strong> $${price.toFixed(2)}</li>
        <li><strong>Duration:</strong> ${destination.duration}</li>
        <li><strong>Activities:</strong> ${Array.isArray(destination.activities) ? destination.activities.join(', ') : destination.activities}</li>
        <li><strong>Travel Date:</strong> ${bookingData.travel_date}</li>
        <li><strong>Adults:</strong> ${bookingData.adults}</li>
        <li><strong>Children:</strong> ${bookingData.children}</li>
        ${bookingData.special_requests ? `<li><strong>Special Requests:</strong> ${bookingData.special_requests}</li>` : ''}
        <li><strong>Total Price:</strong> $${totalPrice}</li>
      </ul>
      <h3>Next Steps:</h3>
      <p>We’ll contact you soon with payment details and travel instructions. For any questions, reply to this email or call us at +1-800-TRAVEL.</p>
      <p>Thank you for choosing Kenya Travel!</p>
      <p>Best regards,<br/>The Kenya Travel Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Create a new booking
const createBooking = async (req, res) => {
  const {
    destinationId,
    fullName, // Optional for guests
    email, // Optional for guests
    phone, // Optional for guests
    travelDate,
    adults,
    children,
    specialRequests,
  } = req.body;

  const user = req.user; // Assuming middleware sets req.user for logged-in users

  try {
    console.log('Request body:', req.body); // Log incoming request
    console.log('User:', user); // Log user data

    // Validate required fields based on authentication status
    if (!destinationId || !travelDate || !adults) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let bookingData = {
      destination_id: destinationId,
      travel_date: travelDate,
      adults: adults || 1,
      children: children || 0,
      special_requests: specialRequests || null,
    };

    let recipientEmail;

    if (user) {
      // Logged-in user: Fetch details from users table
      const [userData] = await db.query('SELECT username, email, phone_number FROM users WHERE user_id = ?', [user.user_id]);
      console.log('User data from DB:', userData);
      if (!userData.length) {
        return res.status(404).json({ message: 'User not found' });
      }
      bookingData.user_id = user.user_id;
      bookingData.full_name = userData[0].username;
      bookingData.email = userData[0].email;
      bookingData.phone = userData[0].phone_number || 'Not provided';
      recipientEmail = userData[0].email;

      if (!bookingData.phone) {
        return res.status(400).json({ message: 'Phone number is required in your user profile' });
      }
    } else {
      // Guest user: Require personal details
      if (!fullName || !email || !phone) {
        return res.status(400).json({ message: 'Full name, email, and phone are required for guest bookings' });
      }
      bookingData.full_name = fullName;
      bookingData.email = email;
      bookingData.phone = phone;
      recipientEmail = email;
    }

    // Check if destination exists and is available
    const [destinationRows] = await db.query(
      'SELECT id, name, description, price, duration, activities FROM destinations WHERE id = ? AND status = "Available"',
      [destinationId]
    );
    console.log('Destination rows:', destinationRows);
    if (!destinationRows.length) {
      return res.status(400).json({ message: 'Destination not available or not found' });
    }
    const destination = destinationRows[0]; // Extract the first row

    // Insert booking into the database
    const [result] = await db.query(
      `INSERT INTO booking (
        destination_id, user_id, full_name, email, phone, travel_date, adults, children, special_requests
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingData.destination_id,
        bookingData.user_id || null,
        bookingData.full_name,
        bookingData.email,
        bookingData.phone,
        bookingData.travel_date,
        bookingData.adults,
        bookingData.children,
        bookingData.special_requests,
      ]
    );
    console.log('Insert result:', result);

    // Send confirmation email
    await sendBookingConfirmationEmail(recipientEmail, bookingData, destination);

    const response = {
      message: 'Booking successful! A confirmation email has been sent.',
      bookingId: result.insertId,
    };
    console.log('Response:', response);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Booking failed. Please try again.' });
  }
};

module.exports = { createBooking };