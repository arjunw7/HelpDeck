import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD, // Use App Password generated from Google Account
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function sendInvitationEmail(email: string, inviteUrl: string, organizationName: string) {
  const mailOptions = {
    from: `"${organizationName}" <noreply@helpdeck.app>`,
    to: email,
    subject: `You've been invited to join ${organizationName} on HelpDeck`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">You've Been Invited!</h2>
        <p>You've been invited to join ${organizationName}'s knowledge base on HelpDeck.</p>
        <p>Click the button below to accept the invitation and set up your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" 
             style="background-color: #0091FF; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Accept Invitation
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If you're unable to click the button, copy and paste this URL into your browser:<br>
          <a href="${inviteUrl}" style="color: #0091FF;">${inviteUrl}</a>
        </p>
        <p style="color: #666; font-size: 14px;">
          This invitation will expire in 7 days.
        </p>
      </div>
    `,
  };

  try {
    await transporter.verify();
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}