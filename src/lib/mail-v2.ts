/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

import { EmailTemplates } from './mail/template-engine';

// Re-export types for convenience
export interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface EmailResponse {
  success: boolean;
  id?: string;
  error?: string;
}

// Mail provider interface
interface MailProvider {
  sendEmail(options: EmailOptions): Promise<EmailResponse>;
  isConfigured(): boolean;
}

// Resend provider implementation
class ResendProvider implements MailProvider {
  private resend: any = null;
  private defaultFrom: string;

  constructor(defaultFrom?: string) {
    this.defaultFrom =
      defaultFrom || process.env.DEFAULT_FROM_EMAIL || 'noreply@yourapp.com';

    try {
      if (process.env.RESEND_API_KEY) {
        // Dynamic import to avoid issues if Resend is not installed
        const { Resend } = require('resend');
        this.resend = new Resend(process.env.RESEND_API_KEY);
      }
    } catch (error) {
      console.warn('Resend not available:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    if (!this.resend) {
      return {
        success: false,
        error: 'Resend not configured properly',
      };
    }

    try {
      const emailData = {
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        ...(options.html && { html: options.html }),
        ...(options.text && { text: options.text }),
        ...(options.replyTo && { replyTo: options.replyTo }),
        ...(options.cc && { cc: options.cc }),
        ...(options.bcc && { bcc: options.bcc }),
      };

      const result = await this.resend.emails.send(emailData);

      return {
        success: true,
        id: result.data?.id,
      };
    } catch (error) {
      console.error('Resend send error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  isConfigured(): boolean {
    return !!this.resend && !!process.env.RESEND_API_KEY;
  }
}

// New template-based mail service
export class TemplateMailService {
  private provider: MailProvider;
  private defaultFrom: string;

  constructor(providerType: 'resend' = 'resend', defaultFrom?: string) {
    this.defaultFrom =
      defaultFrom || process.env.DEFAULT_FROM_EMAIL || 'noreply@yourapp.com';

    // Initialize mail provider
    switch (providerType) {
      case 'resend':
      default:
        this.provider = new ResendProvider(this.defaultFrom);
        break;
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
    customVariables: Record<string, string> = {}
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
      console.error('Failed to send welcome email:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Template rendering failed',
      };
    }
  }

  /**
   * Send password reset email using template
   */
  async sendPasswordResetEmail(
    to: string,
    resetUrl: string,
    customVariables: Record<string, string> = {}
  ): Promise<EmailResponse> {
    try {
      const { html, text } = await EmailTemplates.renderPasswordReset({
        userEmail: to,
        resetUrl,
        ...customVariables,
      });

      return this.sendEmail({
        to,
        subject: 'Şifre Sıfırlama - LinkedIn Profil Değerlendirici',
        html,
        text,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Template rendering failed',
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
    customVariables: Record<string, string> = {}
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
        subject: 'LinkedIn Profil Değerlendirme Sonuçlarınız',
        html,
        text,
      });
    } catch (error) {
      console.error('Failed to send evaluation results email:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Template rendering failed',
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
      emailOptions.text = message.replace(/<[^>]*>/g, '');
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
      emails.map(emailOptions => this.sendEmail(emailOptions))
    );

    return results.map(result =>
      result.status === 'fulfilled'
        ? result.value
        : { success: false, error: 'Failed to send email' }
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
}

// Export a singleton instance
export const mailService = new TemplateMailService('resend');

// Backward compatibility - re-export the old interface
export { TemplateMailService as MailService };
