// PM2 配置文件示例
// 在服务器上使用 PM2 管理 Next.js 应用

module.exports = {
  apps: [
    {
      name: 'your-site',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/your-site',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs'],
    },
  ],
};

