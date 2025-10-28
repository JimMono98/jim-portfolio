"use client";import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { firstname, lastname, email, phone, service, message } = req.body;

        // Create a transporter object
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to another email service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Define email options
        const mailOptions = {
            from: email, // Sender's email address
            to: process.env.EMAIL_TO, // Recipient's email address
            subject: `New contact form submission from ${firstname} ${lastname}`,
            text: `
                Name: ${firstname} ${lastname}
                Email: ${email}
                Phone: ${phone}
                Service: ${service}
                Message: ${message}
            `,
        };

        // Send the email
        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Email sent successfully!' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Failed to send email' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
