#!/bin/bash

DB_FILE="./temp/database.sqlite"

if [ ! -f "$DB_FILE" ]; then
  mkdir -p "./temp/file/temp/"
  touch "$DB_FILE"
fi
