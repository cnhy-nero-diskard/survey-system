# GitHub Actions Workflows

This directory contains CI/CD pipeline configurations for automated testing, building, and deployment.

## Available Workflows

### 1. `test.yml` - Automated Testing
**Triggers:** Push to `main`/`develop`, Pull requests

**What it does:**
- Sets up PostgreSQL test database
- Installs dependencies for client and server
- Initializes database schema from template
- Runs Jest test suite for backend
- Builds React frontend
- Uploads coverage reports to Codecov

**Requirements:**
- Working test suite (`npm test` succeeds locally)
- Database schema properly defined

**Fix if failing:**
- Ensure all tests pass locally first
- Check database initialization is working
- Verify environment variables for tests are set

---

### 2. `build.yml` - Docker Image Building
**Triggers:** Push to `main`, Tags (v*), Manual trigger

**What it does:**
- Sets up Docker Buildx for multi-platform builds
- Authenticates to Docker Hub
- Builds Docker image from `survey-system-unified/Dockerfile`
- Tags with branch name, version, and SHA
- Pushes to Docker Hub registry
- Caches layers for faster builds
- Tests image on PRs (without pushing)

**Requirements:**
- Docker Hub account
- GitHub secrets configured:
  - `DOCKERHUB_USERNAME`
  - `DOCKERHUB_TOKEN`

**Manual trigger:**
- Go to "Actions" → "Build Docker Image" → "Run workflow"

**Fix if failing:**
- Verify Docker Hub credentials in GitHub Secrets
- Check Dockerfile is valid: `docker build survey-system-unified/`
- Ensure sufficient GitHub Actions storage quota

---

### 3. `deploy-gcp.yml` - GCP Cloud Run Deployment
**Triggers:** Push to `main`, Manual workflow dispatch

**What it does:**
- Authenticates to Google Cloud using Workload Identity
- Builds Docker image
- Pushes to Google Container Registry (GCR)
- Deploys to Cloud Run service
- Configures environment variables from secrets
- Runs health check to verify deployment

**Requirements:**
- GCP project set up
- Cloud Run service created
- GitHub secrets configured:
  - `GCP_PROJECT_ID`
  - `GCP_WORKLOAD_IDENTITY_PROVIDER`
  - `GCP_SERVICE_ACCOUNT_EMAIL`
  - `GCP_STAGING_DB_HOST`, `GCP_STAGING_DB_USER`, etc.
  - `GCP_STAGING_SESSION_SECRET`, etc.
  - `GCP_PRODUCTION_DB_HOST`, etc. (for prod deployments)

**Manual trigger:**
- Go to "Actions" → "Deploy to GCP Cloud Run" → "Run workflow"
- Select environment (staging or production)

**Database secrets naming:**
- `GCP_STAGING_DB_HOST`, `GCP_STAGING_DB_USER`, `GCP_STAGING_DB_PASSWORD`, etc.
- `GCP_PRODUCTION_DB_HOST`, `GCP_PRODUCTION_DB_USER`, `GCP_PRODUCTION_DB_PASSWORD`, etc.

**Fix if failing:**
- Check GCP credentials and permissions
- Verify secret names match the workflow expectations
- Check Cloud Run service exists and is accessible
- Review Cloud Run logs: `gcloud run services logs read survey-system-staging`

---

### 4. `deploy-do.yml` - DigitalOcean Deployment
**Triggers:** Manual workflow dispatch

**What it does:**
- Authenticates to DigitalOcean
- Builds Docker image
- Pushes to DigitalOcean Container Registry
- Updates DigitalOcean App spec
- Triggers deployment
- Waits for deployment to complete
- Verifies app status

**Requirements:**
- DigitalOcean account and App Platform app
- GitHub secrets configured:
  - `DIGITALOCEAN_ACCESS_TOKEN`
  - `DIGITALOCEAN_REGISTRY_NAME`
  - `DO_STAGING_APP_ID`
  - `DO_PRODUCTION_APP_ID`

**Manual trigger:**
- Go to "Actions" → "Deploy to DigitalOcean" → "Run workflow"
- Select environment and provide image tag

**Fix if failing:**
- Verify DigitalOcean token has correct permissions
- Check app spec files exist (`app-staging.yaml`, `app-production.yaml`)
- Verify app IDs in GitHub secrets
- Check Container Registry access

---

### 5. `manual-deploy-gcp.yml` - Manual GCP Deployment
**Triggers:** Manual workflow dispatch only

**What it does:**
- Deploys an existing Docker image to GCP Cloud Run
- No building involved (reuses existing Docker image)
- Useful for rollbacks or deploying specific versions
- Runs health check

**Use when:**
- You want to deploy without rebuilding
- Rolling back to a previous version
- Deploying a specific tag (e.g., v1.0.0)

**How to use:**
1. Go to "Actions" → "Manual Deployment to GCP" → "Run workflow"
2. Select target environment (staging/production)
3. Optionally specify image tag (defaults to `latest`)
4. Click "Run workflow"

**Example image tags:**
- `latest` - Most recent build
- `v1.0.0` - Specific version tag
- `sha123456` - Specific commit SHA
- `main` - Latest from main branch

---

## Setting Up GitHub Secrets

Each workflow requires specific GitHub secrets to be configured. Go to:
**Settings → Secrets and variables → Actions**

### For GCP Deployments

```bash
GCP_PROJECT_ID                          # Your GCP project ID
GCP_WORKLOAD_IDENTITY_PROVIDER          # Workload identity provider URI
GCP_SERVICE_ACCOUNT_EMAIL               # Service account email
GCP_STAGING_DB_HOST                     # Staging database host
GCP_STAGING_DB_USER                     # Staging database user
GCP_STAGING_DB_PASSWORD                 # Staging database password (sensitive)
GCP_STAGING_DB_NAME                     # Staging database name
GCP_STAGING_DB_PORT                     # Staging database port
GCP_STAGING_SESSION_SECRET              # Staging session secret (sensitive)
GCP_STAGING_CLOUD_SQL_INSTANCE          # Cloud SQL instance connection string
GCP_PRODUCTION_DB_HOST                  # Production database host
GCP_PRODUCTION_DB_USER                  # Production database user
GCP_PRODUCTION_DB_PASSWORD              # Production database password (sensitive)
GCP_PRODUCTION_DB_NAME                  # Production database name
GCP_PRODUCTION_DB_PORT                  # Production database port
GCP_PRODUCTION_SESSION_SECRET           # Production session secret (sensitive)
GCP_PRODUCTION_CLOUD_SQL_INSTANCE       # Cloud SQL instance connection string
```

### For Docker Hub

```bash
DOCKERHUB_USERNAME                      # Docker Hub username
DOCKERHUB_TOKEN                         # Docker Hub personal access token (sensitive)
```

### For DigitalOcean

```bash
DIGITALOCEAN_ACCESS_TOKEN               # DigitalOcean API token (sensitive)
DIGITALOCEAN_REGISTRY_NAME              # Your DOCR registry name
DO_STAGING_APP_ID                       # Staging app ID
DO_PRODUCTION_APP_ID                    # Production app ID
```

### Mark as Sensitive!
When creating secrets for passwords and tokens, ensure you:
1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. GitHub will automatically mask these values in logs

**Never:**
- Share secret values in chat or email
- Commit secrets to repository
- Log secret values

---

## Workflow Status

### View Status
1. Go to repository "Actions" tab
2. Select workflow from left sidebar
3. Click most recent run to see details
4. Expand each job to see logs

### Debugging Failed Workflows

**For test failures:**
```bash
# Run tests locally to debug
npm run install:all
npm test

# Check database setup
psql -U postgres -d survey_system -c "\dt"
```

**For build failures:**
```bash
# Try building locally
cd survey-system-unified
docker build -t survey-system:test .

# Test image
docker run --rm survey-system:test node --version
```

**For deployment failures:**
```bash
# Check GCP service
gcloud run services describe survey-system-staging --region=us-central1

# Check logs
gcloud run services logs read survey-system-staging --limit=50

# Test connection
curl https://survey-system-staging.run.app/api/health
```

---

## Managing Workflows

### Disable a Workflow
1. Go to Actions tab
2. Click workflow name
3. Click "..." menu
4. Select "Disable workflow"

### Delete a Workflow
1. Go to Actions tab
2. Click workflow name
3. Click "..." menu
4. Select "Delete workflow"

### Scheduled Workflows (Future)
You can add scheduled runs like this:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Run daily at 2 AM UTC
```

This would run tests automatically every day.

---

## Best Practices

1. **Test before committing:**
   - Run `npm test` locally before pushing
   - Verify Docker builds: `docker build survey-system-unified/`

2. **Secrets management:**
   - Use GitHub's secret masking (set as organization secrets for reuse)
   - Rotate sensitive values quarterly
   - Never hardcode secrets in workflow files

3. **Branch protection:**
   - Require all tests pass before merging to main
   - Require code review (Settings → Branches → Protection rules)

4. **Logging:**
   - Workflows automatically mask secrets in logs
   - Don't add `echo $SECRET` statements
   - Use GitHub-provided logging commands for output

5. **Performance:**
   - GitHub Actions is free for public repos
   - Make use of caching (npm modules, Docker layers)
   - Clean up old artifacts to save space

---

## Common Issues & Solutions

### "Secret not found"
- Ensure secret name in workflow matches GitHub secret exactly
- Recheck typos in secret names
- If using environment-specific secrets, verify format: `GCP_STAGING_DB_HOST`

### "Insufficient permissions"
- Service account missing required IAM roles
- GCP: Add roles like `roles/run.developer`, `roles/artifactregistry.writer`
- DO: Token needs "read" and "write" permissions

### "Docker image push fails"
- Check Docker Hub credentials
- Verify token hasn't expired
- Check storage quota in registry

### "Health check timeout"
- Service may still be starting, workflow has 30-second retry
- Check service logs for startup errors
- Increase timeout if needed (advanced)

---

## Next Steps

1. **For GCP deployments:**
   - Set up Cloud SQL database
   - Create service account with appropriate roles
   - Configure Workload Identity
   - Add all secret values to GitHub

2. **For DigitalOcean deployments:**
   - Create App Platform apps for staging and production
   - Create Container Registry
   - Generate API token
   - Add app specs and secrets

3. **For Docker Hub:**
   - Create account if needed
   - Generate personal access token
   - Add credentials to GitHub secrets

4. **Enable branch protection:**
   - Require tests pass before merging to main
   - Set up required reviewers

---

## Documentation References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GCP Cloud Run Deployment](../INFRASTRUCTURE.md#option-1-google-cloud-platform)
- [DigitalOcean App Platform](../INFRASTRUCTURE.md#option-2-digitalocean)
- [Docker Documentation](https://docs.docker.com/)
