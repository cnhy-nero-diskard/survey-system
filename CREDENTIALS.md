# Credentials & Environment Management

This document covers managing secrets, credentials, and environment variables for the survey system across development and production environments.

## Security Principles

**Never:**
- Commit `.env` files to Git
- Share credentials unencrypted
- Log passwords or secret keys
- Commit secrets in code or comments
- Reuse credentials across environments

**Always:**
- Use unique passwords for each environment
- Rotate credentials regularly
- Store secrets in secure vaults (1Password, AWS Secrets Manager, etc.)
- Use environment variables for all configuration
- Review `.gitignore` to ensure `.env` is ignored

## Environment Variables Reference

All configuration is managed through environment variables. See `.env.example` for the complete list.

### Required Variables

These **MUST** be set for the application to function:

```env
# Database Configuration
DB_HOST=localhost           # PostgreSQL hostname
DB_USER=postgres           # PostgreSQL username
DB_PASSWORD=your_password  # PostgreSQL password (CHANGE THIS)
DB_NAME=survey_system      # Database name
DB_PORT=5432               # PostgreSQL port

# Server Configuration
NODE_ENV=development       # development|production
PORT=5000                  # Backend server port

# Session Security
SESSION_SECRET=<large-random-string>  # Encrypt session cookies
```

**Generating SESSION_SECRET:**
```bash
# Use this command to generate a secure value
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output to your .env file
SESSION_SECRET=a1b2c3d4e5f6... (64 character hex string)
```

### Optional Variables

These enhance functionality but aren't required:

```env
# Email Service (Optional - for sending emails)
SENDGRID_API_KEY=SG.xxxxx  # SendGrid API key for email
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# AI Features (Optional - for AI-powered features)
HUGGING_FACE_API_KEY=hf_xxxxx  # Hugging Face API key

# Logging (Optional - for enhanced logging)
LOG_LEVEL=info             # error|warn|info|debug
LOG_FORMAT=json            # json|text

# Advanced Database (Optional - for scaling)
DB_POOL_SIZE=10            # Connection pool size
DB_POOL_IDLE_TIMEOUT=10000 # Idle connection timeout (ms)
```

## Setup by Environment

### Development Environment

**File:** `.env` (in `survey-system-unified/` directory)

```env
# Local development database
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=dev_password  # Simple password for local dev
DB_NAME=survey_system
DB_PORT=5432

# Local server settings
NODE_ENV=development
PORT=5000

# Generate fresh secret for development
SESSION_SECRET=<run the generation command above>

# Optional: Disable email for local testing
# SENDGRID_API_KEY=not_configured
```

**Setup Steps:**
1. Copy template: `cp .env.example .env`
2. Edit with local database credentials
3. Run: `npm run dev`
4. Verify at http://localhost:3000

### Production Environment

**Storage:** Use platform-specific secret management (see below)

**Example values for production:**
```env
# Production database (Cloud SQL, RDS, or managed PostgreSQL)
DB_HOST=prod-db.example.com     # Managed DB endpoint
DB_USER=prod_user               # Specific database user
DB_PASSWORD=<SECURE-PASSWORD>   # Very strong password
DB_NAME=survey_system_prod
DB_PORT=5432

# Production server
NODE_ENV=production
PORT=5000  # (Container port; external may differ)

# Generated strong session secret
SESSION_SECRET=<VERY-SECURE-64CHAR-HEX>

# Enabled email for notifications
SENDGRID_API_KEY=SG.actual_key_here
SENDGRID_FROM_EMAIL=noreply@yoursurveydomain.com

# Optional: AI features
HUGGING_FACE_API_KEY=hf_actual_key_here
```

## Platform-Specific Secret Management

### GCP (Google Cloud Platform)

**Using Secret Manager:**

```bash
# Create a secret
gcloud secrets create db-password \
  --data-file=- << EOF
your_production_password_here
EOF

# Create service account and grant access
gcloud iam service-accounts create survey-system
gcloud secrets add-iam-policy-binding db-password \
  --member=serviceAccount:survey-system@project.iam.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# Reference in Cloud Run deployment
gcloud run deploy survey-system \
  --set-env-vars DB_PASSWORD=projects/PROJECT_ID/secrets/db-password/versions/latest
```

**Or using Cloud Build secrets:**

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/gke-deploy'
    args:
      - run
      - --filename=k8s/
    secretEnv: ['DB_PASSWORD']

secrets:
  - kmsKeyName: projects/$PROJECT_ID/locations/global/keyRings/NAME/cryptoKeys/NAME
    secretEnv:
      DB_PASSWORD: CiQA...encrypted...
```

### DigitalOcean

**Using App Spec:**

```yaml
# app.yaml
name: survey-system
services:
- name: api
  env:
  - key: DB_PASSWORD
    scope: RUN_AND_BUILD_TIME
    value: ${DB_PASSWORD}  # Set via CLI

databases:
- name: pg_db
  engine: PG
```

**Deploy with secrets:**

```bash
# Set environment variables when deploying
doctl apps create --spec app.yaml \
  --env DB_PASSWORD="production_password_here" \
  --env SESSION_SECRET="secure_session_secret"
```

### AWS (Elastic Container Service / Fargate)

**Using Secrets Manager:**

```bash
# Create secret in AWS Secrets Manager
aws secretsmanager create-secret \
  --name survey-system/db-password \
  --secret-string "production_password_here"

# Create another for session secret
aws secretsmanager create-secret \
  --name survey-system/session-secret \
  --secret-string "$(openssl rand -hex 32)"
```

**Reference in ECS Task Definition:**

```json
{
  "containerDefinitions": [{
    "name": "survey-system",
    "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/survey-system:latest",
    "secrets": [
      {
        "name": "DB_PASSWORD",
        "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:survey-system/db-password:password::"
      },
      {
        "name": "SESSION_SECRET",
        "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:survey-system/session-secret:password::"
      }
    ]
  }]
}
```

### Self-Hosted / Docker Compose

**Using .env file (not in Git):**

```bash
# Create .env file (DO NOT COMMIT)
cat > survey-system-unified/.env << 'EOF'
DB_HOST=db
DB_USER=postgres
DB_PASSWORD=very_strong_password_here
DB_NAME=survey_system
NODE_ENV=production
PORT=5000
SESSION_SECRET=$(openssl rand -hex 32)
EOF

# Secure the file
chmod 600 survey-system-unified/.env

# Add to .gitignore (it should already be)
grep ".env" .gitignore
```

**Or using Docker secrets (Swarm mode):**

```bash
# Create Docker secrets
echo "production_password" | docker secret create db_password -

# Reference in docker-compose.yml
services:
  app:
    secrets:
      - db_password
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password
```

## Generating Secure Credentials

### Database Passwords

Use a strong password generator:

```bash
# Option 1: OpenSSL (20+ character password)
openssl rand -base64 20

# Option 2: Python
python3 -c "import secrets; print(secrets.token_urlsafe(24))"

# Option 3: Online generator
# https://www.random.org/passwords/
```

**Requirements:**
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, and symbols
- No special characters that conflict with connection strings
- Unique for each environment

### API Keys

**SendGrid:**
1. Go to https://sendgrid.com
2. Log in to your account
3. Navigate to Settings → API Keys
4. Click "Create API Key"
5. Choose "Full Access"
6. Copy the key to your `.env` to `SENDGRID_API_KEY`

**Hugging Face:**
1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Enter a name (e.g., "survey-system-prod")
4. Choose "Read" access level
5. Copy to your `.env` as `HUGGING_FACE_API_KEY`

## Credential Rotation

### Development (Local)
- No need for regular rotation
- Update when you change your local DB password

### Production (Critical)
Rotate credentials quarterly or when:
- Team member leaves
- Unauthorized access suspected
- Compliance requirements
- API key compromised

**Rotation steps:**
1. Generate new credential
2. Add to production environment
3. Update all services using the old credential
4. Verify service stability for 1 hour
5. Disable old credential
6. Remove old credential after 30 days

### Database Password Rotation Example

```bash
# 1. Generate new password
NEW_PASSWORD=$(openssl rand -base64 20)

# 2. Update in database
psql -h prod-db.example.com -U postgres -c \
  "ALTER USER postgres WITH PASSWORD '$NEW_PASSWORD';"

# 3. Update secret manager
# For GCP:
echo -n "$NEW_PASSWORD" | gcloud secrets versions add db-password --data-file=-

# For AWS:
aws secretsmanager update-secret \
  --secret-id survey-system/db-password \
  --secret-string "$NEW_PASSWORD"

# 4. Restart services to pick up new secret
# Then verify logs show successful connections

# 5. After 30 days, revoke old password (if available)
```

## .env.example File

The `.env.example` file serves as a template. Keep it updated with:
- ✅ All required variables
- ✅ All optional variables with descriptions
- ✅ Example values (with explanatory comments)
- ❌ NO actual credentials
- ❌ NO sensitive values

**Template (checked into Git):**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=change_me_in_production
DB_NAME=survey_system
DB_PORT=5432

# Server Configuration
NODE_ENV=development
PORT=5000

# Security - Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=your_64_character_hex_string_here

# Optional: SendGrid for email
# SENDGRID_API_KEY=SG.your_key_here
# SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Optional: Hugging Face for AI features
# HUGGING_FACE_API_KEY=hf_your_key_here
```

## Credential Delivery for New Team

**Secure Handoff Process:**

### Option 1: Password Manager (Recommended)
1. Create shared vault in 1Password, LastPass, or similar
2. Add all credentials with descriptions
3. Share vault link securely (via email, not chat)
4. Team members set up their own credentials account
5. Revoke shared link after setup confirmed

### Option 2: Encrypted File
1. Create `.env` file locally
2. Encrypt with GPG: `gpg --symmetric survey-system.env`
3. Send encrypted file via email or secure channel
4. Team members decrypt: `gpg --decrypt survey-system.env.gpg`

### Option 3: Per-Platform
1. GCP: Grant IAM role to read Secret Manager
2. AWS: Grant IAM role to read Secrets Manager
3. DO: Share app spec with secret placeholders
4. Self-hosted: Provide `.env` file via secure channel

## Checking Your Setup

**Verify environment variables are loaded:**

```bash
# Development
npm run dev

# In another terminal, check server is connected
curl http://localhost:5000/api/health

# Should succeed without database errors

# If errors, check logs
# Look for: "connected to database" or "connection refused" messages
```

**Database connection test:**

```bash
# Verify DATABASE_URL is correct
psql $DATABASE_URL -c "SELECT current_database(), current_user;"

# Should show: survey_system | postgres
```

## Next Steps

1. **Development Setup:**
   - Copy `.env.example` to `.env`
   - Fill in local database credentials
   - Generate SESSION_SECRET
   - Test with `npm run dev`

2. **Production Setup:**
   - Choose platform (GCP/DO/AWS/Self-hosted)
   - Follow platform-specific secret management above
   - Create strong passwords and API keys
   - Deploy and verify connectivity

3. **Ongoing:**
   - Document deployment-specific setup in `DEPLOYMENT_NOTES.md`
   - Schedule quarterly credential rotation
   - Monitor for unauthorized access
   - Keep `.env.example` updated with new variables

## Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] No credentials in code or comments
- [ ] SESSION_SECRET is regenerated for each environment
- [ ] Database password meets strength requirements (16+ chars)
- [ ] All API keys stored in secret management
- [ ] Production database on secure, network-restricted host
- [ ] .env file on production server has restricted permissions (600)
- [ ] Credentials rotated quarterly or after team changes
- [ ] No credentials shared unencrypted
- [ ] Access logs monitored for unusual activity

## Related Documentation

- [DEVELOPMENT.md](DEVELOPMENT.md) - Local setup instructions
- [INFRASTRUCTURE.md](INFRASTRUCTURE.md) - Platform-specific deployment
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Connection error solutions

## Questions?

Refer to platform-specific documentation:
- [GCP Secret Manager Docs](https://cloud.google.com/secret-manager/docs)
- [AWS Secrets Manager Docs](https://docs.aws.amazon.com/secretsmanager/)
- [DigitalOcean App Spec Docs](https://docs.digitalocean.com/products/app-platform/references/app-spec/)
