# GitHub Actions Workflow Troubleshooting

## Workflows Not Appearing

If you don't see workflows in the Actions tab, check these:

### 1. Enable GitHub Actions

1. Go to: https://github.com/cloudsecurityweb/echopad-website/settings/actions
2. Under "Actions permissions", select:
   - ✅ "Allow all actions and reusable workflows"
3. Click "Save"

### 2. Check Workflow Files Location

Workflows must be in: `.github/workflows/*.yml`

Verify:
```bash
ls -la .github/workflows/production-*.yml
```

### 3. Check Branch

Workflows trigger on `Production` branch. Make sure you're:
- Pushing to `Production` branch
- Viewing workflows for `Production` branch in GitHub

### 4. Manual Trigger (Recommended for Testing)

1. Go to: https://github.com/cloudsecurityweb/echopad-website/actions
2. Click on a workflow (e.g., "Production Backend Deployment")
3. Click **"Run workflow"** button (top right)
4. Select **"Production"** branch
5. Click **"Run workflow"**

This bypasses path filters and triggers immediately.

### 5. Check Path Filters

Workflows have path filters:
- **Backend**: Only triggers on changes to `backend/**`
- **Frontend**: Only triggers on changes to `frontend/**`
- **Full**: Triggers on changes to `backend/**` or `frontend/**`

If you only changed `.github/` files, workflows won't trigger automatically.

### 6. First-Time Workflow Approval

If this is the first time running workflows:
1. Go to Actions tab
2. You might see a banner asking to approve workflows
3. Click "Approve and run"

### 7. Check Repository Permissions

Workflows need:
- Read access to repository
- Write access (for deployments)
- Access to secrets

Verify at: https://github.com/cloudsecurityweb/echopad-website/settings/actions

## Quick Test

To test if workflows work:

1. **Manually trigger** (easiest):
   - Actions → Select workflow → Run workflow → Production branch

2. **Make a code change**:
   ```bash
   echo "# Test" >> backend/README.md
   git add backend/README.md
   git commit -m "Test workflow"
   git push origin Production
   ```

3. **Wait 30-60 seconds** and refresh Actions page

## Verify Workflow is Running

1. Go to: https://github.com/cloudsecurityweb/echopad-website/actions
2. You should see:
   - Workflow name
   - Status (queued/running/success/failed)
   - Commit that triggered it
   - Duration

## Common Errors

### "Workflow not found"
- Check workflow file is in `.github/workflows/`
- Check file has `.yml` extension
- Check YAML syntax is valid

### "No jobs to run"
- Check path filters match your changes
- Try manual trigger instead

### "Secrets not found"
- Add GitHub Secrets (see `.github/GITHUB_SECRETS_SETUP.md`)
- Verify secret names match workflow (e.g., `PROD_*`)

### "Runner not available"
- Check self-hosted runner is online
- Go to: Settings → Actions → Runners
- Verify runner shows as "Online"

## Still Not Working?

1. Check GitHub status: https://www.githubstatus.com/
2. Verify repository has Actions enabled
3. Check if you have permission to run workflows
4. Try creating a simple test workflow to verify Actions work
