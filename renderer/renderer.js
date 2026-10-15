window.addEventListener('DOMContentLoaded', () => {
  const toolbox = {
    "kind": "flyoutToolbox",
    "contents": [
      {"kind":"block","type":"create_item"},
      {"kind":"block","type":"create_block"},
      {"kind":"block","type":"on_item_use"}
    ]
  };

  const workspace = Blockly.inject('blocklyDiv', { toolbox, renderer: 'geras' });
  window.workspace = workspace;

  document.getElementById('generate').addEventListener('click', async () => {
    const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    const modid = document.getElementById('modid').value || 'mc_scratch_mod';
    const modname = document.getElementById('modname').value || 'ScratchMod';
    const res = await window.electronAPI.generateProject(xml, { modid, modname });
    const log = document.getElementById('log');
    if (res.ok) {
      log.textContent += '\nProject generated at: ' + res.out.projectPath + '\n';
      log.textContent += 'You can now press Build to create the .jar.\n';
      // save last project path
      window.lastProject = res.out.projectPath;
    } else {
      log.textContent += '\nError: ' + res.error + '\n';
    }
  });

  document.getElementById('build').addEventListener('click', async () => {
    const log = document.getElementById('log');
    const projectPath = window.lastProject;
    if (!projectPath) { log.textContent += '\nGenerate a project first.\n'; return; }
    log.textContent += '\nStarting build...\n';
    window.electronAPI.onBuildLog((d) => { log.textContent += d; });
    const res = await window.electronAPI.buildMod(projectPath);
    if (res.code === 0) {
      log.textContent += '\nBuild finished. Check build/libs in project folder.\n';
    } else {
      log.textContent += '\nBuild failed. See log above.\n';
    }
  });
});
