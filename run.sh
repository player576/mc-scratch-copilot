#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/source/desktop-app"
if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js and npm are required. Install from https://nodejs.org/"
  exit 1
fi
npm install
npm start
