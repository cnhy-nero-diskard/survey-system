# Repository Structure & Cleanup Guide

This document explains folder organization and what can be archived or removed.

## Recommended Usage

### ✅ Active Folders (Use These)

**`survey-system-unified/`** - The active deployment for all environments
- Contains the unified deployment with React frontend + Node.js backend
- Use this folder for:
  - Local development
  - Docker builds
  - Production deployments
  - All new features

**`.github/`** - CI/CD and documentation
- `workflows/` - GitHub Actions pipelines
- `prompts/` - Plan and documentation files

**`scripts/`** - Database and utility scripts
- Database migrations and restores
- Setup helpers
- Batch operations

**`survey-system-unified/context/`** - Database schema
- `db_template_survey.sql` - Single source of truth for schema

**`survey-system-unified/scripts/`** - Development setup scripts
- `setup-dev.sh` / `setup-dev.bat` - Initialize development environment

### ⚠️ Legacy Folders (Reference Only - Don't Use for New Work)

**`surveymockup1/`** - Old separate frontend deployment
- ❌ Don't use for new deployments
- ❌ Separate Docker container no longer needed
- ✅ Keep for reference if understanding history
- **Action:** Can be archived in separate Git branch if space is needed

**`surveymockup1_backend/`** - Old separate backend deployment
- ❌ Don't use for new deployments
- ❌ Separate Docker container no longer needed
- ✅ Keep for reference if understanding history
- **Action:** Can be archived in separate Git branch if space is needed

Both legacy folders have `.code-workspace` files and their own package.json files. The unified deployment replaces both.

---

## Folder Structure Deep Dive

```
survey-system/                          ← Repository root
├── README.md                           ← Start here! Overview & feature list
├── DEVELOPMENT.md                      ← Local setup guide
├── ARCHITECTURE.md                     ← How the system works
├── INFRASTRUCTURE.md                   ← Deployment to GCP/DO/AWS
├── CREDENTIALS.md                      ← Secrets management
├── TROUBLESHOOTING.md                  ← Common issues & fixes
├── HANDOFF.md                          ← Incomplete work, known issues
├── TEAM_HANDOFF.md                     ← Information for new team
│
├── .github/
│   ├── prompts/
│   │   └── plan-devTeamHandoff.prompt.md  ← This handoff plan
│   └── workflows/                         ← CI/CD pipelines
│       ├── test.yml
│       ├── build.yml
│       ├── deploy-gcp.yml
│       ├── deploy-do.yml
│       └── README.md
│
├── scripts/                             ← Utility scripts (root level)
│   ├── migrate-data.sh
│   ├── restore-data.sh
│   ├── init-fresh-db.sh
│   ├── batch-db-setup.sh
│   └── README.md
│
├── survey-system-unified/               ← ACTIVE - Use this folder!
│   ├── README.md
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── package.json                     ← root npm scripts
│   ├── .env.example
│   ├── .gitignore
│   │
│   ├── client/                          ← React frontend
│   │   ├── package.json
│   │   ├── public/
│   │   │   └── index.html
│   │   └── src/
│   │       ├── components/              ← React components
│   │       ├── pages/                   ← Page-level components
│   │       ├── routes/                  ← Route definitions
│   │       ├── App.js
│   │       └── index.js
│   │
│   ├── server/                          ← Node.js/Express backend
│   │   ├── package.json
│   │   ├── server.js                    ← Entry point
│   │   ├── __tests__/                   ← Jest tests
│   │   ├── config/                      ← Configuration
│   │   ├── controllers/                 ← Request handlers
│   │   ├── routes/                      ← API route definitions
│   │   ├── services/                    ← Business logic
│   │   ├── middleware/                  ← Express middleware
│   │   ├── utils/                       ← Utility functions
│   │   └── localization_queries/        ← SQL queries by feature
│   │
│   ├── context/                         ← Database
│   │   └── db_template_survey.sql       ← Schema (single source of truth)
│   │
│   ├── scripts/                         ← Dev setup scripts
│   │   ├── setup-dev.sh
│   │   └── setup-dev.bat
│   │
│   └── SIDEBAR_BUG_FIXES.md             ← Recent improvements
│   └── SIDEBAR_IMPROVEMENTS.md          ← UI/UX enhancements
│
├── surveymockup1/                       ← LEGACY - Don't use!
│   ├── package.json
│   ├── src/
│   └── ... (old separate frontend)
│
├── surveymockup1_backend/               ← LEGACY - Don't use!
│   ├── package.json
│   ├── server.js
│   └── ... (old separate backend)
│
└── [Other standard files]
    ├── .gitignore
    ├── test.txt
    └── ...
```

---

## File Categorization

### Documentation (Read These First)
- `README.md` - Start here
- `DEVELOPMENT.md` - Setup for development
- `ARCHITECTURE.md` - Understand the system
- `INFRASTRUCTURE.md` - Deployment guides
- `CREDENTIALS.md` - Secret management
- `TROUBLESHOOTING.md` - Solving problems
- `HANDOFF.md` - Known issues and incomplete work
- `TEAM_HANDOFF.md` - Team information

### Configuration (Update for Your Setup)
- `survey-system-unified/.env.example` - Copy to `.env` for development
- `survey-system-unified/Dockerfile` - May need tweaks for your platform
- `survey-system-unified/docker-compose.yml` - Dev setup
- `survey-system-unified/docker-compose.prod.yml` - Production setup

### Scripts (Use as Needed)
- `scripts/` - Root level utility scripts for database operations
- `survey-system-unified/scripts/` - Dev environment setup

### CI/CD (Configure Once)
- `.github/workflows/*.yml` - GitHub Actions (need secret configuration)

---

## Cleanup Guide

### Phase 1: Remove if Space is Critical

If you need to reduce repository size:

1. **Archive legacy folders** into separate branch:
   ```bash
   git branch archive-legacy-deployments
   git checkout archive-legacy-deployments
   rm -rf surveymockup1 surveymockup1_backend
   git add -A && git commit -m "Archive legacy deployments"
   git checkout main
   ```

2. **Remove large test files:**
   ```bash
   # Check for large files
   find . -size +10M -type f
   
   # Remove if not needed for testing
   ```

3. **.gitignore is critical** - always ensure:
   - `.env` is ignored (don't commit secrets)
   - `node_modules/` is ignored
   - `*.sql` backups are ignored
   - `*.key` and `*.pem` are ignored

### Phase 2: Optional Housekeeping

- Remove old branches after merging PRs
- Clean up old GitHub Actions artifacts
- Archive completed GitHub issues

### Phase 3: Keep These Always

- All documentation files (they're small)
- `.github/workflows/` (CI/CD needed for deployment)
- `scripts/` (database maintenance critical)
- `survey-system-unified/` (the active system)

---

## What Each Folder Needs

### For New Development
```
survey-system-unified/
  ├── client/src/          ← Add React components here
  ├── server/              ← Add API endpoints here
  ├── context/             ← Update schema if DB changes
  └── package.json         ← Update scripts if needed
```

### For Deployment
```
.github/workflows/         ← Use test.yml and appropriate deploy.yml
scripts/                   ← Use for database migrations
survey-system-unified/     ← Build Docker image from here
```

### For Troubleshooting
```
TROUBLESHOOTING.md        ← Check here first
HANDOFF.md                ← Known issues documented
ARCHITECTURE.md           ← How features work
```

---

## Migration Checklist

When handoff occurs, update these:

1. **Update README.md** top section with:
   - [ ] New team name/contact
   - [ ] Deployment platform (GCP/DO/AWS)
   - [ ] Current status (ready for production)
   - [ ] Recent changes/version

2. **Update documentation** as needed:
   - [ ] Add any team-specific setup notes
   - [ ] Update contact information
   - [ ] Document any custom configurations

3. **Archive legacy code** if desired:
   - [ ] Separate branch for old deployments
   - [ ] Document why both existed

4. **Configure CI/CD** for your needs:
   - [ ] GitHub Actions secrets set up
   - [ ] Appropriate workflows enabled
   - [ ] Deployment platform access configured

---

## Decision: Keep or Remove Legacy Folders?

For productivity, consider:

### Keep Legacy Folders If:
- ✅ Documentating code evolution for team learning
- ✅ Might need to support old deployment temporarily
- ✅ Historical reference for architecture decisions

### Remove Legacy Folders If:
- ✅ Space is constrained (they double repo size)
- ✅ Team only needs current deployment
- ✅ Can always restore from Git history if needed

**Recommendation:** Archive into separate branch, keep main branch clean with unified deployment only.

---

## After This Handoff

### Week 1-2 Activities
```
✓ Read all documentation
✓ Set up local development environment
✓ Deploy to staging
✓ Deploy to production
✓ Configure monitoring/alerts
```

### Ongoing Maintenance
```
✓ Monitor dependencies for security updates
✓ Watch GitHub Actions runs
✓ Keep documentation updated
✓ Plan feature releases
```

### Documentation Maintenance
- Update docs when adding features
- Keep HANDOFF.md updated with progress on incomplete items
- Document any custom deployments/configurations
- Update CI/CD if changing deployment approach

---

## File Ownership

| Folder | Owner | Responsibility |
|--------|-------|-----------------|
| `survey-system-unified/` | **Your team** | Main code, features, bugs |
| `scripts/` | **Your team** | Database operations |
| `.github/workflows/` | **DevOps** | CI/CD pipelines, deployments |
| Documentation | **Your team** | Keep accurate and updated |
| `surveymockup1*/` | **Archive** | Reference only (can delete) |

---

## Questions About Structure?

Refer to:
- [ARCHITECTURE.md](ARCHITECTURE.md) - detailed component breakdown
- [DEVELOPMENT.md](DEVELOPMENT.md) - explaining folder use in setup
- [README.md](README.md) - overview of system

All documentation is designed to help you understand and maintain this codebase effectively.
