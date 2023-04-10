npm run pm2:stop
npm run pm2:delete
kill -9 $(ps -aux | grep lundprod | tr -s ' ' | cut -d ' ' -f2)
