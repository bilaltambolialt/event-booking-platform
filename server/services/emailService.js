const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendBookingConfirmation = async (email, event, qrCodeDataURL) => {
  const base64Image = qrCodeDataURL.split(';base64,').pop(); // extract base64 part

  const mailOptions = {
    from: 'events@powersmy.biz',
    to: email,
    subject: `Booking Confirmation: ${event.name}`,
    html: `
      <h1>Your booking is confirmed!</h1>
      <p>Event: ${event.name}</p>
      <p>Date: ${new Date(event.date).toLocaleString()}</p>
      <img src="cid:qrcode" alt="Ticket QR Code"/>
    `,
    attachments: [
      {
        filename: 'ticket.png',
        content: Buffer.from(base64Image, 'base64'),
        cid: 'qrcode' // same as in <img src="cid:qrcode"/>
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendBookingConfirmation };
