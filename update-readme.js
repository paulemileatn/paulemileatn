import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = 'paulemileatn';
const repo = 'paulemileatn';
const readmePath = 'README.md';

async function updateGitHubReadme() {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: readmePath,
    });

    const sha = data.sha;
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const updatedLine = `Updated on ${currentDate}`;

    const content = Buffer.from(data.content, 'base64').toString('utf8');

    const lines = content
      .split('\n')
      .filter(line => !line.startsWith('Updated on '));
    lines.push(updatedLine);

    const finalContent = lines.join('\n');

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: readmePath,
      message: 'Daily automatic README.md update',
      content: Buffer.from(finalContent).toString('base64'),
      sha,
    });

    console.log('README.md updated successfully');
  } catch (error) {
    console.error('Error updating README.md:', error);
  }
}

updateGitHubReadme();
