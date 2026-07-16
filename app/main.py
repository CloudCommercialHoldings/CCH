from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
import os
from typing import Optional

app = FastAPI()

# Setup logging
logging.basicConfig(level=logging.INFO)

# Serving static assets and fallback static files from Jekyll's build directory _site
if os.path.exists("_site/assets"):
    app.mount("/assets", StaticFiles(directory="_site/assets"), name="assets")
    
# Also mount /static pointing to assets to prevent any broken links on legacy or cached browsers
if os.path.exists("_site/assets"):
    app.mount("/static", StaticFiles(directory="_site/assets"), name="static")

def serve_static_page(path: str):
    """
    Helper to search and return clean Jekyll generated HTML files from the _site/ directory.
    Checks directory indexes first, then appends .html extension.
    """
    _site_dir = "_site"
    clean_path = path.strip("/")
    
    # Try direct path
    target = os.path.join(_site_dir, clean_path)
    
    if os.path.isdir(target):
         index_path = os.path.join(target, "index.html")
         if os.path.exists(index_path):
             return FileResponse(index_path)
             
    # Try index/default inside target folder
    if target.endswith("/") or not clean_path:
        index_path = os.path.join(_site_dir, clean_path, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
            
    # Try appending .html
    html_target = f"{target}.html"
    if os.path.exists(html_target):
        return FileResponse(html_target)
        
    # Finally, if the file exists directly, return it
    if os.path.exists(target) and os.path.isfile(target):
        return FileResponse(target)
        
    # Fallback to Jekyll 404 page if configured
    four_oh_four = os.path.join(_site_dir, "404.html")
    if os.path.exists(four_oh_four):
        return FileResponse(four_oh_four, status_code=404)
        
    return HTMLResponse("Page not found", status_code=404)

# Route to home page
@app.get("/", response_class=HTMLResponse)
async def read_root():
    return serve_static_page("index.html")

# Serve a favicon to avoid 404s
@app.get("/favicon.ico")
async def favicon():
    # Jekyll builds the icon at _site/assets/cch.jpg
    favicon_path = "_site/assets/cch.jpg"
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path)
    return FileResponse("app/static/cch.jpg")

# Route to all main pages and sub-pages
@app.get("/services", response_class=HTMLResponse)
async def services():
    return serve_static_page("services")

@app.get("/services/{service_slug}", response_class=HTMLResponse)
async def service_page(service_slug: str):
    # Map any legacy or specialized routes to the jekyll sub-page
    slug = service_slug
    if slug.endswith("-updated"):
        slug = slug.replace("-updated", "")
    return serve_static_page(f"services/{slug}")

@app.get("/about", response_class=HTMLResponse)
async def about():
    return serve_static_page("about")

@app.get("/jeff-kessie", response_class=HTMLResponse)
async def jeff_kessie():
    return serve_static_page("jeff-kessie")

@app.get("/contact", response_class=HTMLResponse)
async def contact():
    return serve_static_page("contact")

@app.get("/blog", response_class=HTMLResponse)
async def blog():
    return serve_static_page("blog")

@app.get("/AI", response_class=HTMLResponse)
async def ai_page():
    return serve_static_page("services/ai")

@app.get("/privacy-policy", response_class=HTMLResponse)
async def privacy_policy():
    return serve_static_page("privacy-policy")

# Keep the dynamic SMTP email backend exactly the same (KEEP THE SAME FEATURES)
@app.post("/contact")
async def contact_submit(
    request: Request,
    firstName: str = Form(...),
    lastName: str = Form(...),
    phoneNumber: str = Form(...),
    email: str = Form(...),
    company: str = Form(...),
    countryCode: str = Form("+1"),
    message: Optional[str] = Form("")
):
    try:
        # Create email content
        subject = f"New Contact Form Submission from {firstName} {lastName}"
        
        # HTML email template
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #006b3c; color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
                .content {{ background: #ffeeed; padding: 30px; border-radius: 0 0 8px 8px; }}
                .field {{ margin-bottom: 15px; }}
                .label {{ font-weight: 600; color: #006b3c; }}
                .value {{ margin-top: 5px; }}
                .message-box {{ background: white; padding: 15px; border-radius: 6px; margin-top: 10px; border-left: 4px solid #006b3c; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>New Contact Form Submission</h2>
                    <p>Cloud Commercial Holdings LLC</p>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">Name:</div>
                        <div class="value">{firstName} {lastName}</div>
                    </div>
                    <div class="field">
                        <div class="label">Email:</div>
                        <div class="value">{email}</div>
                    </div>
                    <div class="field">
                        <div class="label">Phone:</div>
                        <div class="value">{countryCode} {phoneNumber}</div>
                    </div>
                    <div class="field">
                        <div class="label">Company:</div>
                        <div class="value">{company}</div>
                    </div>
                    {f'<div class="field"><div class="label">Message:</div><div class="message-box">{message}</div></div>' if message else ''}
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text version
        text_content = f"""
        New Contact Form Submission - Cloud Commercial Holdings LLC
        
        Name: {firstName} {lastName}
        Email: {email}
        Phone: {countryCode} {phoneNumber}
        Company: {company}
        {f'Message: {message}' if message else ''}
        
        ---
        This message was sent via the Cloud Commercial Holdings LLC contact form.
        """
        
        # Send email
        await send_email(
            to_email="info@cloudcommercial.com",
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )
        
        return JSONResponse(
            status_code=200,
            content={"message": "Thank you for your message! We'll get back to you within 24 hours."}
        )
        
    except Exception as e:
        logging.error(f"Error sending contact form email: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to send message. Please try again or contact us directly."}
        )

async def send_email(to_email: str, subject: str, html_content: str, text_content: str):
    """
    Send email using SMTP.
    """
    # Email configuration - these should be environment variables in production
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    from_email = os.getenv("FROM_EMAIL", "noreply@cloudcommercial.com")
    
    # Create message
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = from_email
    message["To"] = to_email
    
    # Attach both plain text and HTML versions
    text_part = MIMEText(text_content, "plain")
    html_part = MIMEText(html_content, "html")
    
    message.attach(text_part)
    message.attach(html_part)
    
    # Send email
    if smtp_username and smtp_password:
        # Use SMTP with authentication
        await aiosmtplib.send(
            message,
            hostname=smtp_server,
            port=smtp_port,
            username=smtp_username,
            password=smtp_password,
            use_tls=True,
        )
    else:
        # For development: just log the email instead of sending
        logging.info(f"EMAIL WOULD BE SENT TO: {to_email}")
        logging.info(f"SUBJECT: {subject}")
        logging.info(f"CONTENT: {text_content}")