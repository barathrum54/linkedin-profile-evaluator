import fs from "fs";
import path from "path";

export interface TemplateVariables {
  [key: string]: string | number | boolean | undefined;
}

export class TemplateEngine {
  private static templatesPath = path.join(process.cwd(), "src", "templates");

  /**
   * Render a template with given variables
   */
  static async renderTemplate(
    templateName: string,
    variables: TemplateVariables
  ): Promise<{ html: string; text: string }> {
    try {
      // Read HTML template
      const templatePath = path.join(
        this.templatesPath,
        `${templateName}.html`
      );
      let html = await fs.promises.readFile(templatePath, "utf-8");

      // Replace placeholders with variables
      html = this.replacePlaceholders(html, variables);

      // Generate text version by stripping HTML
      const text = this.htmlToText(html);

      return { html, text };
    } catch (error) {
      console.error(`Failed to render template ${templateName}:`, error);
      throw new Error(`Template rendering failed: ${templateName}`);
    }
  }

  /**
   * Replace {{variable}} placeholders with actual values
   */
  private static replacePlaceholders(
    template: string,
    variables: TemplateVariables
  ): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = variables[key];
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Convert HTML to plain text for email text version
   */
  private static htmlToText(html: string): string {
    return (
      html
        // Remove HTML tags
        .replace(/<[^>]*>/g, "")
        // Decode HTML entities
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        // Clean up whitespace
        .replace(/\s+/g, " ")
        .replace(/\n\s+/g, "\n")
        .trim()
    );
  }

  /**
   * Check if template exists
   */
  static templateExists(templateName: string): boolean {
    const templatePath = path.join(this.templatesPath, `${templateName}.html`);
    return fs.existsSync(templatePath);
  }

  /**
   * List available templates
   */
  static getAvailableTemplates(): string[] {
    try {
      return fs
        .readdirSync(this.templatesPath)
        .filter((file) => file.endsWith(".html"))
        .map((file) => file.replace(".html", ""));
    } catch (error) {
      console.error("Failed to read templates directory:", error);
      return [];
    }
  }
}

// Template-specific helper functions
export class EmailTemplates {
  /**
   * Render welcome email template
   */
  static async renderWelcome(variables: {
    userName: string;
    userEmail: string;
    baseUrl?: string;
    supportEmail?: string;
  }) {
    return TemplateEngine.renderTemplate("welcome", {
      userName: variables.userName,
      userEmail: variables.userEmail,
      baseUrl:
        variables.baseUrl ||
        process.env.NEXTAUTH_URL ||
        "http://localhost:3000",
      supportEmail:
        variables.supportEmail ||
        process.env.SUPPORT_EMAIL ||
        "support@yourapp.com",
    });
  }

  /**
   * Render password reset email template
   */
  static async renderPasswordReset(variables: {
    userEmail: string;
    resetUrl: string;
    expiryTime?: string;
    supportEmail?: string;
  }) {
    return TemplateEngine.renderTemplate("password-reset", {
      userEmail: variables.userEmail,
      resetUrl: variables.resetUrl,
      expiryTime: variables.expiryTime || "1 saat",
      supportEmail:
        variables.supportEmail ||
        process.env.SUPPORT_EMAIL ||
        "support@yourapp.com",
    });
  }

  /**
   * Render evaluation results email template
   */
  static async renderEvaluationResults(variables: {
    userName: string;
    userEmail: string;
    score: number;
    recommendations: string[];
    baseUrl?: string;
    evaluationDate?: string;
  }) {
    // Determine score color based on score
    let scoreColor = "28a745"; // Green
    let scoreColorDark = "1e7e34";
    let scoreMessage = "Harika! Profiliniz mükemmel durumda.";

    if (variables.score < 70) {
      scoreColor = "ffc107"; // Yellow
      scoreColorDark = "e0a800";
      scoreMessage = "İyi! Birkaç iyileştirme ile daha da iyi olabilir.";
    }
    if (variables.score < 50) {
      scoreColor = "dc3545"; // Red
      scoreColorDark = "c82333";
      scoreMessage = "Gelişime açık! Önerilerimizi takip edin.";
    }

    // Format recommendations as HTML list
    const recommendationsList = variables.recommendations
      .map(
        (
          rec
        ) => `<div style="margin-bottom: 15px; padding: 15px; background-color: #ffffff; border-left: 4px solid #0077b5; border-radius: 4px;">
        <span style="color: #333333; font-size: 15px; line-height: 1.5;">✓ ${rec}</span>
      </div>`
      )
      .join("");

    return TemplateEngine.renderTemplate("evaluation-results", {
      userName: variables.userName,
      userEmail: variables.userEmail,
      score: variables.score,
      scoreColor,
      scoreColorDark,
      scoreMessage,
      recommendationsList,
      baseUrl:
        variables.baseUrl ||
        process.env.NEXTAUTH_URL ||
        "http://localhost:3000",
      evaluationDate:
        variables.evaluationDate || new Date().toLocaleDateString("tr-TR"),
    });
  }
}
