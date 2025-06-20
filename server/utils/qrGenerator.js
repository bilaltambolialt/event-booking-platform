// utils/qrGenerator.js
const QRCode = require('qrcode');

// This function generates a QR Code data URL
const generateQRCode = async (email, eventId) => {
  const qrData = `Ticket for ${email} for event ${eventId}`;
  return await QRCode.toDataURL(qrData);
};

module.exports = { generateQRCode };
