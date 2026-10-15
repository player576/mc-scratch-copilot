# mc-scratch-copilot

Electron + Blockly scaffold to generate Minecraft Forge 1.20.1 mod projects.

Usage:
1. Clone the repo and checkout branch feat/scratch-electron-modding.
2. npm install
3. npm run start (or double-click run.bat / run.sh)
4. Create items/blocks using the Blockly UI and press "Сгенерировать проект".
5. Optionally set FORGE_MDK_URL to the Forge MDK zip URL for 1.20.1 and run the download script to extract the MDK into the generated project folder. Then press "Собрать .jar" to run gradlew build.

Notes:
- This is an initial MVP scaffold. The code generator creates Java sources and resources into generated_projects/<modid>/. You need to merge those files into the official Forge MDK folder (or set FORGE_MDK_URL so the app can fetch the MDK automatically) to build the mod.

