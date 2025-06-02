import { mailService } from "./mail";

// Example usage of the mail service

export async function sendWelcomeEmailExample() {
  const result = await mailService.sendWelcomeEmail(
    "user@example.com",
    "John Doe"
  );

  if (result.success) {
    console.log("Welcome email sent successfully:", result.id);
  } else {
    console.error("Failed to send welcome email:", result.error);
  }
}

export async function sendEvaluationResultsExample() {
  const result = await mailService.sendEvaluationResultsEmail(
    "user@example.com",
    "John Doe",
    85,
    [
      "Add a professional headshot",
      "Include more keywords in your summary",
      "Add recommendations from colleagues",
    ]
  );

  if (result.success) {
    console.log("Evaluation results email sent successfully:", result.id);
  } else {
    console.error("Failed to send evaluation results email:", result.error);
  }
}

export async function sendCustomEmailExample() {
  const result = await mailService.sendEmail({
    to: "user@example.com",
    subject: "Custom Email",
    html: "<h1>Hello World</h1><p>This is a custom email.</p>",
    text: "Hello World\n\nThis is a custom email.",
  });

  if (result.success) {
    console.log("Custom email sent successfully:", result.id);
  } else {
    console.error("Failed to send custom email:", result.error);
  }
}

export async function sendPasswordResetExample() {
  const resetUrl = "https://yourapp.com/reset-password?token=abc123";
  const result = await mailService.sendPasswordResetEmail(
    "user@example.com",
    resetUrl
  );

  if (result.success) {
    console.log("Password reset email sent successfully:", result.id);
  } else {
    console.error("Failed to send password reset email:", result.error);
  }
}
