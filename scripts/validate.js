#!/usr/bin/env node

/**
 * YAML Validation Script
 * Validates encounter and datasource YAML files against their schemas
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Initialize AJV with formats
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Load schemas
const encounterSchema = require('../schemas/encounter.schema.json');
const datasourceSchema = require('../schemas/datasource.schema.json');

// Compile validators
const validateEncounter = ajv.compile(encounterSchema);
const validateDataSource = ajv.compile(datasourceSchema);

function validateFile(filePath) {
  console.log(`\nValidating: ${filePath}`);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  // Read and parse YAML
  let content;
  let data;
  try {
    content = fs.readFileSync(filePath, 'utf8');
    data = yaml.parse(content);
  } catch (error) {
    console.error(`❌ Failed to parse YAML: ${error.message}`);
    process.exit(1);
  }

  // Determine file type and validate
  const isEncounter = filePath.includes('/encounters/') || filePath.startsWith('encounters/');
  const isDataSource = filePath.includes('/datasources/') || filePath.startsWith('datasources/');

  if (!isEncounter && !isDataSource) {
    console.error(`❌ File must be in encounters/ or datasources/ directory`);
    process.exit(1);
  }

  const validator = isEncounter ? validateEncounter : validateDataSource;
  const schemaName = isEncounter ? 'Encounter' : 'DataSource';

  const valid = validator(data);

  if (valid) {
    console.log(`✅ Valid ${schemaName}`);

    // Additional semantic validations
    if (isEncounter) {
      validateEncounterSemantics(data, filePath);
    } else {
      validateDataSourceSemantics(data, filePath);
    }

    return true;
  } else {
    console.error(`❌ Invalid ${schemaName}:`);
    validator.errors.forEach(error => {
      console.error(`   - ${error.instancePath || '/'}: ${error.message}`);
      if (error.params) {
        console.error(`     Params: ${JSON.stringify(error.params)}`);
      }
    });
    process.exit(1);
  }
}

function validateEncounterSemantics(data, filePath) {
  // Check date range
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (endDate < startDate) {
    console.error(`❌ endDate cannot be before startDate`);
    process.exit(1);
  }

  // Check coordinates are valid
  const [lng, lat] = data.location.coordinates;
  if (lng < -180 || lng > 180) {
    console.error(`❌ Invalid longitude: ${lng} (must be between -180 and 180)`);
    process.exit(1);
  }
  if (lat < -90 || lat > 90) {
    console.error(`❌ Invalid latitude: ${lat} (must be between -90 and 90)`);
    process.exit(1);
  }

  // Warn about future dates
  if (startDate > new Date()) {
    console.warn(`⚠️  Warning: startDate is in the future`);
  }

  console.log(`✅ Semantic validation passed`);
}

function validateDataSourceSemantics(data, filePath) {
  // Check that encounter references exist (if we have access to the file system)
  for (const encounterPath of data.encounters) {
    const fullPath = path.resolve(path.dirname(filePath), '..', encounterPath);
    const altPath = path.resolve(process.cwd(), encounterPath);

    if (!fs.existsSync(fullPath) && !fs.existsSync(altPath) && !fs.existsSync(encounterPath)) {
      console.warn(`⚠️  Warning: Referenced encounter not found: ${encounterPath}`);
      console.warn(`   (This may be okay if the encounter will be added in the same PR)`);
    }
  }

  // Check author types
  for (const author of data.authors) {
    if (author.type === 'platform_user' && !author.username) {
      console.error(`❌ platform_user author must have a username`);
      process.exit(1);
    }
    if (author.type === 'external' && !author.name) {
      console.error(`❌ external author must have a name`);
      process.exit(1);
    }
  }

  console.log(`✅ Semantic validation passed`);
}

// Main execution
const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node validate.js <file-path>');
  console.error('Example: node validate.js encounters/2024/01/my-encounter.yaml');
  process.exit(1);
}

validateFile(filePath);
