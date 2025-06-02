# Template-Based Mail Service Guide

This guide explains the new template-based, provider-agnostic email system for your LinkedIn Profile Evaluator application.

## 🎯 **Key Benefits**

✅ **Provider Independence**: Easily switch between email providers (Resend, SendGrid, AWS SES, NodeMailer)  
✅ **HTML Templates**: Professional email designs stored as separate HTML files  
✅ **Dynamic Content**: Template variables for personalized emails  
✅ **Maintainable**: Separate concerns - templates, logic, and providers  
✅ **Future-Proof**: Add new providers without changing application code

## 📁 **File Structure**

```
src/
├── templates/
│   ├── welcome.html              # Welcome email template
│   ├── password-reset.html       # Password reset template
│   └── evaluation-results.html   # Profile evaluation results
├── lib/
│   ├── mail/
│   │   ├── template-engine.ts    # Template rendering engine
│   │   └── providers.ts          # Mail provider implementations
│   ├── mail-v2.ts               # New template-based service
│   └── mail.ts                  # Original service (deprecated)
```

## 🚀 **Quick Start**

### 1. Environment Setup

```bash
# For Resend (default)
RESEND_API_KEY=your_resend_api_key_here

# Optional configuration
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com
NEXTAUTH_URL=http://localhost:3000
```

### 2. Basic Usage

```typescript
import { mailService } from "@/lib/mail-v2";

// Send welcome email with template
await mailService.sendWelcomeEmail("user@example.com", "John Doe");

// Send password reset with template
await mailService.sendPasswordResetEmail(
  "user@example.com",
  "https://yourapp.com/reset?token=abc123"
);

// Send evaluation results with template
await mailService.sendEvaluationResultsEmail(
  "user@example.com",
  "John Doe",
  85,
  ["Add professional photo", "Improve summary"]
);
```

## 📧 **HTML Templates**

### Template Variables

Templates use `{{variableName}}` syntax for dynamic content:

```html
<h2>Welcome, {{userName}}!</h2>
<p>Your email is: {{userEmail}}</p>
<a href="{{baseUrl}}/dashboard">Get Started</a>
```

### Available Templates

#### 1. **Welcome Template** (`welcome.html`)

Variables:

- `{{userName}}` - User's name
- `{{userEmail}}` - User's email address
- `{{baseUrl}}` - Application base URL
- `{{supportEmail}}` - Support email address

#### 2. **Password Reset Template** (`password-reset.html`)

Variables:

- `{{userEmail}}` - User's email address
- `{{resetUrl}}` - Password reset URL with token
- `{{expiryTime}}` - Token expiry time (default: "1 saat")
- `{{supportEmail}}` - Support email address

#### 3. **Evaluation Results Template** (`evaluation-results.html`)

Variables:

- `{{userName}}` - User's name
- `{{userEmail}}` - User's email address
- `{{score}}` - Evaluation score (0-100)
- `{{scoreColor}}` - Dynamic color based on score
- `{{scoreColorDark}}` - Darker shade for gradients
- `{{scoreMessage}}` - Dynamic message based on score
- `{{recommendationsList}}` - Formatted HTML list of recommendations
- `{{baseUrl}}` - Application base URL
- `{{evaluationDate}}` - Evaluation date

### Creating New Templates

1. Create a new HTML file in `src/templates/`
2. Use inline CSS for email compatibility
3. Add variables with `{{variableName}}` syntax
4. Create a render method in `EmailTemplates` class

Example new template:

```html
<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <title>{{subject}}</title>
  </head>
  <body style="font-family: Arial, sans-serif;">
    <h1>{{title}}</h1>
    <p>Hello {{userName}},</p>
    <p>{{message}}</p>
  </body>
</html>
```

## 🔄 **Provider Management**

### Switching Providers

```typescript
import { TemplateMailService } from "@/lib/mail-v2";

// Create service with specific provider
const mailService = new TemplateMailService("resend");

// Check current provider
console.log(mailService.getProviderInfo());
// Output: { name: 'ResendProvider', configured: true }
```

### Supported Providers

#### 1. **Resend** (Default)

```bash
RESEND_API_KEY=your_api_key
```

#### 2. **SendGrid** (Coming Soon)

```bash
SENDGRID_API_KEY=your_api_key
```

#### 3. **AWS SES** (Coming Soon)

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

#### 4. **NodeMailer/SMTP** (Coming Soon)

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password
```

## 📝 **Advanced Usage**

### Custom Variables

You can pass additional variables to templates:

```typescript
await mailService.sendWelcomeEmail("user@example.com", "John Doe", {
  companyName: "Your Company",
  specialOffer: "Get 50% off premium features!",
  customMessage: "Thanks for joining our beta program",
});
```

### Template Rendering Only

```typescript
import { EmailTemplates } from "@/lib/mail/template-engine";

// Render template without sending
const { html, text } = await EmailTemplates.renderWelcome({
  userName: "John Doe",
  userEmail: "user@example.com",
});

console.log(html); // Rendered HTML
console.log(text); // Automatically generated text version
```

### Direct Template Engine Usage

```typescript
import { TemplateEngine } from "@/lib/mail/template-engine";

// Render any template
const { html, text } = await TemplateEngine.renderTemplate("custom-template", {
  title: "Custom Title",
  message: "Custom message content",
});

// Check if template exists
if (TemplateEngine.templateExists("my-template")) {
  // Template exists
}

// List all available templates
const templates = TemplateEngine.getAvailableTemplates();
console.log(templates); // ['welcome', 'password-reset', 'evaluation-results']
```

## 🎨 **Template Design Guidelines**

### CSS Best Practices

- Use inline CSS for maximum email client compatibility
- Avoid CSS Grid and Flexbox (limited support)
- Use tables for complex layouts
- Keep width under 600px for mobile compatibility

### Color Scheme

- LinkedIn Blue: `#0077b5`
- Success Green: `#28a745`
- Warning Yellow: `#ffc107`
- Danger Red: `#dc3545`
- Light Gray: `#f8f9fa`

### Typography

- Use web-safe fonts: Arial, Helvetica, sans-serif
- Font sizes: 14px-16px for body, 18px-24px for headings
- Line height: 1.6 for readability

## 🔧 **API Integration**

### In API Routes

```typescript
import { mailService } from "@/lib/mail-v2";

export async function POST(request: NextRequest) {
  try {
    // Your business logic

    // Send email
    const result = await mailService.sendWelcomeEmail(user.email, user.name);

    if (!result.success) {
      console.error("Email failed:", result.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

### Error Handling

```typescript
const result = await mailService.sendWelcomeEmail("user@example.com", "John");

if (result.success) {
  console.log("Email sent successfully:", result.id);
} else {
  console.error("Email failed:", result.error);
  // Handle error (retry, log, notify admin, etc.)
}
```

## 📊 **Migration from Old Service**

### Before (Old Service)

```typescript
import { mailService } from "@/lib/mail";

await mailService.sendWelcomeEmail("user@example.com", "John Doe");
```

### After (New Template Service)

```typescript
import { mailService } from "@/lib/mail-v2";

await mailService.sendWelcomeEmail("user@example.com", "John Doe");
```

The API is mostly the same, but now uses professional HTML templates!

## 🚀 **Production Considerations**

### Performance

- Templates are read from disk on each render (consider caching for high volume)
- Provider auto-detection adds minimal overhead
- Use bulk sending for newsletters

### Security

- All template variables are automatically escaped
- Reset tokens are cryptographically secure
- Email enumeration protection is built-in

### Monitoring

- Check provider configuration on startup
- Log email failures for debugging
- Monitor delivery rates by provider

### Scalability

- Consider implementing email queues for high volume
- Use multiple providers for redundancy
- Implement rate limiting as needed

## 🔍 **Troubleshooting**

### Common Issues

1. **Templates not found**

   - Check file paths in `src/templates/`
   - Ensure files have `.html` extension
   - Verify template names match function calls

2. **Variables not rendering**

   - Check variable names match `{{variableName}}` syntax
   - Ensure variables are passed to render functions
   - Variables are case-sensitive

3. **Provider not configured**
   - Verify environment variables are set
   - Check API keys are valid
   - Test provider configuration with simple email

### Debug Mode

```typescript
// Check service status
console.log(mailService.getProviderInfo());
// Output: { name: 'ResendProvider', configured: true }

// Check if configured
if (!mailService.isConfigured()) {
  console.error("Mail service not configured properly");
}

// List available templates
import { TemplateEngine } from "@/lib/mail/template-engine";
console.log("Available templates:", TemplateEngine.getAvailableTemplates());
```

## 📚 **Examples**

### Example 1: Custom Newsletter Template

```typescript
// 1. Create src/templates/newsletter.html
// 2. Add render method to EmailTemplates class
// 3. Use in your application

import { TemplateEngine } from "@/lib/mail/template-engine";

const { html, text } = await TemplateEngine.renderTemplate("newsletter", {
  title: "Monthly Newsletter",
  articles: "<li>Article 1</li><li>Article 2</li>",
  unsubscribeUrl: "https://yourapp.com/unsubscribe",
});

await mailService.sendEmail({
  to: subscribers,
  subject: "Monthly Newsletter",
  html,
  text,
});
```

### Example 2: Profile Update Notification

```typescript
await mailService.sendNotificationEmail(
  "user@example.com",
  "Profile Updated Successfully",
  "Your LinkedIn profile has been updated with the latest changes.",
  true // Send as HTML
);
```

This new template-based system gives you complete control over email design while maintaining flexibility to switch providers as needed!
