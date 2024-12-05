#!/bin/bash

DB_FILE="./temp/database.sqlite"

if [ ! -f "$DB_FILE" ]; then
  mkdir -p "./temp/file/temp/"
  touch "$DB_FILE"
fi

# cd ./test_data || {
#   echo "Directory not found"
#   exit 1
# }
#
# MODULE_DIR="./node_modules"
#
# if [ ! -d "$MODULE_DIR" ]; then
#   npm i
# fi
#
# if [ $? -ne 0 ]; then
#   echo "Failed to install node_modules. Exiting."
#   exit 1
# fi
