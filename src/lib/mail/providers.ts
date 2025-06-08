/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */

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

// Abstract mail provider interface
export abstract class MailProvider {
  protected defaultFrom: string;

  constructor(defaultFrom?: string) {
    this.defaultFrom =
      defaultFrom || process.env.DEFAULT_FROM_EMAIL || 'noreply@yourapp.com';
  }

  abstract sendEmail(options: EmailOptions): Promise<EmailResponse>;
  abstract isConfigured(): boolean;
}

// Resend implementation
export class ResendProvider extends MailProvider {
  private resend: {
    emails: { send: (data: unknown) => Promise<{ data?: { id: string } }> };
  } | null = null;

  constructor(apiKey?: string, defaultFrom?: string) {
    super(defaultFrom);

    if (!apiKey && !process.env.RESEND_API_KEY) {
      console.warn('Resend API key not provided');
      return;
    }

    try {
      // Dynamic import to avoid issues if Resend is not installed
      const { Resend } = require('resend');
      this.resend = new Resend(apiKey || process.env.RESEND_API_KEY);
    } catch (error) {
      console.error('Failed to initialize Resend:', error);
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

// NodeMailer implementation (as fallback or alternative)
export class NodeMailerProvider extends MailProvider {
  private transporter: {
    sendMail: (options: unknown) => Promise<{ messageId: string }>;
  } | null = null;

  constructor(config?: Record<string, unknown>, defaultFrom?: string) {
    super(defaultFrom);

    try {
      const nodemailer = require('nodemailer');

      // Default SMTP configuration
      const defaultConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      };

      this.transporter = nodemailer.createTransporter(config || defaultConfig);
    } catch (error) {
      console.error('Failed to initialize NodeMailer:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    if (!this.transporter) {
      return {
        success: false,
        error: 'NodeMailer not configured properly',
      };
    }

    try {
      const mailOptions = {
        from: options.from || this.defaultFrom,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
        cc: Array.isArray(options.cc) ? options.cc.join(', ') : options.cc,
        bcc: Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc,
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        id: result.messageId,
      };
    } catch (error) {
      console.error('NodeMailer send error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  isConfigured(): boolean {
    return (
      !!this.transporter &&
      !!(
        process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASSWORD
      )
    );
  }
}

// SendGrid implementation
export class SendGridProvider extends MailProvider {
  private sgMail: {
    send: (
      msg: unknown
    ) => Promise<[{ headers?: { 'x-message-id'?: string } }]>;
  } | null = null;

  constructor(apiKey?: string, defaultFrom?: string) {
    super(defaultFrom);

    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(apiKey || process.env.SENDGRID_API_KEY);
      this.sgMail = sgMail;
    } catch (error) {
      console.error('Failed to initialize SendGrid:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    if (!this.sgMail) {
      return {
        success: false,
        error: 'SendGrid not configured properly',
      };
    }

    try {
      const msg = {
        to: options.to,
        from: options.from || this.defaultFrom,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
        cc: options.cc,
        bcc: options.bcc,
      };

      const result = await this.sgMail.send(msg);

      return {
        success: true,
        id: result[0]?.headers?.['x-message-id'],
      };
    } catch (error) {
      console.error('SendGrid send error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  isConfigured(): boolean {
    return !!this.sgMail && !!process.env.SENDGRID_API_KEY;
  }
}

// AWS SES implementation
export class AWSESProvider extends MailProvider {
  private ses: {
    sendEmail: (params: unknown) => {
      promise: () => Promise<{ MessageId: string }>;
    };
  } | null = null;

  constructor(config?: Record<string, unknown>, defaultFrom?: string) {
    super(defaultFrom);

    try {
      const AWS = require('aws-sdk');

      const sesConfig = {
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        ...config,
      };

      this.ses = new AWS.SES(sesConfig);
    } catch (error) {
      console.error('Failed to initialize AWS SES:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    if (!this.ses) {
      return {
        success: false,
        error: 'AWS SES not configured properly',
      };
    }

    try {
      const params = {
        Destination: {
          ToAddresses: Array.isArray(options.to) ? options.to : [options.to],
          ...(options.cc && {
            CcAddresses: Array.isArray(options.cc) ? options.cc : [options.cc],
          }),
          ...(options.bcc && {
            BccAddresses: Array.isArray(options.bcc)
              ? options.bcc
              : [options.bcc],
          }),
        },
        Message: {
          Body: {
            ...(options.html && {
              Html: { Charset: 'UTF-8', Data: options.html },
            }),
            ...(options.text && {
              Text: { Charset: 'UTF-8', Data: options.text },
            }),
          },
          Subject: { Charset: 'UTF-8', Data: options.subject },
        },
        Source: options.from || this.defaultFrom,
        ...(options.replyTo && { ReplyToAddresses: [options.replyTo] }),
      };

      const result = await this.ses.sendEmail(params).promise();

      return {
        success: true,
        id: result.MessageId,
      };
    } catch (error) {
      console.error('AWS SES send error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  isConfigured(): boolean {
    return (
      !!this.ses &&
      !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
    );
  }
}

// Provider factory
export class MailProviderFactory {
  static createProvider(
    providerType: 'resend' | 'nodemailer' | 'sendgrid' | 'awsses' = 'resend',
    config?: any
  ): MailProvider {
    switch (providerType.toLowerCase()) {
      case 'resend':
        return new ResendProvider(config?.apiKey, config?.defaultFrom);
      case 'nodemailer':
        return new NodeMailerProvider(config, config?.defaultFrom);
      case 'sendgrid':
        return new SendGridProvider(config?.apiKey, config?.defaultFrom);
      case 'awsses':
        return new AWSESProvider(config, config?.defaultFrom);
      default:
        throw new Error(`Unsupported mail provider: ${providerType}`);
    }
  }

  static autoDetectProvider(): MailProvider {
    // Try providers in order of preference
    const providers = [
      () => new ResendProvider(),
      () => new SendGridProvider(),
      () => new NodeMailerProvider(),
      () => new AWSESProvider(),
    ];

    for (const createProvider of providers) {
      try {
        const provider = createProvider();
        if (provider.isConfigured()) {
          console.log(
            `Auto-detected mail provider: ${provider.constructor.name}`
          );
          return provider;
        }
      } catch (error) {
        // Continue to next provider
      }
    }

    console.warn('No configured mail provider found, falling back to Resend');
    return new ResendProvider();
  }
}
