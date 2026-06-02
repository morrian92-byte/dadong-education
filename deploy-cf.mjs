// Cloudflare Pages deployment script
import { readFileSync, existsSync } from 'fs';

// Read token from temp file outside project
const tokenPath = '/tmp/dadong_cf_creds.json';
if (!existsSync(tokenPath)) {
  console.error('Token file not found at', tokenPath);
  process.exit(1);
}

const creds = JSON.parse(readFileSync(tokenPath, 'utf-8'));
const { token, accountId } = creds;

const BASE = 'https://api.cloudflare.com/client/v4';

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// Step 1: Create project if not exists
const projectName = 'dadong-education';
console.log('Creating project...');
const createResult = await api('POST', `/accounts/${accountId}/pages/projects`, {
  name: projectName,
  production_branch: 'master',
});

if (createResult.success) {
  console.log('Project created:', createResult.result.name);
} else if (createResult.errors?.[0]?.code === 8000006) {
  console.log('Project already exists, continuing...');
} else {
  console.log('Create result:', JSON.stringify(createResult, null, 2));
}

// Step 2: Get the deployment upload URL
console.log('Getting upload URL...');
const deployResult = await api('POST', `/accounts/${accountId}/pages/projects/${projectName}/deployments`);
console.log('Deploy result:', JSON.stringify(deployResult, null, 2));

console.log('Done!');
