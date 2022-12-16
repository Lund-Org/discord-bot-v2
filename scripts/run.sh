npm run pm2:start
nohup npx nx run lundprod:serve:production >/dev/null 2>&1 &
echo $! > .pid
