import { Resend } from "resend";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

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

class MailService {
  private defaultFrom: string;

  constructor() {
    // Set a default from address - you can customize this
    this.defaultFrom =
      process.env.DEFAULT_FROM_EMAIL || "onboarding@resend.dev";

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set in environment variables");
    }
  }

  /**
   * Send a single email
   */
  async sendEmail(options: EmailOptions): Promise<EmailResponse> {
    try {
      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured");
      }

      // Use Resend's interface directly
      const result = await resend.emails.send({
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
        cc: options.cc,
        bcc: options.bcc,
      });

      return {
        success: true,
        id: result.data?.id,
      };
    } catch (error) {
      console.error("Failed to send email:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(to: string, userName: string): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      subject: "LinkedIn Profil Değerlendirici'ye Hoş Geldiniz!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0077b5;">Hoş Geldiniz, ${userName}!</h2>
          <p>LinkedIn Profil Değerlendirici\'ye katıldığınız için teşekkür ederiz. LinkedIn profilinizi optimize etmenize yardımcı olmaktan heyecan duyuyoruz.</p>
          <p>Şimdi yapabilecekleriniz:</p>
          <ul>
            <li>LinkedIn profilinizi değerlendirme için yükleyin</li>
            <li>Kişiselleştirilmiş öneriler alın</li>
            <li>Zaman içindeki ilerlemenizi takip edin</li>
          </ul>
          <p>Herhangi bir sorunuz varsa, destek ekibimizle iletişime geçmekten çekinmeyin.</p>
          <p>Saygılarımızla,<br>LinkedIn Profil Değerlendirici Ekibi</p>
        </div>
      `,
      text: `Hoş Geldiniz, ${userName}! LinkedIn Profil Değerlendirici'ye katıldığınız için teşekkür ederiz. LinkedIn profilinizi optimize etmenize yardımcı olmaktan heyecan duyuyoruz.`,
    });
  }

  /**
   * Send profile evaluation results email
   */
  async sendEvaluationResultsEmail(
    to: string,
    userName: string,
    score: number,
    recommendations: string[]
  ): Promise<EmailResponse> {
    const recommendationsList = recommendations
      .map((rec) => `<li>${rec}</li>`)
      .join("");

    return this.sendEmail({
      to,
      subject: "LinkedIn Profil Değerlendirme Sonuçlarınız",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0077b5;">Profil Değerlendirme Sonuçlarınız</h2>
          <p>Merhaba ${userName},</p>
          <p>LinkedIn profil değerlendirmenizi tamamladık. İşte sonuçlarınız:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0077b5; margin-top: 0;">Genel Puan: ${score}/100</h3>
          </div>

          <h3>İyileştirme Önerileri:</h3>
          <ul>
            ${recommendationsList}
          </ul>

          <p>Profilinizi geliştirmeye devam edin ve güncellenmiş değerlendirmeler için tekrar kontrol edin!</p>
          <p>Saygılarımızla,<br>LinkedIn Profil Değerlendirici Ekibi</p>
        </div>
      `,
      text: `Merhaba ${userName}, LinkedIn profil değerlendirmeniz tamamlandı. Genel Puan: ${score}/100. Öneriler: ${recommendations.join(", ")}`,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    resetUrl: string
  ): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      subject: "Şifre Sıfırlama - LinkedIn Profil Değerlendirici",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0077b5;">Şifre Sıfırlama İsteği</h2>
          <p>LinkedIn Profil Değerlendirici hesabınız için şifre sıfırlama talebinde bulundunuz.</p>
          <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #0077b5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Şifreyi Sıfırla
            </a>
          </div>

          <p>Buton çalışmıyorsa, aşağıdaki bağlantıyı tarayıcınıza kopyalayıp yapıştırın:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          
          <p>Bu bağlantı güvenlik nedeniyle 1 saat içinde sona erecektir.</p>
          <p>Eğer bu şifre sıfırlama talebini siz yapmadıysanız, lütfen bu e-postayı görmezden gelin.</p>
          
          <p>Saygılarımızla,<br>LinkedIn Profil Değerlendirici Ekibi</p>
        </div>
      `,
      text: `Şifre sıfırlama talebinde bulundunuz. Şifrenizi sıfırlamak için bu bağlantıya tıklayın: ${resetUrl}. Bu bağlantı 1 saat içinde sona erecektir.`,
    });
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0077b5;">Notification</h2>
          <div>${message}</div>
          <p>Best regards,<br>The LinkedIn Profile Evaluator Team</p>
        </div>
      `;
      emailOptions.text = message.replace(/<[^>]*>/g, ""); // Strip HTML for text version
    } else {
      emailOptions.text = message;
    }

    return this.sendEmail(emailOptions);
  }

  /**
   * Send bulk emails (useful for newsletters or announcements)
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
}

// Export a singleton instance
export const mailService = new MailService();

// Export the class for testing or custom instances
export { MailService };
