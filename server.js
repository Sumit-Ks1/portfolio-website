const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Email service is running' });
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: name, email, or message'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Send email using Resend
        const data = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'onboarding@resend.dev', // Use your verified domain email
            to: ['sumit127624@gmail.com'],
            subject: `Portfolio Contact from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h3 style="color: #555;">Message:</h3>
                        <p style="line-height: 1.6; color: #666; white-space: pre-wrap;">${message}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #999; font-size: 12px;">
                        <p>This email was sent from your portfolio contact form.</p>
                        <p>Reply to: ${email}</p>
                    </div>
                </div>
            `,
            reply_to: email // Allow direct reply to the sender
        });

        console.log('Email sent successfully:', data);

        res.json({
            success: true,
            message: 'Email sent successfully!',
            id: data.id
        });

    } catch (error) {
        console.error('Error sending email:', error);
        
        res.status(500).json({
            success: false,
            error: 'Failed to send email. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Email service running on http://localhost:${PORT}`);
    console.log(`📧 Ready to send emails to: sumit127624@gmail.com\n`);
});
