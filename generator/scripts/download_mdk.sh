#!/usr/bin/env bash
set -e

# download_mdk.sh
# Usage: ./download_mdk.sh <destination_dir>
# Set FORGE_MDK_URL env var to the Forge MDK zip URL for 1.20.1. If not set, the script will print instructions.

if [ -z "$1" ]; then
  echo "Usage: $0 <destination_dir>"
  exit 1
fi
DIR="$1"

if [ -z "$FORGE_MDK_URL" ]; then
  echo "Environment variable FORGE_MDK_URL is not set."
  echo "Please download the Forge MDK 1.20.1 zip from https://files.minecraftforge.net/ and set FORGE_MDK_URL to its URL, or place the zip as mdk.zip in this folder and re-run."
  exit 1
fi

ZIPPATH="$DIR/mdk.zip"
mkdir -p "$DIR"

echo "Downloading Forge MDK from $FORGE_MDK_URL to $ZIPPATH"
if command -v curl >/dev/null 2>&1; then
  curl -L "$FORGE_MDK_URL" -o "$ZIPPATH"
elif command -v wget >/dev/null 2>&1; then
  wget "$FORGE_MDK_URL" -O "$ZIPPATH"
else
  echo "Neither curl nor wget available. Please download manually and place as $ZIPPATH"
  exit 1
fi

unzip -o "$ZIPPATH" -d "$DIR"

echo "MDK extracted to $DIR"
