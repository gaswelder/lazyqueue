#!/bin/sh

php app.php server &
(cd frontend && yarn start)
