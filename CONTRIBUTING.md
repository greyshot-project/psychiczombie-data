# Contributing Guide

Thank you for your interest in contributing to the Greyshot data repository! This guide will help you submit high-quality contributions.

## Before You Start

1. **Search for duplicates**: Check if the encounter or data source already exists
2. **Verify your information**: Only submit accurate, verifiable information
3. **Gather your sources**: Have links to original sources ready

## Step-by-Step Contribution Process

### 1. Fork the Repository

Click the "Fork" button in the top right corner of this repository.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/REPO-NAME.git
cd REPO-NAME
```

### 3. Create a Branch

```bash
git checkout -b add/encounter-name
# or
git checkout -b add/datasource-name
```

### 4. Create Your YAML File

Create your file in the appropriate directory:
- Encounters: `encounters/YYYY/MM/slug-name.yaml`
- Data Sources: `datasources/YYYY/MM/slug-name.yaml`

Use the examples in `encounters/` and `datasources/` as templates.

### 5. Validate Locally

```bash
npm install
npm run validate -- path/to/your/file.yaml
npm run check-duplicates
```

### 6. Commit and Push

```bash
git add .
git commit -m "Add: [Encounter/DataSource] Title"
git push origin your-branch-name
```

### 7. Create a Pull Request

Go to your fork on GitHub and click "New Pull Request".

## YAML File Guidelines

### Encounters

| Field | Required | Description |
|-------|----------|-------------|
| `version` | Yes | Always `"1.0"` |
| `type` | Yes | Always `"encounter"` |
| `title` | Yes | Clear, descriptive title (5-200 chars) |
| `startDate` | Yes | YYYY-MM-DD format |
| `endDate` | Yes | YYYY-MM-DD format (can equal startDate) |
| `location` | Yes | GeoJSON Point with [longitude, latitude] |
| `locationApprox` | Yes | Approximation radius in km |
| `description` | Yes | Detailed description (min 20 chars) |
| `tags` | Yes | At least one tag |
| `media` | No | Optional media attachments |

### Data Sources

| Field | Required | Description |
|-------|----------|-------------|
| `version` | Yes | Always `"1.0"` |
| `type` | Yes | Always `"datasource"` |
| `title` | Yes | Clear, descriptive title (5-100 chars) |
| `publicationDate` | Yes | YYYY-MM-DD format |
| `description` | Yes | Detailed description (min 20 chars) |
| `encounters` | Yes | At least one encounter file path |
| `authors` | Yes | At least one author |
| `tags` | Yes | At least one tag |
| `media` | No | Optional media attachments |

## Tag Conventions

Use UPPERCASE_WITH_UNDERSCORES for tags:

### Location Tags
- `USA`, `ARIZONA`, `PHOENIX`
- `UK`, `LONDON`
- etc.

### Type Tags
- `MASS_SIGHTING` - Multiple witnesses
- `CLOSE_ENCOUNTER` - Close proximity
- `LIGHTS` - Light phenomena
- `TRIANGLE` - Triangular craft
- `DISC` - Disc-shaped craft
- `PHYSICAL_EVIDENCE` - Physical traces left behind

### Source Tags
- `NEWS_REPORT` - Media coverage
- `OFFICIAL_REPORT` - Government/military documents
- `EYEWITNESS` - First-hand accounts
- `RESEARCH_PAPER` - Academic research
- `VIDEO_FOOTAGE` - Video evidence
- `PHOTOGRAPH` - Photographic evidence

## Media Guidelines

- Only use HTTPS URLs
- Include license information
- Prefer stable sources (archive.org, wikimedia, etc.)
- Provide clear descriptions

### Acceptable Licenses
- Public Domain
- CC-BY (any version)
- CC-BY-SA (any version)
- Fair Use (for news/educational purposes)
- With explicit permission

## Common Mistakes to Avoid

1. **Wrong coordinate order**: It's [longitude, latitude], not [latitude, longitude]
2. **Missing required fields**: Run validation before submitting
3. **Duplicate entries**: Search first!
4. **Broken encounter references**: Make sure referenced files exist
5. **Invalid dates**: Use YYYY-MM-DD format

## Getting Help

- Open an issue for questions
- Check existing issues for common problems
- Join our community discussions

## Code of Conduct

- Be respectful and constructive
- Focus on facts, not speculation
- Cite your sources
- Respect copyright and licensing

Thank you for contributing to open-source disclosure!
