import { EmailTemplates } from "./template-engine";
import {
  MailProvider,
  MailProviderFactory,
  EmailOptions,
  EmailResponse,
} from "./providers";

export interface MailServiceConfig {
  provider?: "resend" | "nodemailer" | "sendgrid" | "awsses" | "auto";
  providerConfig?: any;
  defaultFrom?: string;
}

export class MailService {
  private provider: MailProvider;
  private defaultFrom: string;

  constructor(config: MailServiceConfig = {}) {
    this.defaultFrom =
      config.defaultFrom ||
      process.env.DEFAULT_FROM_EMAIL ||
      "noreply@yourapp.com";

    // Initialize mail provider
    if (config.provider === "auto" || !config.provider) {
      this.provider = MailProviderFactory.autoDetectProvider();
    } else {
      this.provider = MailProviderFactory.createProvider(
        config.provider,
        config.providerConfig
      );
    }
  }

  /**
   * Send a basic email
   */
  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    const emailOptions = {
      ...options,
      from: options.from || this.defaultFrom,
    };

    return this.provider.sendEmail(emailOptions);
  }

  /**
   * Send welcome email using template
   */
  async sendWelcomeEmail(
    to: string,
    userName: string,
    customVariables?: Record<string, any>
  ): Promise<EmailResponse> {
    try {
      const { html, text } = await EmailTemplates.renderWelcome({
        userName,
        userEmail: to,
        ...customVariables,
      });

      return this.sendEmail({
        to,
        subject: "LinkedIn Profil Değerlendirici'ye Hoş Geldiniz!",
        html,
        text,
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Template rendering failed",
      };
    }
  }

  /**
   * Send password reset email using template
   */
  async sendPasswordResetEmail(
    to: string,
    resetUrl: string,
    customVariables?: Record<string, any>
  ): Promise<EmailResponse> {
    try {
      const { html, text } = await EmailTemplates.renderPasswordReset({
        userEmail: to,
        resetUrl,
        ...customVariables,
      });

      return this.sendEmail({
        to,
        subject: "Şifre Sıfırlama - LinkedIn Profil Değerlendirici",
        html,
        text,
      });
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Template rendering failed",
      };
    }
  }

  /**
   * Send evaluation results email using template
   */
  async sendEvaluationResultsEmail(
    to: string,
    userName: string,
    score: number,
    recommendations: string[],
    customVariables?: Record<string, any>
  ): Promise<EmailResponse> {
    try {
      const { html, text } = await EmailTemplates.renderEvaluationResults({
        userName,
        userEmail: to,
        score,
        recommendations,
        ...customVariables,
      });

      return this.sendEmail({
        to,
        subject: "LinkedIn Profil Değerlendirme Sonuçlarınız",
        html,
        text,
      });
    } catch (error) {
      console.error("Failed to send evaluation results email:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Template rendering failed",
      };
    }
  }

  /**
   * Send notification email
   */
  async sendNotificationEmail(
    to: string,
    subject: string,
    message: string,
    isHtml = false
  ): Promise<EmailResponse> {
    const emailOptions: EmailOptions = {
      to,
      subject,
    };

    if (isHtml) {
      // Use a simple HTML wrapper for notifications
      emailOptions.html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0077b5;">Bildirim</h2>
          <div style="color: #333333; font-size: 16px; line-height: 1.6;">
            ${message}
          </div>
          <p style="color: #666666; font-size: 14px; margin-top: 30px;">
            Saygılarımızla,<br>LinkedIn Profil Değerlendirici Ekibi
          </p>
        </div>
      `;
      emailOptions.text = message.replace(/<[^>]*>/g, ""); // Strip HTML for text version
    } else {
      emailOptions.text = message;
    }

    return this.sendEmail(emailOptions);
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmails(emails: EmailOptions[]): Promise<EmailResponse[]> {
    const results = await Promise.allSettled(
      emails.map((emailOptions) => this.sendEmail(emailOptions))
    );

    return results.map((result) =>
      result.status === "fulfilled"
        ? result.value
        : { success: false, error: "Failed to send email" }
    );
  }

  /**
   * Check if the mail service is configured properly
   */
  isConfigured(): boolean {
    return this.provider.isConfigured();
  }

  /**
   * Get current provider information
   */
  getProviderInfo(): { name: string; configured: boolean } {
    return {
      name: this.provider.constructor.name,
      configured: this.provider.isConfigured(),
    };
  }

  /**
   * Switch to a different provider
   */
  switchProvider(
    providerType: "resend" | "nodemailer" | "sendgrid" | "awsses",
    config?: any
  ): void {
    this.provider = MailProviderFactory.createProvider(providerType, config);
  }
}

// Export a singleton instance with auto-detection
export const mailService = new MailService({ provider: "auto" });

// Export the class for custom instances
export { MailService };
