# Repository Setup Guide

This document explains how to set up the data repositories for both test and production environments.

## Overview

You'll create two repositories:

| Repository | Environment | Syncs To | MongoDB |
|------------|-------------|----------|---------|
| `psychiczombie-data` | Test/Dev | psychiczombie.com | Test cluster |
| `greyshot-data` | Production | greyshot.com (or prod domain) | Production cluster |

## Step 1: Create the GitHub Repositories

### For Test (psychiczombie-data)

1. Go to https://github.com/new
2. Repository name: `psychiczombie-data`
3. Description: "Test data repository for Greyshot/Psychic Zombie"
4. Make it **Public**
5. Click "Create repository"

### For Production (greyshot-data)

1. Go to https://github.com/new
2. Repository name: `greyshot-data`
3. Description: "Community-contributed encounters and data sources for Greyshot"
4. Make it **Public**
5. Click "Create repository"

## Step 2: Push Template Files

For each repository, push the template files:

```bash
# Clone this template
git clone <template-location> temp-repo
cd temp-repo

# Remove git history
rm -rf .git

# Initialize new repo
git init
git add .
git commit -m "Initial commit: Repository structure and templates"

# Push to GitHub (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Configure GitHub Secrets

For each repository, add the following secrets:

### Go to: Settings → Secrets and variables → Actions → New repository secret

### For psychiczombie-data (Test):

| Secret Name | Value |
|-------------|-------|
| `GREYSHOT_API_URL` | `https://psychiczombie.com` |
| `GREYSHOT_WEBHOOK_SECRET` | `<your-test-webhook-secret>` |

### For greyshot-data (Production):

| Secret Name | Value |
|-------------|-------|
| `GREYSHOT_API_URL` | `https://your-production-domain.com` |
| `GREYSHOT_WEBHOOK_SECRET` | `<your-production-webhook-secret>` |

## Step 4: Update Environment Variable

**IMPORTANT**: Update the `ENVIRONMENT` variable in the sync workflow:

### For psychiczombie-data:
In `.github/workflows/sync-to-mongodb.yml`, line ~45:
```yaml
ENVIRONMENT: "test"
```

### For greyshot-data:
In `.github/workflows/sync-to-mongodb.yml`, line ~45:
```yaml
ENVIRONMENT: "production"
```

## Step 5: Add Webhook Secret to Your App

### Local Development (.env file):
```env
GREYSHOT_WEBHOOK_SECRET=your-test-webhook-secret
```

### Vercel (for each environment):

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add `GREYSHOT_WEBHOOK_SECRET`:
   - For Preview/Development: Use test secret
   - For Production: Use production secret

## Step 6: Test the Integration

1. Fork the test repository (psychiczombie-data)
2. Create a test encounter YAML file
3. Submit a PR
4. Verify the validation workflow runs
5. Merge the PR
6. Verify the sync workflow runs and data appears in MongoDB

## Troubleshooting

### Workflow not running?
- Check that the workflow files are in `.github/workflows/`
- Verify the workflow is enabled in Settings → Actions

### Sync failing?
- Check the GitHub Actions logs
- Verify the secrets are set correctly
- Test the API endpoint manually:
  ```bash
  curl -X GET https://psychiczombie.com/api/contributions/sync
  # Should return: {"status":"ok","message":"Contribution sync endpoint is ready"}
  ```

### Data not appearing in MongoDB?
- Check the MongoDB connection in your app
- Verify the `MONGODB_URL` is correct for the environment
- Check server logs for sync errors

## Repository Permissions

### Recommended Branch Protection Rules

Go to: Settings → Branches → Add rule

- Branch name pattern: `main`
- Require pull request reviews before merging: ✓
- Require status checks to pass before merging: ✓
  - Required check: `validate`
- Do not allow bypassing the above settings: ✓

This ensures all data is reviewed before being synced to the database.

## Questions?

Open an issue in the repository if you need help!
