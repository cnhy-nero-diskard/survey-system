# Infrastructure & Deployment Guide

This guide covers deploying the survey system to cloud platforms or self-hosted environments. The unified deployment simplifies infrastructure by combining frontend and backend into a single Docker container.

## Deployment Options

The team can choose from multiple deployment platforms:
1. **Google Cloud Platform (GCP)** - Current production setup
2. **DigitalOcean** - Recommended alternative (lower cost, simpler)
3. **AWS** - Alternative option
4. **Self-Hosted** - Docker Compose on your own server

## Prerequisites for All Deployments

- Docker installed and working locally
- Git repository access
- PostgreSQL database (managed or self-hosted)
- Valid SSL certificates (or Let's Encrypt)
- Environment variables prepared (see `.env.example`)

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Load Balancer / CDN               │
│              (Cloud CDN, Cloudflare)                │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────────┐
│           Web Container (Nginx + App)               │
│  ┌─────────────────────────────────────────────┐   │
│  │  Nginx Reverse Proxy (port 443/80)          │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                              │
│  ┌──────────────────┴──────────────────────────┐   │
│  │  Node.js Express Server (port 5000)         │   │
│  │  - Routes API requests                      │   │
│  │  - Serves static assets                     │   │
│  │  - Manages sessions                         │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                              │
│  ┌──────────────────┘                              │
│  │ React Client Bundled (static files)             │
│  └─────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────────────┐  ┌────────▼───────────────┐
│ PostgreSQL Database    │  │ External Services     │
│ (managed or hosted)    │  │ - SendGrid (email)    │
│                        │  │ - Hugging Face (AI)   │
└────────────────────────┘  └──────────────────────┘
```

## Option 1: Google Cloud Platform (Current Setup)

### Prerequisites
- GCP account with billing enabled
- `gcloud` CLI installed and authenticated
- Docker image pushed to Google Container Registry (GCR) or Artifact Registry

### Step 1: Create Cloud SQL Database

```bash
# Create PostgreSQL instance
gcloud sql instances create survey-system-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --availability-type=regional

# Create database
gcloud sql databases create survey_system \
  --instance=survey-system-db

# Create database user
gcloud sql users create postgres \
  --instance=survey-system-db \
  --password=[STRONG_PASSWORD]

# Initialize schema
gcloud sql connect survey-system-db \
  --user=postgres < context/db_template_survey.sql
```

### Step 2: Create Cloud Storage Bucket (Optional, for logs/backups)

```bash
gsutil mb gs://survey-system-backups
```

### Step 3: Build and Push Docker Image

```bash
# Enable Artifact Registry
gcloud services enable artifactregistry.googleapis.com

# Create repository
gcloud artifacts repositories create survey-repo \
  --location=us-central1 \
  --repository-format=docker

# Configure Docker auth
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build image
docker build -t us-central1-docker.pkg.dev/[PROJECT-ID]/survey-repo/survey-system:latest .

# Push to registry
docker push us-central1-docker.pkg.dev/[PROJECT-ID]/survey-repo/survey-system:latest
```

### Step 4: Deploy to Cloud Run

```bash
gcloud run deploy survey-system \
  --image=us-central1-docker.pkg.dev/[PROJECT-ID]/survey-repo/survey-system:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --timeout=300 \
  --set-env-vars=NODE_ENV=production,DB_HOST=[CLOUD-SQL-IP],DB_USER=postgres,DB_PASSWORD=[PASSWORD],DB_NAME=survey_system,SESSION_SECRET=[GENERATE-NEW]
```

### Step 5: Set Up Cloud SQL Proxy (For Security)

For production, use Cloud SQL Proxy instead of direct IP:

```bash
gcloud run deploy survey-system \
  --add-cloudsql-instances=[PROJECT-ID]:us-central1:survey-system-db \
  --set-env-vars=INSTANCE_CONNECTION_NAME=[PROJECT-ID]:us-central1:survey-system-db \
  # ... other flags
```

In your backend code, connect via socket:
```javascript
const pool = new pg.Pool({
  host: process.env.DB_SOCKET_PATH || 'localhost',
  // ... other config
});
```

### Step 6: Set Up Custom Domain

```bash
# Map custom domain to Cloud Run
gcloud run services update-traffic survey-system \
  --set-domain=yourdomain.com
```

Configure DNS records:
- Point `A` record to Cloud Run IP
- Set up SSL via Google-managed cert

## Option 2: DigitalOcean (Recommended Alternative)

### Prerequisites
- DigitalOcean account with billing enabled
- `doctl` CLI installed and authenticated
- Docker image pushed to DigitalOcean Container Registry

### Step 1: Set Up Managed Database

```bash
# Create PostgreSQL database
doctl databases create survey-system-db \
  --engine pg \
  --region nyc3 \
  --num-nodes 1 \
  --size db-s-1vcpu-1gb

# Get connection details
doctl databases describe survey-system-db
```

### Step 2: Push Docker Image to DOCR

```bash
# Authenticate Docker
doctl auth init
doctl registry login

# Tag and push image
docker tag survey-system:latest registry.digitalocean.com/yourregistry/survey-system:latest
docker push registry.digitalocean.com/yourregistry/survey-system:latest
```

### Step 3: Deploy to App Platform

```bash
# Create app.yaml config
cat > app.yaml << 'EOF'
name: survey-system
services:
- name: api
  image:
    registry: digitalocean
    repository: survey-system
    tag: latest
  http_port: 5000
  health_check:
    http_path: /api/health
  env:
  - key: NODE_ENV
    value: production
  - key: DB_HOST
    value: ${db.HOSTNAME}
  - key: DB_USER
    value: doadmin
  - key: DB_PASSWORD
    value: ${db.PASSWORD}
  - key: DB_NAME
    value: survey_system
  - key: SESSION_SECRET
    value: ${SESSION_SECRET}
  database:
    engine: PG
    production: true
    name: pg_db
databases:
- name: pg_db
  engine: PG
  production: true
  version: "14"
EOF

# Deploy
doctl apps create --spec app.yaml
```

### Step 4: Configure Custom Domain

```bash
doctl apps update [APP-ID] \
  --spec-domains=yourdomain.com:api
```

## Option 3: AWS Deployment

### Prerequisites
- AWS account with billing enabled
- AWS CLI configured
- ECR repository created

### Step 1: Push to Elastic Container Registry

```bash
# Authenticate Docker
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin [ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag survey-system:latest [ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com/survey-system:latest
docker push [ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com/survey-system:latest
```

### Step 2: Create RDS Database

```bash
# Create PostgreSQL RDS instance
aws rds create-db-instance \
  --db-instance-identifier survey-system-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password [STRONG-PASSWORD] \
  --allocated-storage 20 \
  --publicly-accessible false
```

### Step 3: Deploy to ECS

Using AWS Fargate:
```bash
# Create ECS task definition, service, etc.
# (See AWS ECS documentation for detailed steps)
```

Or use AppRunner (simpler):
```bash
aws apprunner create-service \
  --service-name survey-system \
  --source-configuration ImageRepository={ImageIdentifier=[ECR-URI],ImageRepositoryType=ECR}
```

## Option 4: Self-Hosted (Docker Compose)

For on-premises or VPS deployment:

### Prerequisites
- Docker and Docker Compose installed
- Server with at least 1GB RAM, 20GB storage
- Ubuntu 20.04 LTS or similar

### Step 1: Set Up Server

```bash
ssh user@your-server.com
cd /opt/survey-system
```

### Step 2: Create docker-compose.yml for Production

Use the provided `docker-compose.prod.yml` as template:
```bash
cp docker-compose.prod.yml docker-compose.yml
```

Edit with production settings:
```yaml
version: '3.8'
services:
  app:
    image: survey-system:latest
    ports:
      - "80:80"
      - "443:443"
    environment:
      NODE_ENV: production
      DB_HOST: db
      DB_USER: postgres
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: survey_system
      SESSION_SECRET: ${SESSION_SECRET}
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt  # SSL certs
    depends_on:
      - db
    restart: always
  
  db:
    image: postgres:14
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./context/db_template_survey.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      POSTGRES_DB: survey_system
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    restart: always

volumes:
  postgres_data:
```

### Step 3: Set Up SSL Certificates

```bash
# Using Let's Encrypt with Certbot
sudo apt update && sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
```

Update nginx.conf to use certificates:
```nginx
listen 443 ssl;
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

### Step 4: Deploy

```bash
# Build image locally and push, or build on server
docker-compose up -d

# Verify
docker-compose logs -f app
```

### Step 5: Set Up Auto-Renewal (SSL)

```bash
# Create renewal script
sudo crontab -e
# Add: 0 3 * * * /usr/bin/certbot renew --quiet
```

## Database Migration Strategies

### Option A: Fresh Database Initialization
Use when deploying to a new environment with no existing data:

```bash
# Template already does this via init SQL
psql -h [DB_HOST] -U postgres -d survey_system < context/db_template_survey.sql
```

### Option B: Migrate Data from Existing Database
Use when moving from old environment to new:

```bash
# See scripts/migrate-data.sh for full process
# Export data
pg_dump -h [OLD_HOST] -U postgres survey_system > backup.sql

# Import to new database
psql -h [NEW_HOST] -U postgres -d survey_system < backup.sql
```

### Option C: Progressive Migration (Zero Downtime)
For mission-critical systems:
1. Run new database alongside old
2. Mirror writes to both databases
3. Validate data consistency
4. Switch read traffic to new database
5. Switch write traffic
6. Decommission old database

See [Migration Guide](scripts/migrate-data.sh) for implementation.

## Environment Variable Secrets

**Never commit credentials to Git!**

### Manage Secrets Per Platform

**GCP:**
```bash
gcloud secrets create db-password --data-file=-
gcloud run deploy survey-system \
  --set-env-vars=DB_PASSWORD=projects/[PROJECT-ID]/secrets/db-password/versions/latest
```

**DigitalOcean:**
```bash
# Use app.yaml with encrypted env values
```

**AWS:**
```bash
aws secretsmanager create-secret --name survey-db-password --secret-string [PASSWORD]
# Reference in ECS task definition
```

**Self-Hosted:**
```bash
# Store in .env file on server (not in git)
# Restrict permissions: chmod 600 .env
```

## Monitoring & Maintenance

### Health Checks

Add endpoint to backend (if not exists):
```javascript
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

Configure health checks on platform:
- GCP Cloud Run: `/api/health`
- DigitalOcean App: `/api/health`
- AWS: `/api/health`

### Logging & Monitoring

**GCP:**
```bash
gcloud logging read "resource.type=cloud_run_revision" --limit=50
```

**DigitalOcean:**
```bash
doctl monitoring metrics get [APP-ID]
```

**Self-Hosted:**
```bash
docker-compose logs -f app
```

### Database Backups

**GCP Cloud SQL:**
Automated daily backups; configure retention in console.

**DigitalOcean:**
Automated backups included; configure in database dashboard.

**AWS RDS:**
Automated backups with configurable retention.

**Self-Hosted:**
```bash
# Daily backup script
0 2 * * * pg_dump -h localhost -U postgres survey_system | gzip > /backups/survey_$(date +\%Y\%m\%d).sql.gz
```

## Scaling Considerations

### Vertical Scaling (Bigger Machine)
- Increase instance type/size
- Upgrade database tier
- Minimal code changes required

### Horizontal Scaling (Multiple Instances)
- Run multiple instances behind load balancer
- Database becomes bottleneck
- Consider read replicas for analytics queries
- Session storage must be shared (Redis or database)

### Cost Optimization
- Use managed services (Cloud SQL, RDS) vs self-hosted
- right-size instances for actual usage
- Set up monitoring and auto-scaling
- Archive old data to cheaper storage

## Troubleshooting Deployments

### Container Won't Start
```bash
# Check logs
docker logs [CONTAINER-ID]

# Verify environment variables
docker run -it [IMAGE] /bin/sh
env | grep DB_
```

### Database Connection Errors
```bash
# Test connection manually
psql -h [DB_HOST] -U [DB_USER] -d [DB_NAME]

# Check network policies (firewall rules)
# Ensure Cloud SQL Proxy or network connectivity configured
```

### Static Assets Not Serving
- Verify nginx.conf is correct
- Check build output: `npm run client:build`
- Verify static files copied to Docker image

### SSL Certificate Issues
- Verify certificate not expired: `openssl x509 -in cert.pem -text -noout`
- Renew if needed: `certbot renew`
- Check path in nginx.conf matches actual file location

## Next Steps

1. Choose platform (GCP, DigitalOcean, AWS, or Self-Hosted)
2. Follow platform-specific setup steps above
3. Configure CI/CD to automate deployments (see `.github/workflows/`)
4. Set up monitoring and alerting
5. Document your specific configuration in a `DEPLOYMENT_NOTES.md` file
6. Train team on deployment procedures

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [GCP Cloud Run Guide](https://cloud.google.com/run/docs)
- [DigitalOcean App Platform Guide](https://docs.digitalocean.com/products/app-platform/)
- [AWS Fargate Guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_FARGATE.html)
- [PostgreSQL Backup & Recovery](https://www.postgresql.org/docs/current/backup.html)
