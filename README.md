# Greyshot Data Repository

This repository contains community-contributed encounters and data sources for the Greyshot platform.

## How to Contribute

1. **Fork this repository**
2. **Create a new branch** for your contribution
3. **Add your YAML file** in the appropriate directory
4. **Submit a Pull Request**

When your PR is merged, the data will be automatically synced to the platform and you'll receive reputation points!

## Directory Structure

```
├── encounters/
│   └── YYYY/
│       └── MM/
│           └── slug-title.yaml
├── datasources/
│   └── YYYY/
│       └── MM/
│           └── slug-title.yaml
├── schemas/
│   ├── encounter.schema.json
│   └── datasource.schema.json
└── scripts/
    ├── validate.js
    └── check-duplicates.js
```

## File Naming Convention

- Use lowercase with hyphens: `phoenix-lights-1997.yaml`
- Organize by date: `encounters/1997/03/phoenix-lights-1997.yaml`
- Keep names concise but descriptive

## Encounter YAML Format

```yaml
version: "1.0"
type: encounter

title: "Phoenix Lights Mass Sighting"
startDate: "1997-03-13"
endDate: "1997-03-13"

location:
  type: Point
  coordinates: [-112.0740, 33.4484]  # [longitude, latitude]
locationApprox: 5  # km radius

description: |
  On March 13, 1997, thousands of witnesses in Phoenix, Arizona
  reported seeing a massive V-shaped formation of lights...

tags:
  - MASS_SIGHTING
  - LIGHTS
  - ARIZONA
  - USA

# Optional
media:
  - url: "https://archive.org/details/example"
    description: "News footage from the event"
    license: "Fair Use"

metadata:
  mongoId: null  # Auto-populated after sync
```

## Data Source YAML Format

```yaml
version: "1.0"
type: datasource

title: "Phoenix Lights Official Investigation Report"
publicationDate: "1997-06-15"

description: |
  Official investigation report from local authorities
  regarding the March 13, 1997 Phoenix Lights incident...

encounters:
  - "encounters/1997/03/phoenix-lights-1997.yaml"

tags:
  - OFFICIAL_REPORT
  - INVESTIGATION

authors:
  # If the author is on the platform:
  - type: "platform_user"
    username: "researcher_jane"

  # If the author is NOT on the platform:
  - type: "external"
    name: "Dr. John Smith"
    affiliation: "Arizona State University"
    # claimToken is auto-generated for claiming later

  # If author is unknown:
  - type: "admin_placeholder"
    reason: "Original author unknown"

media:
  - url: "https://example.com/report.pdf"
    description: "Original report PDF"
    license: "Public Domain"

metadata:
  mongoId: null  # Auto-populated after sync
```

## Validation

Before submitting, validate your YAML files locally:

```bash
# Install dependencies
npm install

# Validate a single file
npm run validate -- encounters/1997/03/phoenix-lights-1997.yaml

# Check for duplicates
npm run check-duplicates

# Validate all files
npm run validate-all
```

## Author Types Explained

| Type | Description | When to Use |
|------|-------------|-------------|
| `platform_user` | Someone with a Greyshot account | When you know their username |
| `external` | Real person not on the platform | For researchers, journalists, etc. |
| `admin_placeholder` | Unknown or anonymous | When author is genuinely unknown |

### Claiming Authorship

If you're an `external` author and later join the platform, you can claim your data sources to receive reputation credit. Contact an admin with your claim token.

## Reputation Points

| Action | Points |
|--------|--------|
| Create new encounter | 5 |
| Edit existing encounter | 2 |
| Create new data source | 10 |
| Edit existing data source | 3 |

## Guidelines

1. **Accuracy**: Only submit verifiable information
2. **No duplicates**: Search existing entries before creating new ones
3. **Quality descriptions**: Provide detailed, well-written descriptions
4. **Proper sources**: Link to original sources when possible
5. **Media licensing**: Only use media you have rights to use

## Questions?

Open an issue if you have questions about contributing!
