/**
 * Email Service
 * 
 * Handles sending emails via Azure Communication Services
 * Supports verification emails and invitation emails
 */

import { EmailClient } from "@azure/communication-email";
import { AzureKeyCredential } from "@azure/core-auth";

// Support both connection string and separate endpoint/access key
const CONNECTION_STRING = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
const EMAIL_ENDPOINT_ENV = process.env.AZURE_COMMUNICATION_ENDPOINT; // Optional: separate endpoint env var
const EMAIL_ACCESS_KEY_ENV = process.env.AZURE_COMMUNICATION_ACCESS_KEY; // Optional: separate access key env var
const SENDER_EMAIL = process.env.AZURE_COMMUNICATION_SENDER_EMAIL || "DoNotReply@cloudsecurityweb.com";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Extract endpoint and access key from env vars or connection string
let EMAIL_ENDPOINT = EMAIL_ENDPOINT_ENV || null;
let EMAIL_ACCESS_KEY = EMAIL_ACCESS_KEY_ENV || null;

// If endpoint/access key not in separate env vars, parse from connection string
if (!EMAIL_ENDPOINT || !EMAIL_ACCESS_KEY) {
  if (CONNECTION_STRING) {
    try {
      // Parse connection string format: endpoint=https://...;accesskey=...
      const parts = CONNECTION_STRING.split(';');
      for (const part of parts) {
      if (part.startsWith('endpoint=')) {
        EMAIL_ENDPOINT = EMAIL_ENDPOINT || part.substring('endpoint='.length).trim();
        // Remove trailing slash if present (SDK expects endpoint without trailing slash)
        if (EMAIL_ENDPOINT && EMAIL_ENDPOINT.endsWith('/')) {
          EMAIL_ENDPOINT = EMAIL_ENDPOINT.slice(0, -1);
        }
      } else if (part.startsWith('accesskey=')) {
          EMAIL_ACCESS_KEY = EMAIL_ACCESS_KEY || part.substring('accesskey='.length).trim();
        }
      }
    } catch (error) {
      console.warn('⚠️  [EMAIL-SERVICE] Failed to parse connection string:', error.message);
    }
  }
}

// Normalize endpoint format (remove trailing slash if present)
if (EMAIL_ENDPOINT && EMAIL_ENDPOINT.endsWith('/')) {
  EMAIL_ENDPOINT = EMAIL_ENDPOINT.slice(0, -1);
}

// Log configuration
if (EMAIL_ENDPOINT) {
  console.log(`📧 [EMAIL-SERVICE] Using endpoint: ${EMAIL_ENDPOINT.substring(0, 50)}...`);
} else {
  console.warn('⚠️  [EMAIL-SERVICE] Email endpoint not found in env vars or connection string');
}

// Log sender email on module load for debugging
console.log(`📧 [EMAIL-SERVICE] Initialized with sender email: ${SENDER_EMAIL}`);
console.log(`📧 [EMAIL-SERVICE] Sender email from env: ${process.env.AZURE_COMMUNICATION_SENDER_EMAIL || 'NOT SET - using default'}`);

/**
 * Get email client instance
 * Creates a new client using endpoint and credential explicitly
 */
function getEmailClient() {
  if (!CONNECTION_STRING && (!EMAIL_ENDPOINT || !EMAIL_ACCESS_KEY)) {
    console.warn("⚠️  AZURE_COMMUNICATION_CONNECTION_STRING or endpoint/access key not set. Email service will not work.");
    return null;
  }

  // Prefer using endpoint and credential explicitly (from env or parsed from connection string)
  if (EMAIL_ENDPOINT && EMAIL_ACCESS_KEY) {
    console.log(`📧 [EMAIL-SERVICE] Creating EmailClient with explicit endpoint: ${EMAIL_ENDPOINT.substring(0, 50)}...`);
    const credential = new AzureKeyCredential(EMAIL_ACCESS_KEY);
    return new EmailClient(EMAIL_ENDPOINT, credential);
  } else if (CONNECTION_STRING) {
    console.log(`📧 [EMAIL-SERVICE] Creating EmailClient with connection string (fallback)`);
    return new EmailClient(CONNECTION_STRING);
  } else {
    console.warn("⚠️  [EMAIL-SERVICE] No valid email configuration found");
    return null;
  }
}

/**
 * Check if email service is configured
 * @returns {boolean} True if email service is properly configured
 */
export function isEmailConfigured() {
  const hasConnectionString = !!CONNECTION_STRING;
  const hasSenderEmail = !!SENDER_EMAIL;
  
  if (!hasConnectionString) {
    console.warn('⚠️  Email service not configured: AZURE_COMMUNICATION_CONNECTION_STRING is missing');
    return false;
  }
  
  if (!hasSenderEmail) {
    console.warn('⚠️  Email service partially configured: AZURE_COMMUNICATION_SENDER_EMAIL is missing, using default');
  }
  
  return hasConnectionString;
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
  // Validate email service configuration
  if (!isEmailConfigured()) {
    throw new Error("Email service not configured. AZURE_COMMUNICATION_CONNECTION_STRING environment variable is required.");
  }

  // Validate required parameters
  if (!email || !email.trim()) {
    throw new Error("Email address is required");
  }
  
  if (!token || !token.trim()) {
    throw new Error("Verification token is required");
  }

  // Create client using endpoint and credential explicitly
  // Log endpoint status (without exposing the key)
  const endpointPrefix = EMAIL_ENDPOINT ? EMAIL_ENDPOINT.substring(0, 50) + '...' : 'NOT SET';
  console.log(`📧 [EMAIL] Using endpoint: ${endpointPrefix}`);
  console.log(`📧 [EMAIL] Creating EmailClient with explicit endpoint and credential...`);
  
  let client;
  if (EMAIL_ENDPOINT && EMAIL_ACCESS_KEY) {
    const credential = new AzureKeyCredential(EMAIL_ACCESS_KEY);
    client = new EmailClient(EMAIL_ENDPOINT, credential);
  } else {
    console.warn('⚠️  [EMAIL] Endpoint/credential not parsed, falling back to connection string');
    client = new EmailClient(CONNECTION_STRING);
  }

  const verificationLink = `${FRONTEND_URL}/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
  
  console.log(`📧 [EMAIL] Preparing verification email for: ${email}`);
  console.log(`   Verification link: ${verificationLink.substring(0, 80)}...`);
  console.log(`📧 [EMAIL] Using sender address: ${SENDER_EMAIL}`);
  console.log(`📧 [EMAIL] Sender email from env: ${process.env.AZURE_COMMUNICATION_SENDER_EMAIL || 'NOT SET'}`);

  // Match the exact working test code structure
  const emailMessage = {
    senderAddress: SENDER_EMAIL,
    content: {
      subject: "Verify your Echopad account",
      plainText: `
Welcome to Echopad, ${name}!

Thank you for signing up. Please verify your email address to complete your registration.

Click this link to verify your email:
${verificationLink}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.

© ${new Date().getFullYear()} Echopad. All rights reserved.
      `.trim(),
      html: `
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
    },
    recipients: {
      to: [{ address: email }],
    },
  };

  try {
    // Log the exact message structure being sent (for debugging)
    console.log(`📧 [EMAIL] Message structure:`, {
      senderAddress: emailMessage.senderAddress,
      hasContent: !!emailMessage.content,
      hasSubject: !!emailMessage.content.subject,
      hasPlainText: !!emailMessage.content.plainText,
      hasHtml: !!emailMessage.content.html,
      recipientCount: emailMessage.recipients.to.length,
      recipientEmail: emailMessage.recipients.to[0].address,
    });
    console.log(`📧 [EMAIL] Sending verification email via Azure Communication Services...`);
    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
    
    console.log(`✅ [EMAIL] Verification email sent successfully. Message ID: ${result.id}`);
    return {
      success: true,
      messageId: result.id,
    };
  } catch (error) {
    console.error("❌ [EMAIL] Failed to send verification email:", {
      email: email,
      error: error.message,
      errorCode: error.code,
      errorDetails: error.details || error,
    });
    
    // Provide more descriptive error messages
    let errorMessage = `Failed to send verification email: ${error.message}`;
    
    if (error.message?.includes('connection') || error.message?.includes('network')) {
      errorMessage = "Failed to send verification email: Network or connection error. Please try again later.";
    } else if (error.message?.includes('authentication') || error.message?.includes('unauthorized')) {
      errorMessage = "Failed to send verification email: Authentication error. Please check Azure Communication Services configuration.";
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      errorMessage = "Failed to send verification email: Email sending quota exceeded. Please contact support.";
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Send invitation email
 * 
 * @param {string} email - Recipient email address
 * @param {string} token - Invitation token
 * @param {string} inviterName - Name of person sending invitation
 * @param {string} organizationName - Organization name
 * @param {string} [tempPassword] - Optional temporary password; when set, user can sign in with email + this password
 * @returns {Promise<Object>} Email send result
 */
export async function sendInvitationEmail(email, token, inviterName, organizationName, tempPassword) {
  // Validate email service configuration
  if (!isEmailConfigured()) {
    throw new Error("Email service not configured. AZURE_COMMUNICATION_CONNECTION_STRING environment variable is required.");
  }

  // Validate required parameters
  if (!email || !email.trim()) {
    throw new Error("Email address is required");
  }
  
  if (!token || !token.trim()) {
    throw new Error("Invitation token is required");
  }

  // Create client using endpoint and credential explicitly
  // Log endpoint status (without exposing the key)
  const endpointPrefix = EMAIL_ENDPOINT ? EMAIL_ENDPOINT.substring(0, 50) + '...' : 'NOT SET';
  console.log(`📧 [INVITE-EMAIL] Using endpoint: ${endpointPrefix}`);
  console.log(`📧 [INVITE-EMAIL] Creating EmailClient with explicit endpoint and credential...`);
  
  let client;
  if (EMAIL_ENDPOINT && EMAIL_ACCESS_KEY) {
    const credential = new AzureKeyCredential(EMAIL_ACCESS_KEY);
    client = new EmailClient(EMAIL_ENDPOINT, credential);
  } else {
    console.warn('⚠️  [INVITE-EMAIL] Endpoint/credential not parsed, falling back to connection string');
    client = new EmailClient(CONNECTION_STRING);
  }

  const invitationLink = `${FRONTEND_URL}/accept-invitation?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
  
  const tempPasswordBlock = tempPassword
    ? `
Your temporary password: ${tempPassword}

Sign in at the link below using this email and the temporary password above. You can change your password after signing in.

`
    : '';

  const tempPasswordBlockHtml = tempPassword
    ? `
						<p><strong>Your temporary password:</strong> <code style="background:#f1f5f9;padding:4px 8px;border-radius:4px;">${tempPassword}</code></p>
						<p>Sign in at the link below using this email and the temporary password above. You can change your password after signing in.</p>
`
    : '';

  console.log(`📧 [INVITE-EMAIL] Preparing invitation email for: ${email}`);
  console.log(`   Invitation link: ${invitationLink.substring(0, 80)}...`);
  console.log(`📧 [INVITE-EMAIL] Using sender address: ${SENDER_EMAIL}`);
  console.log(`📧 [INVITE-EMAIL] Sender email from env: ${process.env.AZURE_COMMUNICATION_SENDER_EMAIL || 'NOT SET'}`);

  // Match the exact working test code structure (same pattern as sendVerificationEmail)
  const emailMessage = {
    senderAddress: SENDER_EMAIL,
    content: {
      subject: `You've been invited to join ${organizationName} on Echopad`,
      plainText: `
You've been invited!

${inviterName} has invited you to join ${organizationName} on Echopad.
${tempPasswordBlock}
Click this link to accept the invitation and sign in:
${invitationLink}

This invitation will expire in 7 days.

If you didn't expect this invitation, please ignore this email.

© ${new Date().getFullYear()} Echopad. All rights reserved.
      `.trim(),
      html: `
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
						${tempPasswordBlockHtml}
						<p>Click the button below to accept the invitation and sign in:</p>
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
    },
    recipients: {
      to: [{ address: email }],
    },
  };

  try {
    // Log the exact message structure being sent (for debugging)
    console.log(`📧 [INVITE-EMAIL] Message structure:`, {
      senderAddress: emailMessage.senderAddress,
      hasContent: !!emailMessage.content,
      hasSubject: !!emailMessage.content.subject,
      hasPlainText: !!emailMessage.content.plainText,
      hasHtml: !!emailMessage.content.html,
      recipientCount: emailMessage.recipients.to.length,
      recipientEmail: emailMessage.recipients.to[0].address,
    });
    console.log(`📧 [INVITE-EMAIL] Sending invitation email via Azure Communication Services...`);
    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
    
    console.log(`✅ [INVITE-EMAIL] Invitation email sent successfully. Message ID: ${result.id}`);
    return {
      success: true,
      messageId: result.id,
    };
  } catch (error) {
    console.error("❌ [INVITE-EMAIL] Failed to send invitation email:", {
      email: email,
      error: error.message,
      errorCode: error.code,
      errorDetails: error.details || error,
    });
    
    // Provide more descriptive error messages
    let errorMessage = `Failed to send invitation email: ${error.message}`;
    
    if (error.message?.includes('connection') || error.message?.includes('network')) {
      errorMessage = "Failed to send invitation email: Network or connection error. Please try again later.";
    } else if (error.message?.includes('authentication') || error.message?.includes('unauthorized')) {
      errorMessage = "Failed to send invitation email: Authentication error. Please check Azure Communication Services configuration.";
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      errorMessage = "Failed to send invitation email: Email sending quota exceeded. Please contact support.";
    }
    
    throw new Error(errorMessage);
  }
}
