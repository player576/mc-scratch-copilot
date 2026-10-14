# MC Scratch Copilot

Scratch-like desktop constructor for Minecraft Forge 1.20.1.

This repository contains:
- `source/` project scaffold with an Electron desktop editor
- `source/forge-mdk/` Forge 1.20.1 MDK-style structure
- `run.bat` and `run.sh` startup scripts
- the root-level MDK zip provided by the user

## Quick start

Windows:
```bat
run.bat
```

Linux/macOS:
```bash
chmod +x run.sh
./run.sh
```

## Notes
- The visual editor is built around Blockly and a Scratch-inspired UX.
- Generated code targets Forge 1.20.1 Java classes.
- The app includes a "Build Mod (.jar)" button that runs Gradle in the Forge MDK folder.
