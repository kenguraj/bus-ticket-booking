import nodemailer from "nodemailer";

export const sendTicketEmail = async ({
  to,
  passengerName,
  journeyDate,
  seatNumber,
  pickupLocation,
  pickupTime,
  dropLocation,
  dropTime,
  busName,
  busNumber,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const html = `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <h2 style="color:#007bff;">🎫 Your Ticket Confirmation</h2>
        <p>Hello <strong>${passengerName}</strong>,</p>
        <p>Thank you for booking your trip with <strong>${busName}</strong>!</p>

        <h3>🚌 Journey Details</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
          <tr><td><strong>Date</strong></td><td>${journeyDate}</td></tr>
          <tr><td><strong>Seat</strong></td><td>${seatNumber}</td></tr>
          <tr><td><strong>Bus Name</strong></td><td>${busName}</td></tr>
          <tr><td><strong>Bus Number</strong></td><td>${busNumber}</td></tr>
          <tr><td><strong>Pickup Location</strong></td><td>${pickupLocation}</td></tr>
          <tr><td><strong>Pickup Time</strong></td><td>${pickupTime}</td></tr>
          <tr><td><strong>Drop Location</strong></td><td>${dropLocation}</td></tr>
          <tr><td><strong>Drop Time</strong></td><td>${dropTime}</td></tr>
        </table>

        <p style="margin-top:15px;">We wish you a pleasant journey! 🚍</p>
        <hr/>
        <small>This is an automated message—please do not reply.</small>
      </div>
    `;

    await transporter.sendMail({
      from: `"Bus Booking Service" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your Bus Ticket Confirmation",
      html,
    });

    console.log(` Ticket email sent to ${to}`);
  } catch (err) {
    console.error(" Error sending ticket email:", err.message);
  }
};
