"""
Utility functions for authentication, audit logging, and email.
"""
from datetime import datetime, timezone, timedelta
from typing import Dict, Optional, List, Any
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import resend
import logging

from compassai.backend.config import db, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, RESEND_API_KEY, SENDER_EMAIL
from compassai.backend.models import AuditAction, AuditLog, UserRole
from compassai.backend.security import (
    get_password_hash as bcrypt_get_password_hash,
    verify_password as bcrypt_verify_password,
)

# Configure logging
logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)

# Initialize Resend
resend.api_key = RESEND_API_KEY


# ==================== AUTH HELPERS ====================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt_verify_password(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return bcrypt_get_password_hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[Dict]:
    """Get current user from token, returns None if not authenticated."""
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            return None
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "hashed_password": 0})
        return user
    except JWTError:
        return None


async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """Require authentication. Raises 401 if not authenticated."""
    user = await get_current_user(credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


async def require_role(required_roles: List[UserRole], credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """Require specific role(s). Raises 403 if not authorized."""
    user = await require_auth(credentials)
    if user.get('role') not in [r.value for r in required_roles]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return user


def require_admin():
    async def _require_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
        return await require_role([UserRole.ADMIN], credentials)
    return _require_admin


def require_assessor_or_admin():
    async def _require(credentials: HTTPAuthorizationCredentials = Depends(security)):
        return await require_role([UserRole.ADMIN, UserRole.ASSESSOR], credentials)
    return _require


# ==================== AUDIT LOGGING ====================
async def log_audit(
    action: AuditAction,
    resource_type: str,
    resource_id: str = None,
    resource_name: str = None,
    details: Dict[str, Any] = None,
    user: Dict = None,
    ip_address: str = None
):
    """Log an audit event to the database."""
    audit_entry = AuditLog(
        user_id=user.get('id') if user else None,
        user_email=user.get('email') if user else None,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        resource_name=resource_name,
        details=details,
        ip_address=ip_address
    )
    await db.audit_logs.insert_one(audit_entry.model_dump())
    return audit_entry


# ==================== EMAIL NOTIFICATIONS ====================
async def send_evidence_notification(
    recipient_email: str,
    client_name: str,
    system_name: str,
    control_id: str,
    filename: str,
    uploaded_by: str
):
    """Send email notification when evidence is uploaded."""
    if not RESEND_API_KEY:
        logger.warning("Resend API key not configured, skipping email notification")
        return
    
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [recipient_email],
            "subject": f"[Compass AI] New Evidence Uploaded - {control_id}",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #3B82F6, #10B981); padding: 20px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Compass AI Governance</h1>
                </div>
                <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #1e293b; margin-top: 0;">New Evidence Uploaded</h2>
                    <p style="color: #64748b;">A new evidence file has been uploaded to an assessment.</p>
                    
                    <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Client</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">{client_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">AI System</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">{system_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Control</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #3B82F6;">{control_id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">File</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">{filename}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; color: #64748b;">Uploaded By</td>
                            <td style="padding: 10px;">{uploaded_by}</td>
                        </tr>
                    </table>
                    
                    <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
                        This is an automated notification from Compass AI Governance Engine.
                    </p>
                </div>
            </div>
            """
        }
        resend.Emails.send(params)
        logger.info(f"Evidence notification sent to {recipient_email}")
    except Exception as e:
        logger.error(f"Failed to send email notification: {e}")


async def send_onboarding_notification(
    recipient_email: str,
    company_name: str,
    contact_name: str,
    submission_id: str
):
    """Send notification when new onboarding is submitted."""
    if not RESEND_API_KEY:
        logger.warning("Resend API key not configured, skipping email notification")
        return
    
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [recipient_email],
            "subject": f"[Compass AI] New Onboarding Submission - {company_name}",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #3B82F6, #10B981); padding: 20px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Compass AI Governance</h1>
                </div>
                <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #1e293b; margin-top: 0;">New Onboarding Submission</h2>
                    <p style="color: #64748b;">A new client onboarding form has been submitted.</p>
                    
                    <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Company</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">{company_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Contact</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">{contact_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; color: #64748b;">Submission ID</td>
                            <td style="padding: 10px; font-family: monospace;">{submission_id}</td>
                        </tr>
                    </table>
                    
                    <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
                        Please review this submission in the admin panel.
                    </p>
                </div>
            </div>
            """
        }
        resend.Emails.send(params)
        logger.info(f"Onboarding notification sent to {recipient_email}")
    except Exception as e:
        logger.error(f"Failed to send onboarding notification: {e}")


async def send_scheduled_assessment_notification(
    recipient_emails: List[str],
    client_name: str,
    system_name: str,
    assessment_id: str
):
    """Send notification when a scheduled assessment is run."""
    if not RESEND_API_KEY:
        logger.warning("Resend API key not configured, skipping email notification")
        return
    
    for email in recipient_emails:
        try:
            params = {
                "from": SENDER_EMAIL,
                "to": [email],
                "subject": f"[Compass AI] Scheduled Assessment Completed - {system_name}",
                "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #3B82F6, #10B981); padding: 20px; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Compass AI Governance</h1>
                    </div>
                    <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
                        <h2 style="color: #1e293b; margin-top: 0;">Scheduled Assessment Completed</h2>
                        <p style="color: #64748b;">A scheduled governance assessment has been completed.</p>
                        
                        <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Client</td>
                                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">{client_name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">AI System</td>
                                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">{system_name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; color: #64748b;">Assessment ID</td>
                                <td style="padding: 10px; font-family: monospace;">{assessment_id}</td>
                            </tr>
                        </table>
                        
                        <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
                            View the full assessment results in your Compass AI dashboard.
                        </p>
                    </div>
                </div>
                """
            }
            resend.Emails.send(params)
            logger.info(f"Scheduled assessment notification sent to {email}")
        except Exception as e:
            logger.error(f"Failed to send scheduled assessment notification to {email}: {e}")
