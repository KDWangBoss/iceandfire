module.exports = {
  apps : [{
    name: 'iceandfire',
    script: 'server.js',
    args: 'one two', //
    instances: 1,// 运行实例的个数
    autorestart: true,//自动重启
    watch: false, //文件改变自动重启
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : '47.98.155.229',
      ref  : 'origin/master',
      repo : 'git@github.com:KDWangBoss/iceandfire.git',
      path : '/var/www/iceandfire/production', //要发布到服务器的哪个目录下
      'ssh_options': 'StrictHostKeyChecking=no',//避免clone分支的时候key的验证而失败
      // 'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-deploy': 'git fetch --all',
      'pre-deploy-local': 'echo "Deploy Done!"',//在发布之前先跑一遍本地的任务，代码格式，压缩编译等
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
