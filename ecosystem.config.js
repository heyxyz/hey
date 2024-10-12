module.exports = {
  apps: [
    {
      name: "hey",
      script: "node_modules/.bin/next",
      args: "start --port 80",
      cwd: "./apps/web",
      instances: "max",
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
