module.exports = {
  branches: ['main'],
  ci: true,
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/git',
    {
      assets: ['dist/*.js', 'dist/*.js.map'],
      message:
        'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
    },
    '@semantic-release/github',
  ],
};
