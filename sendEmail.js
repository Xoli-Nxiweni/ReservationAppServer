import { createTransport } from 'nodemailer';

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'asiphilexoli@gmail.com',
    pass: 'caga xtli ceyr rwye',
  },
});

const sendBookingEmail = async (bookingId, userEmail) => {
  const mailOptions = {
    from: 'Zesty Reserve <asiphilexoli@gmail.com>',
    to: userEmail,
    subject: 'Your Booking ID',
    html: `
      <h3 style="color: #4A90E2;">🌟 Booking Confirmation 🌟</h3>
      <p>Your booking ID is: ${bookingId}</p>
      <p>Thank you for choosing Zesty Reserve!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmailForBooking = async (req, res) => {
  try {
    const { email } = req.body;
    await sendBookingEmail(req.params.id, email);
    res.status(200).json({ message: 'Booking ID sent to user' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { sendBookingEmail };