module.exports = {
  apps: [
    {
      name: 'expansion-market-discord-logs',
      script: './dist/src/index.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
