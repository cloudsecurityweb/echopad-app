/**
 * Email Service
 * 
 * Handles sending emails via Azure Communication Services
 * Supports verification emails and invitation emails
 */

import { EmailClient } from "@azure/communication-email";

const CONNECTION_STRING = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
const SENDER_EMAIL = process.env.AZURE_COMMUNICATION_SENDER_EMAIL;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

let emailClient = null;

/**
 * Initialize email client
 */
function getEmailClient() {
  if (!CONNECTION_STRING) {
    console.warn("  AZURE_COMMUNICATION_CONNECTION_STRING not set. Email service will not work.");
    return null;
  }

  if (!emailClient) {
    emailClient = new EmailClient(CONNECTION_STRING);
  }

  return emailClient;
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured() {
  return !!CONNECTION_STRING;
}

/**
 * Send email verification email
 * 
 * @param {string} email - Recipient email address
 * @param {string} token - Verification token
 * @param {string} name - Recipient name
 * @returns {Promise<Object>} Email send result
 */
export async function sendVerificationEmail(email, token, name = "User") {
  const client = getEmailClient();
  if (!client) {
    throw new Error("Email service not configured");
  }

  if (!SENDER_EMAIL) {
    throw new Error("AZURE_COMMUNICATION_SENDER_EMAIL environment variable is required");
  }

  const verificationLink = `${FRONTEND_URL}/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

  const emailContent = {
    subject: "Verify your Echopad account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #06b6d4; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Welcome to Echopad, ${name}!</h2>
            <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${verificationLink}" class="button">Verify Email Address</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #06b6d4;">${verificationLink}</p>
            <p>This link will expire in 24 hours.</p>
            <div class="footer">
              <p>If you didn't create an account, please ignore this email.</p>
              <p>© ${new Date().getFullYear()} Echopad. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    plainText: `
Welcome to Echopad, ${name}!

Thank you for signing up. Please verify your email address to complete your registration.

Click this link to verify your email:
${verificationLink}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.

© ${new Date().getFullYear()} Echopad. All rights reserved.
    `.trim(),
  };

  const message = {
    senderAddress: SENDER_EMAIL,
    content: emailContent,
    recipients: {
      to: [{ address: email, displayName: name }],
    },
  };

  try {
    const poller = await client.beginSend(message);
    const result = await poller.pollUntilDone();
    return {
      success: true,
      messageId: result.id,
    };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}

/**
 * Send invitation email
 * 
 * @param {string} email - Recipient email address
 * @param {string} token - Invitation token
 * @param {string} inviterName - Name of person sending invitation
 * @param {string} organizationName - Organization name
 * @returns {Promise<Object>} Email send result
 */
export async function sendInvitationEmail(email, token, inviterName, organizationName) {
  const client = getEmailClient();
  if (!client) {
    throw new Error("Email service not configured");
  }

  if (!SENDER_EMAIL) {
    throw new Error("AZURE_COMMUNICATION_SENDER_EMAIL environment variable is required");
  }

  const invitationLink = `${FRONTEND_URL}/accept-invitation?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

  const emailContent = {
    subject: `You've been invited to join ${organizationName} on Echopad`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #06b6d4; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>You've been invited!</h2>
            <p><strong>${inviterName}</strong> has invited you to join <strong>${organizationName}</strong> on Echopad.</p>
            <p>Click the button below to accept the invitation and create your account:</p>
            <a href="${invitationLink}" class="button">Accept Invitation</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #06b6d4;">${invitationLink}</p>
            <p>This invitation will expire in 7 days.</p>
            <div class="footer">
              <p>If you didn't expect this invitation, please ignore this email.</p>
              <p>© ${new Date().getFullYear()} Echopad. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    plainText: `
You've been invited!

${inviterName} has invited you to join ${organizationName} on Echopad.

Click this link to accept the invitation:
${invitationLink}

This invitation will expire in 7 days.

If you didn't expect this invitation, please ignore this email.

© ${new Date().getFullYear()} Echopad. All rights reserved.
    `.trim(),
  };

  const message = {
    senderAddress: SENDER_EMAIL,
    content: emailContent,
    recipients: {
      to: [{ address: email }],
    },
  };

  try {
    const poller = await client.beginSend(message);
    const result = await poller.pollUntilDone();
    return {
      success: true,
      messageId: result.id,
    };
  } catch (error) {
    console.error("Failed to send invitation email:", error);
    throw new Error(`Failed to send invitation email: ${error.message}`);
  }
}
