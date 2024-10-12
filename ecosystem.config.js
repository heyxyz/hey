module.exports = {
  apps: [
    {
      name: "hey",
      script: "pnpm",
      args: "run start",
      cwd: "./apps/web",
      instances: 5,
      exec_mode: "cluster",
      env_production: { NODE_ENV: "production" }
    }
  ]
};
