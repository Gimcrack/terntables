#!/usr/bin/bash
git add .
git commit -m "$1"
git push
cd ..
cd dashboard-laravel
git pull origin msb-it-dashboard-dev