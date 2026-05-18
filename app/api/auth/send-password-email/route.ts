// app/api/auth/send-password-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { email, customerName, temporaryPassword } = await request.json();

    // Here you would integrate with your email service
    // For now, we'll just log and return success
    console.log(`Email would be sent to: ${email}`);
    console.log(`Customer: ${customerName}`);
    console.log(`Temporary Password: ${temporaryPassword}`);

    // Example with a mail service (uncomment and configure as needed):
    /*
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Admin Team" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Password Reset - Self Care Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset</h2>
          <p>Dear ${customerName},</p>
          <p>Your password has been reset successfully. Please use the following credentials to login:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Temporary Password:</strong> <code style="background-color: #e5e7eb; padding: 4px 8px; border-radius: 4px;">${temporaryPassword}</code></p>
          </div>
          <p style="color: #dc2626;"><strong>⚠️ For security reasons, please change your password after your first login.</strong></p>
          <p>Best regards,<br/>Admin Team</p>
          <hr style="margin: 20px 0; border-color: #e5e7eb;" />
          <p style="font-size: 12px; color: #6b7280;">This is an automated message, please do not reply.</p>
        </div>
      `,
    });
    */

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully'
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send email'
    }, { status: 500 });
  }
}