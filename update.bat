@echo off

ECHO Pulling Changes From Git
git pull --commit

ECHO Updating Composer
call composer update

ECHO Dumping Autoload
call composer dump-autoload

ECHO Migrating DB
call php artisan migrate:refresh

ECHO Seeding DB
call php artisan db:seed

ECHO Bulding Project
call gulp

ECHO Opening Project
call atom .
