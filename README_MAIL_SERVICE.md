# Mail Service Documentation

This document explains how to use the integrated Resend mail service in your LinkedIn Profile Evaluator application.

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
RESEND_API_KEY=your_resend_api_key_here
DEFAULT_FROM_EMAIL=noreply@yourdomain.com  # Optional
NEXTAUTH_URL=http://localhost:3000  # For development
```

### 2. Installation

The Resend package has been installed automatically. If you need to reinstall:

```bash
npm install resend
```

## Usage

### Basic Email Sending

```typescript
import { mailService } from "@/lib/mail";

// Send a basic email
const result = await mailService.sendEmail({
  to: "user@example.com",
  subject: "Test Email",
  html: "<h1>Hello World</h1>",
  text: "Hello World",
});

if (result.success) {
  console.log("Email sent successfully:", result.id);
} else {
  console.error("Failed to send email:", result.error);
}
```

### Pre-built Templates

#### Welcome Email

```typescript
const result = await mailService.sendWelcomeEmail(
  "user@example.com",
  "John Doe"
);
```

#### Profile Evaluation Results

```typescript
const result = await mailService.sendEvaluationResultsEmail(
  "user@example.com",
  "John Doe",
  85,
  [
    "Profesyonel fotoğraf ekleyin",
    "Özet bölümünde daha fazla anahtar kelime kullanın",
    "İş arkadaşlarınızdan tavsiye isteyin",
  ]
);
```

#### Password Reset

```typescript
const resetUrl =
  "https://yourapp.com/auth/reset-password?token=abc123&email=user@example.com";
const result = await mailService.sendPasswordResetEmail(
  "user@example.com",
  resetUrl
);
```

#### General Notifications

```typescript
const result = await mailService.sendNotificationEmail(
  "user@example.com",
  "Profile Updated",
  "Your LinkedIn profile has been successfully updated.",
  false // isHtml
);
```

#### Bulk Emails

```typescript
const emails = [
  {
    to: "user1@example.com",
    subject: "Newsletter",
    html: "<h1>Monthly Newsletter</h1>",
  },
  {
    to: "user2@example.com",
    subject: "Newsletter",
    html: "<h1>Monthly Newsletter</h1>",
  },
];

const results = await mailService.sendBulkEmails(emails);
```

## Integrated Features

### Password Reset Flow

The password reset functionality has been fully integrated:

1. **Request Reset**: `/auth/forgot-password` page sends reset request
2. **API Endpoint**: `/api/auth/forgot-password` handles the request and sends email
3. **Reset Page**: `/auth/reset-password` allows users to set new password
4. **Token Validation**: `/api/auth/validate-reset-token` validates reset tokens
5. **Password Update**: `/api/auth/reset-password` updates the password

### User Registration

Welcome emails are automatically sent when users register via `/api/auth/register`.

## API Endpoints

### POST `/api/auth/forgot-password`

- Accepts: `{ email: string }`
- Generates reset token and sends email
- Returns success message (always, for security)

### POST `/api/auth/validate-reset-token`

- Accepts: `{ token: string, email: string }`
- Validates if token exists and hasn't expired
- Returns: `{ valid: boolean, message?: string }`

### POST `/api/auth/reset-password`

- Accepts: `{ token: string, email: string, password: string }`
- Updates user password and removes used token
- Returns success or error message

## Database Collections

### `password_reset_tokens`

Stores password reset tokens with expiry times:

```javascript
{
  email: "user@example.com",
  token: "randomhexstring",
  expiry: Date,
  createdAt: Date
}
```

## Security Features

1. **Token Expiry**: Reset tokens expire after 1 hour
2. **Single Use**: Tokens are deleted after use
3. **Email Enumeration Protection**: Same response for valid/invalid emails
4. **Token Cleanup**: Old tokens are automatically removed

## Error Handling

The mail service includes comprehensive error handling:

- Network failures are caught and logged
- Invalid configurations are detected
- Email failures don't break the main application flow

## Example Integration in API Routes

```typescript
// In any API route
import { mailService } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    // Your business logic here

    // Send notification email
    await mailService.sendNotificationEmail(
      user.email,
      "Profile Evaluated",
      `Your LinkedIn profile has been evaluated. Score: ${score}/100`,
      false
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
```

## Customization

### Adding New Email Templates

1. Add a new method to the `MailService` class in `src/lib/mail.ts`
2. Follow the existing pattern for HTML and text content
3. Use the Turkish language to match the application

### Styling Guidelines

- Use inline CSS for email compatibility
- LinkedIn blue color: `#0077b5`
- Keep responsive design principles
- Include both HTML and text versions

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: There might be some minor TypeScript compatibility issues with Resend types, but functionality works correctly.

2. **Email Not Sending**: Check your Resend API key and domain configuration.

3. **Token Validation Fails**: Ensure your MongoDB connection is working and tokens aren't expired.

### Testing

Use the example functions in `src/lib/mail-example.ts` to test different email types:

```bash
# In your development environment
import { sendWelcomeEmailExample } from '@/lib/mail-example';
await sendWelcomeEmailExample();
```

## Production Considerations

1. Set up proper domain authentication in Resend
2. Configure appropriate rate limits
3. Set up monitoring for email delivery
4. Use environment-specific from addresses
5. Consider implementing email queues for high volume

## Support

For Resend-specific issues, refer to:

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)

For application-specific mail service questions, check the implementation in `src/lib/mail.ts`.
