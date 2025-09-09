# Email service for sending contact form notifications

import os
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        # Gmail SMTP configuration
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.sender_email = os.getenv("SMTP_EMAIL")
        self.sender_password = os.getenv("SMTP_PASSWORD")
        self.recipient_email = os.getenv("CONTACT_EMAIL", "shahdevang1910@gmail.com")
        
    async def send_contact_notification(self, contact_data):
        """Send email notification when someone submits contact form"""
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = f"New Portfolio Contact: {contact_data['subject']}"
            message["From"] = self.sender_email
            message["To"] = self.recipient_email
            
            # Create HTML content
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #7C3AED;">New Contact Form Submission</h2>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
                            <p><strong>Name:</strong> {contact_data['name']}</p>
                            <p><strong>Email:</strong> {contact_data['email']}</p>
                            <p><strong>Subject:</strong> {contact_data['subject']}</p>
                        </div>
                        
                        <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                            <h3 style="margin-top: 0; color: #333;">Message</h3>
                            <p style="line-height: 1.6; white-space: pre-wrap;">{contact_data['message']}</p>
                        </div>
                        
                        <div style="margin-top: 20px; padding: 15px; background: #f0f4ff; border-radius: 8px;">
                            <p style="margin: 0; font-size: 14px; color: #666;">
                                <strong>Submitted:</strong> {datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")}<br>
                                <strong>Reply to:</strong> <a href="mailto:{contact_data['email']}">{contact_data['email']}</a>
                            </p>
                        </div>
                        
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #999;">
                            This email was sent from your portfolio contact form.
                        </p>
                    </div>
                </body>
            </html>
            """
            
            # Create text version
            text_content = f"""
New Portfolio Contact Form Submission

Name: {contact_data['name']}
Email: {contact_data['email']}
Subject: {contact_data['subject']}

Message:
{contact_data['message']}

Submitted: {datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")}
Reply to: {contact_data['email']}
            """
            
            # Attach parts
            text_part = MIMEText(text_content, "plain")
            html_part = MIMEText(html_content, "html")
            
            message.attach(text_part)
            message.attach(html_part)
            
            # Send email using aiosmtplib
            if self.sender_email and self.sender_password:
                await aiosmtplib.send(
                    message,
                    hostname=self.smtp_server,
                    port=self.smtp_port,
                    start_tls=True,
                    username=self.sender_email,
                    password=self.sender_password,
                )
                logger.info(f"Contact notification sent successfully to {self.recipient_email}")
                return True
            else:
                logger.warning("SMTP credentials not configured - email not sent")
                # For now, we'll log the message instead of failing
                logger.info(f"Contact form submission (would email to {self.recipient_email}): {contact_data}")
                return True  # Return True so the form submission still works
                
        except Exception as e:
            logger.error(f"Failed to send contact notification: {str(e)}")
            return False
    
    async def send_auto_reply(self, contact_data):
        """Send auto-reply to person who submitted the form"""
        try:
            if not self.sender_email or not self.sender_password:
                return True  # Skip auto-reply if SMTP not configured
                
            message = MIMEMultipart("alternative")
            message["Subject"] = f"Thank you for contacting me - {contact_data['name']}"
            message["From"] = self.sender_email  
            message["To"] = contact_data['email']
            
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #7C3AED;">Thank you for reaching out!</h2>
                        
                        <p>Hi {contact_data['name']},</p>
                        
                        <p>Thank you for your message regarding "<strong>{contact_data['subject']}</strong>". I've received your contact form submission and will get back to you within 24 hours.</p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Your Message Summary</h3>
                            <p><strong>Subject:</strong> {contact_data['subject']}</p>
                            <p><strong>Message:</strong></p>
                            <p style="font-style: italic; color: #666;">{contact_data['message'][:200]}{'...' if len(contact_data['message']) > 200 else ''}</p>
                        </div>
                        
                        <p>In the meantime, feel free to:</p>
                        <ul>
                            <li>Check out my <a href="https://github.com">GitHub</a> for more projects</li>
                            <li>Connect with me on <a href="https://linkedin.com/in/devang-shah">LinkedIn</a></li>
                            <li>Email me directly at <a href="mailto:shahdevang1910@gmail.com">shahdevang1910@gmail.com</a></li>
                        </ul>
                        
                        <p>Best regards,<br><strong>Devang Shah</strong></p>
                        
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #999;">
                            This is an automated response from my portfolio website.
                        </p>
                    </div>
                </body>
            </html>
            """
            
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)
            
            await aiosmtplib.send(
                message,
                hostname=self.smtp_server,
                port=self.smtp_port,
                start_tls=True,
                username=self.sender_email,
                password=self.sender_password,
            )
            
            logger.info(f"Auto-reply sent to {contact_data['email']}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send auto-reply: {str(e)}")
            return False

# Create global instance
email_service = EmailService()