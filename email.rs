/**
 * Email Utilities
 * Handles email sending via SMTP and logging
 * Now uses campus_id for campus-specific operations
 */

use log::{error, info, warn};
use sqlx::{MySql, Pool};
use std::env;
use lettre::{
    message::{header::ContentType, Message},
    transport::smtp::authentication::Credentials,
    AsyncSmtpTransport, AsyncTransport, Tokio1Executor,
};

/// Email Payload
#[derive(Debug, Clone)]
pub struct EmailPayload {
    pub to: String,
    pub subject: String,
    pub text: Option<String>,
    pub body: Option<String>,
    pub attachments: Option<Vec<String>>,
    /// Campus ID for campus-specific operations (points, notification settings)
    pub campus_id: Option<String>,
    /// School ID for logging purposes
    pub school_id: Option<String>,
}

/// Process Email Payload
#[derive(Debug, Clone)]
pub struct ProcessEmailPayload {
    pub recipients: Vec<String>,
    pub subject: String,
    pub message: String,
    /// Campus ID for campus-specific operations (points, notification settings)
    pub campus_id: String,
    /// School ID for logging purposes
    pub school_id: String,
    /// Allow critical messages (OTP, password reset) to bypass notification settings
    pub bypass_notification_settings: bool,
}

impl ProcessEmailPayload {
    /// Create a new email payload with campus_id
    pub fn new(recipients: Vec<String>, subject: String, message: String, campus_id: String, school_id: String) -> Self {
        Self {
            recipients,
            subject,
            message,
            campus_id,
            school_id,
            bypass_notification_settings: false,
        }
    }

    /// Set bypass notification settings for critical messages
    pub fn bypass_notifications(mut self) -> Self {
        self.bypass_notification_settings = true;
        self
    }
}

/// Campus entity for database queries
#[derive(Debug, Clone)]
struct CampusInfo {
    campus_id: String,
    school_id: String,
    points: f64,
    email_notifications_enabled: bool,
}

/// Get campus info from database (now includes school points and notification settings)
/// Note: points are now stored at the school level, not campus level
async fn get_campus_info(
    campus_id: &str,
    db: &Pool<MySql>,
) -> Option<CampusInfo> {
    // Get campus-specific settings from campuses table
    let campus_result: Option<(String, String, i8)> = sqlx::query_as(
        r#"
        SELECT campus_id, school_id, email_notifications_enabled 
        FROM campuses 
        WHERE campus_id = ?
        LIMIT 1
        "#
    )
    .bind(campus_id)
    .fetch_optional(db)
    .await
    .unwrap_or(None);

    let (campus_id, school_id, email_enabled) = campus_result?;
    
    // Get points from schools table (migrated from campuses)
    let school_points: Option<f64> = sqlx::query_scalar(
        "SELECT points FROM schools WHERE school_id = ? AND (deleted_at IS NULL OR deleted_at = '0000-00-00 00:00:00')"
    )
    .bind(&school_id)
    .fetch_optional(db)
    .await
    .unwrap_or(None);

    Some(CampusInfo {
        campus_id,
        school_id,
        points: school_points.unwrap_or(0.0),
        email_notifications_enabled: email_enabled == 1,
    })
}

/// Get notification point deduction rate from environment
fn get_point_deduction_rate() -> f64 {
    env::var("NOTIFICATION_POINT_DEDUCTION_RATE")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(0.05)
}

/// Get logo URL for emails
fn get_logo_url() -> String {
    // Use environment variable if set, otherwise default to the public logo endpoint
    match env::var("EMAIL_LOGO_URL") {
        Ok(url) => url,
        Err(_) => {
            // Get the server host from environment or default
            let host = env::var("SERVER_HOST")
                .unwrap_or_else(|_| "http://localhost".to_string());
            let port = env::var("SERVER_PORT")
                .unwrap_or_else(|_| "8181".to_string());
            format!("{}:{}/logo", host, port)
        }
    }
}

/// Get frontend URL for emails
fn get_frontend_url() -> String {
    env::var("FRONTEND_URL")
        .unwrap_or_else(|_| "https://edspike.com".to_string())
}

/// Render message HTML - converts plain text to safe HTML
fn render_message_html(text: &str) -> String {
    if text.is_empty() {
        return String::new();
    }

    // Check if text already contains HTML tags - if so, return as-is
    if text.contains("<html") || text.contains("<body") || text.contains("<div") || 
       text.contains("<p>") || text.contains("<h1>") || text.contains("<h2>") ||
       text.contains("<ul>") || text.contains("<li>") || text.contains("<strong>") {
        return text.to_string();
    }

    // Escape HTML first (for plain text only)
    let mut escaped = text
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&#39;");

    // Convert inline code `code`
    escaped = escaped.replace("`([^`]+)`", "<code>$1</code>");

    // Convert bold **text** (simplified)
    escaped = escaped.replace("**", "<strong>");
    
    // If bolded section is all digits (likely an OTP), add .otp class
    escaped = escaped.replace("<strong>(\\d{3,})</strong>", "<strong class=\"otp\">$1</strong>");

    // Replace newlines with <br>
    escaped = escaped.replace('\n', "<br>");

    escaped
}

/// Generate HTML email body
fn generate_html_body(subject: &str, body_text: &str, _school_id: Option<&str>) -> String {
    let formatted_text = render_message_html(body_text);
    let logo_url = get_logo_url();
    let frontend_url = get_frontend_url();

    format!(
        r#"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{}</title>
  <style>
    * {{
      margin: 0;
      padding: 0;
      color: #ffffff;
      line-height: 1.6;
    }}
    .email-wrapper {{
      max-width: 650px;
      margin: 0 auto;
      background: linear-gradient(135deg, #111 0%, #1e1e1e 50%, #2a2a2a 100%);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      border: 1px solid #333;
    }}
    .header {{
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      padding: 40px 30px;
      text-align: center;
      border-bottom: 2px solid #d4af37;
    }}
    .header img {{
      max-width: 200px;
      width: 100%;
      height: auto;
      display: block;
      margin: 0 auto;
      border: none;
    }}
    .content {{
      padding: 40px 30px;
      background: #1a1a1a;
    }}
    .content h1 {{
      color: #d4af37;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 24px;
      text-align: center;
    }}
    .content .message-text {{
      background: #262626;
      padding: 24px;
      border-radius: 12px;
      border-left: 4px solid #d4af37;
      margin: 24px 0;
    }}
    .otp {{
      display: inline-block;
      background: #111;
      padding: 8px 12px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 20px;
      color: #ffffff;
      letter-spacing: 2px;
      margin-left: 6px;
    }}
    .signature {{
      color: #d4af37;
      font-weight: 600;
      font-style: italic;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #333;
    }}
    .cta-section {{
      text-align: center;
      margin: 35px 0;
    }}
    .cta-button {{
      display: inline-block;
      background: linear-gradient(135deg, #d4af37 0%, #f0d050 100%);
      color: #000 !important;
      padding: 16px 32px;
      border-radius: 50px;
      font-weight: 700;
      text-transform: uppercase;
      text-decoration: none;
    }}
    .footer {{
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      padding: 40px 30px;
      text-align: center;
      color: #fff;
    }}
    .social-icons {{
      display: flex;
      justify-content: center;
      gap: 15px;
      margin: 30px 0 20px 0;
      flex-wrap: wrap;
    }}
    .social-icon {{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
      color: #fff !important;
      border-radius: 50%;
      border: 1px solid #333;
      font-size: 18px;
      text-decoration: none;
    }}
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <img src="{}" alt="EDSPiKE Logo" />
    </div>

    <div class="content">
      <h1>{}</h1>
      <div class="message-text">{}</div>
      <p>We appreciate your attention and look forward to serving you better. Feel free to reach out if you have any questions or need assistance.</p>
      <div class="signature">
        Best regards,<br>
        <strong>The EDSPiKE Team</strong>
      </div>
      <div class="cta-section">
        <a href="{}" class="cta-button">Visit Our Website</a>
      </div>
    </div>

    <div class="footer">
      <div class="social-icons">
        <a href="mailto:edspikeonline@gmail.com" class="social-icon">📧</a>
        <a href="tel:+233537144161" class="social-icon">📞</a>
        <a href="https://wa.me/+233537144161" class="social-icon">💬</a>
        <a href="https://www.youtube.com/@Ed_Spike" class="social-icon">📺</a>
        <a href="https://www.tiktok.com/@edspike_" class="social-icon">🎵</a>
        <a href="https://x.com/edspike_" class="social-icon">🐦</a>
        <a href="https://www.instagram.com/edspike_" class="social-icon">📸</a>
        <a href="https://web.facebook.com/people/EDSPiKE/61564652410892/" class="social-icon">👥</a>
      </div>
      <p><strong>&copy; 2025 EDSPiKE - All Rights Reserved</strong></p>
      <p><small>1 Airport Square Building, Airport Area, Accra, Ghana</small></p>
      <p><small>Email: <a href="mailto:info@edspike.com">info@edspike.com</a> | Phone: +233 537 144 161</small></p>
      <p><small><a href="{}" target="_blank">{}</a></small></p>
    </div>
  </div>
</body>
</html>"#,
        subject, logo_url, subject, formatted_text, frontend_url, frontend_url, frontend_url
    )
}

/// Log email to smsuse table
async fn log_email(
    db: &Pool<MySql>,
    message: &str,
    recipients: &str,
    recipient_count: i64,
    word_count: i64,
    school_id: &str,
    campus_id: &str,
    points_deducted: f64,
    status: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    sqlx::query(
        r#"
        INSERT INTO smsuse (
            uuid, message, phone_numbers, number_counts, number_of_words,
            school_id, campus_id, points_deducted, status, created_at, updated_at
        ) VALUES (
            UUID(), ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()
        )
        "#
    )
    .bind(message)
    .bind(recipients)
    .bind(recipient_count)
    .bind(word_count.to_string())
    .bind(school_id)
    .bind(campus_id)
    .bind(points_deducted)
    .bind(status)
    .execute(db)
    .await?;

    Ok(())
}

/// Update school points (migrated from campus level to school level)
async fn update_school_points(
    db: &Pool<MySql>,
    school_id: &str,
    new_points: f64,
) -> Result<(), Box<dyn std::error::Error>> {
    let result = sqlx::query(
        r#"UPDATE schools SET points = ?, updated_at = NOW() WHERE school_id = ? AND (deleted_at IS NULL OR deleted_at = '0000-00-00 00:00:00')"#
    )
    .bind(new_points)
    .bind(school_id)
    .execute(db)
    .await?;

    if result.rows_affected() == 0 {
        return Err("points deduction failed: no rows updated".into());
    }

    Ok(())
}

/// Send email via SMTP using lettre
async fn send_email_smtp(
    payload: &EmailPayload,
) -> Result<(), Box<dyn std::error::Error>> {
    // Use body field directly if it contains HTML, otherwise generate HTML from text
    let html_body = if let Some(body) = &payload.body {
        if body.contains("<html") || body.contains("<body") || body.contains("<") {
            // Body already contains HTML, use it directly
            body.clone()
        } else {
            // Wrap plain text in HTML template
            generate_html_body(&payload.subject, body, payload.school_id.as_deref())
        }
    } else {
        // Generate HTML from text field
        generate_html_body(
            &payload.subject,
            payload.text.as_deref().unwrap_or(""),
            payload.school_id.as_deref(),
        )
    };

    // Check if EDSPiKE SMTP is enabled
    let use_edspike_smtp = env::var("SMTP_USE_EDSPIKE")
        .map(|v| v == "1" || v == "true")
        .unwrap_or(false);

    // Get SMTP config from environment
    let smtp_host = if use_edspike_smtp {
        env::var("SMTP_HOST").unwrap_or_else(|_| "smtp.gmail.com".to_string())
    } else {
        env::var("SMTP_HOST").unwrap_or_else(|_| "smtp.gmail.com".to_string())
    };
    
    let smtp_port = if use_edspike_smtp {
        env::var("SMTP_PORT")
            .ok()
            .and_then(|s| s.parse().ok())
            .unwrap_or(465) // Gmail SSL port
    } else {
        env::var("SMTP_PORT")
            .ok()
            .and_then(|s| s.parse().ok())
            .unwrap_or(587)
    };

    // Use SMTP_MAIL/SMTP_PASSWORD when SMTP_USE_EDSPIKE=1, otherwise fallback to SMTP_USER/SMTP_PASS
    let (smtp_user, smtp_pass, smtp_from) = if use_edspike_smtp {
        let user = env::var("SMTP_MAIL")
            .unwrap_or_else(|_| "edspikeonline@gmail.com".to_string());
        let pass = env::var("SMTP_PASSWORD")
            .unwrap_or_else(|_| "".to_string());
        let from = env::var("SMTP_MAIL")
            .unwrap_or_else(|_| "edspikeonline@gmail.com".to_string());
        (user, pass, format!("EDSPiKE <{}>", from))
    } else {
        let user = env::var("SMTP_USER")
            .unwrap_or_else(|_| "edspikeonline@gmail.com".to_string());
        let pass = env::var("SMTP_PASS")
            .unwrap_or_else(|_| "".to_string());
        let from = env::var("SMTP_FROM")
            .unwrap_or_else(|_| "EDSPiKE <edspikeonline@gmail.com>".to_string());
        (user, pass, from)
    };

    if smtp_pass.is_empty() {
        warn!("SMTP_PASSWORD/SMTP_PASS not set - email will be logged but not sent!");
        info!(
            "[EMAIL LOGGED - NOT SENT] To: {} | Subject: {} | Body: {}",
            payload.to, payload.subject, html_body
        );
        return Ok(());
    }

    // Build email message
    let email = Message::builder()
        .from(smtp_from.parse()?)
        .to(payload.to.parse()?)
        .subject(&payload.subject)
        .header(ContentType::TEXT_HTML)
        .body(html_body)?;

    // Create SMTP transport
    let creds = Credentials::new(smtp_user, smtp_pass);
    
    // Use relay method (handles both STARTTLS and SSL/TLS automatically)
    let mailer: AsyncSmtpTransport<Tokio1Executor> = 
        AsyncSmtpTransport::<Tokio1Executor>::relay(&smtp_host)?
            .port(smtp_port)
            .credentials(creds)
            .build();

    // Send email
    match mailer.send(email).await {
        Ok(_) => {
            info!("Email sent successfully to: {} via {}:{}", payload.to, smtp_host, smtp_port);
            Ok(())
        }
        Err(e) => {
            error!("Failed to send email to {}: {}", payload.to, e);
            Err(Box::new(std::io::Error::other(
                format!("SMTP error: {}", e)
            )))
        }
    }
}

/// Process email - Main function
/// Handles sending email and deducting points from campus (0.05 per recipient)
pub async fn process_email(
    payload: ProcessEmailPayload,
    db: &Pool<MySql>,
) -> Result<(), Box<dyn std::error::Error>> {
    let recipient_count = payload.recipients.len();
    let recipients_list = payload.recipients.join(",");
    let word_count = payload.message.split_whitespace().count() as i64;
    let point_deduction_rate = get_point_deduction_rate();

    // Get campus info (now includes points and notification settings)
    let campus = match get_campus_info(&payload.campus_id, db).await {
        Some(c) => c,
        None => {
            return Err(format!("campus lookup failed: campus not found for {}", payload.campus_id).into());
        }
    };

    let mut email_status = "sent";
    let mut success_count = 0;
    let mut fail_count = 0;

    // Check if email notifications are enabled for this campus
    // Critical messages (OTP, password reset) bypass this check
    if !payload.bypass_notification_settings && !campus.email_notifications_enabled {
        // Email is turned off for this campus - don't send but still deduct points per recipient
        email_status = "off";
        
        warn!(
            "Email notifications are DISABLED for campus: {}. Deducting {:.2} points per recipient ({} recipients)",
            campus.campus_id, point_deduction_rate, recipient_count
        );
    } else {
        // Send emails to all recipients
        // Either enabled OR bypassed for critical messages
        for recipient in &payload.recipients {
            let email_payload = EmailPayload {
                to: recipient.clone(),
                subject: payload.subject.clone(),
                text: Some(payload.message.clone()),
                body: Some(payload.message.clone()),
                attachments: None,
                campus_id: Some(payload.campus_id.clone()),
                school_id: Some(payload.school_id.clone()),
            };

            match send_email_smtp(&email_payload).await {
                Ok(_) => {
                    success_count += 1;
                }
                Err(e) => {
                    error!("Failed to send email to {}: {}", recipient, e);
                    fail_count += 1;
                }
            }
        }

        // Determine overall status based on results
        if success_count == 0 && fail_count > 0 {
            email_status = "failed";
        } else if fail_count > 0 && success_count > 0 {
            email_status = "partial";
        }
        // else email_status remains 'sent' (all succeeded)

        info!(
            "Email sending completed for campus {}: {} success, {} failed",
            campus.campus_id, success_count, fail_count
        );
    }

    // Always deduct points (whether sent, failed, or turned off)
    // Points: 0.05 per recipient
    let points_deducted = recipient_count as f64 * point_deduction_rate;
    let new_points = campus.points - points_deducted;
    
    // Update school points (migrated from campus to school level)
    if let Err(e) = update_school_points(db, &campus.school_id, new_points).await {
        error!("Failed to update school points: {}", e);
        return Err(e);
    }

    info!(
        "Points deducted for school {}: {:.2} (new balance: {:.2})",
        campus.school_id, points_deducted, new_points
    );
    
    // Broadcast points update via WebSocket using campus_id
    crate::websocket::broadcast_campus_points_update(&campus.campus_id, new_points).await;
    
    // Broadcast detailed points deducted message
    let reason = match email_status {
        "off" => "Email disabled",
        "failed" => "Email failed to send",
        "partial" => "Email partially sent",
        _ => "Email sent",
    };
    crate::websocket::broadcast_campus_points_deducted(
        &campus.campus_id,
        &campus.school_id,
        campus.points,
        new_points,
        points_deducted,
        reason,
    ).await;

    // Create email record with descriptive message for user understanding
    let record_message = match email_status {
        "off" => {
            format!(
                "[EMAIL DISABLED - {:.2} points deducted per recipient] {}",
                point_deduction_rate, payload.message
            )
        }
        "failed" => {
            format!(
                "[EMAIL FAILED - {:.2} points deducted per recipient] {}",
                point_deduction_rate, payload.message
            )
        }
        "partial" => {
            format!(
                "[EMAIL PARTIAL - {} success, {} failed - {:.2} points deducted for {} recipient(s)] {}",
                success_count, fail_count, points_deducted, recipient_count, payload.message
            )
        }
        _ => {
            format!(
                "[EMAIL SENT - {:.2} points deducted for {} recipient(s)] {}",
                points_deducted, recipient_count, payload.message
            )
        }
    };

    if let Err(e) = log_email(
        db,
        &record_message,
        &recipients_list,
        recipient_count as i64,
        word_count,
        &payload.school_id,
        &payload.campus_id,
        points_deducted,
        email_status,
    ).await {
        error!("Failed to log email: {}", e);
        return Err(e);
    }

    // Don't throw error if email is turned off or partial - that's expected behavior
    // Only throw if ALL emails failed when enabled
    if email_status == "failed" {
        return Err("email sending failed - all recipients failed".into());
    }

    Ok(())
}

/// Send email wrapper (legacy function for compatibility)
pub async fn send_email(
    payload: EmailPayload,
    db: &Pool<MySql>,
) -> Result<String, Box<dyn std::error::Error>> {
    let recipients = vec![payload.to];
    let campus_id = payload.campus_id.unwrap_or_default();
    let school_id = payload.school_id.unwrap_or_else(|| campus_id.clone());
    
    let process_payload = ProcessEmailPayload {
        recipients,
        subject: payload.subject,
        message: payload.text.unwrap_or_default(),
        campus_id,
        school_id,
        bypass_notification_settings: false,
    };
    
    match process_email(process_payload, db).await {
        Ok(_) => Ok("Email processed successfully".to_string()),
        Err(e) => Err(e),
    }
}

/// Send email - NON-BLOCKING
/// Spawns a background task and returns immediately
/// Use this when you don't need to wait for email delivery confirmation
pub fn send_email_async(payload: EmailPayload, db: Pool<MySql>) {
    info!("Spawning async email task to: {}", payload.to);
    
    tokio::spawn(async move {
        let recipients = vec![payload.to];
        let campus_id = payload.campus_id.unwrap_or_default();
        let school_id = payload.school_id.unwrap_or_else(|| campus_id.clone());
        
        let process_payload = ProcessEmailPayload {
            recipients,
            subject: payload.subject,
            message: payload.text.unwrap_or_default(),
            campus_id,
            school_id,
            bypass_notification_settings: false,
        };
        
        match process_email(process_payload, &db).await {
            Ok(_) => info!("Async email processed successfully"),
            Err(e) => error!("Async email failed: {}", e),
        }
    });
}

/// Process bulk emails - NON-BLOCKING
/// Spawns a background task and returns immediately
/// Use this for school-wide email broadcasts
pub fn send_bulk_email_async(payload: ProcessEmailPayload, db: Pool<MySql>) {
    info!("Spawning async bulk email for {} recipients", payload.recipients.len());
    
    tokio::spawn(async move {
        match process_email(payload, &db).await {
            Ok(_) => info!("Async bulk email processed successfully"),
            Err(e) => error!("Async bulk email failed: {}", e),
        }
    });
}

/// Process bulk emails - BLOCKING version (legacy)
/// Only use for small batches. For large broadcasts, use send_bulk_email_async
pub async fn process_bulk_email(
    payload: ProcessEmailPayload,
    db: &Pool<MySql>,
) -> Result<String, Box<dyn std::error::Error>> {
    match process_email(payload, db).await {
        Ok(_) => Ok("Bulk emails processed successfully".to_string()),
        Err(e) => Err(e),
    }
}
