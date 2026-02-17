# 🚀 Automated Stats Factory Setup Guide

This guide will help you set up the automated GitHub stats generation system for your profile.

## 📋 Prerequisites

- Node.js 20.x or higher
- pnpm package manager
- A GitHub account
- GitHub Personal Access Token (PAT)

## 🔧 Installation

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Create GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "GitHub Stats Generator")
4. Select the following scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:user` (Read all user profile data)
5. Click "Generate token"
6. **Copy the token immediately** (you won't be able to see it again!)

### 3. Set Up Local Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your token:

```env
GH_STATS_TOKENS=ghp_your_token_here
GH_USERNAME=petarzarkov
```

### 4. Configure GitHub Repository Secrets

For the GitHub Actions workflow to work, you need to add your PAT as a repository secret:

1. Go to your repository on GitHub
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Name: `GH_STATS_TOKEN`
5. Value: Paste your GitHub Personal Access Token
6. Click **Add secret**

### 5. Enable GitHub Pages

1. Go to **Settings** > **Pages**
2. Under "Build and deployment":
   - Source: **GitHub Actions**
3. Save the settings

## 🎯 Usage

### Generate Stats Locally

To test the stats generation locally:

```bash
pnpm generate
```

This will:

- Fetch your GitHub data (including private contributions)
- Generate SVG cards in the `generated/` folder
- Update your `README.md` with the new stats
- Create/update `index.html` for GitHub Pages

### Watch Mode (Development)

For development, you can use watch mode:

```bash
pnpm dev
```

This will regenerate stats whenever you save changes to the source files.

## 🤖 Automation

The GitHub Action workflow (`.github/workflows/update-stats.yml`) will automatically:

1. **Run every 6 hours** to keep your stats fresh
2. **Generate new SVG cards** with latest data
3. **Commit changes** to the repository
4. **Deploy to GitHub Pages**

You can also:

- **Manually trigger** the workflow from the Actions tab
- **Automatic trigger** on pushes to `main` that affect `src/` or `package.json`

### Updated Files

- **`README.md`**: Stats section between `<!-- STATS:START -->` and `<!-- STATS:END -->` markers
- **`index.html`**: Full GitHub Pages website with your stats

## 🎨 Customization

### Changing Stats Display

Edit `src/svg.ts` to customize:

- Colors and theme
- Card dimensions
- Animations
- Data displayed

### Modifying Data Collection

Edit `src/api.ts` to:

- Change which stats are fetched
- Add new GitHub API calls
- Modify data calculations

### Adjusting Update Frequency

Edit `.github/workflows/update-stats.yml`:

```yaml
schedule:
  - cron: '0 */6 * * *' # Every 6 hours
```

Common cron expressions:

- `0 */3 * * *` - Every 3 hours
- `0 */12 * * *` - Every 12 hours
- `0 0 * * *` - Once daily at midnight

## 🔍 Troubleshooting

### Stats not updating?

1. Check that `GH_STATS_TOKEN` is set in repository secrets
2. Verify the token has correct scopes (`repo`, `read:user`)
3. Check GitHub Actions logs for errors

### Token expired?

Generate a new token and update:

- Local `.env` file
- Repository secret `GH_STATS_TOKEN`

### Workflow not running?

1. Go to **Actions** tab
2. Enable workflows if disabled
3. Try manual trigger: **Run workflow** button

### Generated SVGs not showing?

1. Ensure `generated/` folder is committed
2. Check that file paths in README are correct
3. Verify GitHub Pages is enabled

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/
│       └── update-stats.yml    # GitHub Actions workflow
├── generated/                  # Generated SVG files (auto-created)
│   ├── stats-overview.svg
│   └── languages-activity.svg
├── src/
│   ├── types.ts               # TypeScript interfaces
│   ├── api.ts                 # GitHub API client
│   ├── svg.ts                 # SVG generation logic
│   ├── template.ts            # README/HTML templates
│   └── main.ts                # Main orchestrator
├── .env                       # Local environment (not committed)
├── .env.example               # Environment template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── README.md                  # Your profile README
├── index.html                 # GitHub Pages site
└── SETUP.md                   # This file
```

## 🔒 Security Notes

- ✅ Never commit `.env` file
- ✅ Keep your PAT secure
- ✅ Use repository secrets for CI/CD
- ✅ Regularly rotate your tokens
- ✅ Use minimal required scopes

## 🆘 Support

If you encounter issues:

1. Check the [GitHub Actions logs](../../actions)
2. Verify your token scopes
3. Test locally with `pnpm generate`
4. Check that `.env` file exists and is correct

## 📝 License

MIT License - Feel free to use and modify!
