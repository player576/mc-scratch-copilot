#!/bin/bash
# run.sh - start the Electron app
DIR="$(cd "$(dirname "$0")" && pwd)"
node_modules/.bin/electron .
