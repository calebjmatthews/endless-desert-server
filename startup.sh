set -v

# Configure pm2 to run the node app.
pm2 stop all
pm2 start pm2config.json

pm2 startup
pm2 save

# Application should now be running under pm2
