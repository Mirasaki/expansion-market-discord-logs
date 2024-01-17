module.exports = {
  apps: [
    {
      name: 'expansion-market-discord-logs',
      script: './dist/client/index.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
