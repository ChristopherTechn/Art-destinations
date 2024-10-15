const transporter = require('../Config/nodemailerConfig');

const sendConfirmationEmail = async (email, confirmationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirm your email',
    text: `Your confirmation code is: ${confirmationCode}. It will expire in 15 minutes.`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail };
