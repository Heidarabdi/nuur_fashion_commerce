import { Resend } from "resend";

interface OrderEmailData {
    orderId: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}

interface UserEmailData {
    name: string;
    email: string;
}

interface VerificationEmailData extends UserEmailData {
    verificationUrl: string;
}

/**
 * Create email service per-request for Cloudflare Workers
 */
export const createEmailService = (apiKey: string, fromEmail: string) => {
    const resend = new Resend(apiKey);
    const from = `Nuur Fashion <${fromEmail}>`;

    return {
        /**
         * Send order confirmation email
         */
        async sendOrderConfirmation(data: OrderEmailData) {
            const itemsList = data.items
                .map((item) => `• ${item.name} x${item.quantity} - $${item.price.toFixed(2)}`)
                .join("\n");

            const { data: result, error } = await resend.emails.send({
                from,
                to: [data.customerEmail],
                subject: `Order Confirmation #${data.orderId.slice(0, 8).toUpperCase()}`,
                html: `
                    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #1a1a1a; font-size: 24px;">Thank you for your order, ${data.customerName}!</h1>
                        
                        <p style="color: #666; font-size: 16px;">Your order has been received and is being processed.</p>
                        
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h2 style="color: #1a1a1a; font-size: 18px; margin-top: 0;">Order #${data.orderId.slice(0, 8).toUpperCase()}</h2>
                            <pre style="font-family: inherit; white-space: pre-wrap;">${itemsList}</pre>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;" />
                            <p style="font-size: 18px; font-weight: bold; margin: 0;">
                                Total: $${data.totalAmount.toFixed(2)}
                            </p>
                        </div>
                        
                        <p style="color: #666; font-size: 14px;">
                            You'll receive another email when your order ships.
                        </p>
                        
                        <p style="color: #999; font-size: 12px; margin-top: 40px;">
                            Nuur Fashion - Elevate your style
                        </p>
                    </div>
                `,
            });

            if (error) {
                console.error("Failed to send order confirmation email:", error);
                throw new Error(`Failed to send email: ${error.message}`);
            }

            return result;
        },

        /**
         * Send welcome email after signup
         */
        async sendWelcomeEmail(data: UserEmailData, frontendUrl: string) {
            const { data: result, error } = await resend.emails.send({
                from,
                to: [data.email],
                subject: "Welcome to Nuur Fashion!",
                html: `
                    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #1a1a1a; font-size: 28px;">Welcome to Nuur Fashion, ${data.name}!</h1>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Thank you for joining us. We're excited to have you as part of our community.
                        </p>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Explore our latest collections and discover styles that elevate your wardrobe.
                        </p>
                        
                        <a href="${frontendUrl}/shop" 
                           style="display: inline-block; background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
                            Start Shopping
                        </a>
                        
                        <p style="color: #999; font-size: 12px; margin-top: 40px;">
                            Nuur Fashion - Elevate your style
                        </p>
                    </div>
                `,
            });

            if (error) {
                console.error("Failed to send welcome email:", error);
                throw new Error(`Failed to send email: ${error.message}`);
            }

            return result;
        },

        /**
         * Send email verification email
         */
        async sendVerificationEmail(data: VerificationEmailData) {
            const { data: result, error } = await resend.emails.send({
                from,
                to: [data.email],
                subject: "Verify Your Email Address",
                html: `
                    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #1a1a1a; font-size: 24px;">Verify Your Email Address</h1>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Hi ${data.name}, please verify your email address by clicking the button below.
                        </p>
                        
                        <a href="${data.verificationUrl}" 
                           style="display: inline-block; background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
                            Verify Email
                        </a>
                        
                        <p style="color: #666; font-size: 14px;">
                            If you didn't create an account, you can safely ignore this email.
                        </p>
                        
                        <p style="color: #999; font-size: 12px; margin-top: 40px;">
                            Nuur Fashion - Elevate your style
                        </p>
                    </div>
                `,
            });

            if (error) {
                console.error("Failed to send verification email:", error);
                throw new Error(`Failed to send email: ${error.message}`);
            }

            return result;
        },

        /**
         * Send password reset email
         */
        async sendPasswordResetEmail(data: UserEmailData & { resetUrl: string }) {
            const { data: result, error } = await resend.emails.send({
                from,
                to: [data.email],
                subject: "Reset Your Password",
                html: `
                    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #1a1a1a; font-size: 24px;">Reset Your Password</h1>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Hi ${data.name}, we received a request to reset your password. Click the button below to set a new password.
                        </p>
                        
                        <a href="${data.resetUrl}" 
                           style="display: inline-block; background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
                            Reset Password
                        </a>
                        
                        <p style="color: #666; font-size: 14px;">
                            If you didn't request this, you can safely ignore this email.
                        </p>
                        
                        <p style="color: #999; font-size: 12px; margin-top: 40px;">
                            This link will expire in 1 hour.
                        </p>
                    </div>
                `,
            });

            if (error) {
                console.error("Failed to send password reset email:", error);
                throw new Error(`Failed to send email: ${error.message}`);
            }

            return result;
        },
    };
};

export type EmailService = ReturnType<typeof createEmailService>;
