document.addEventListener('DOMContentLoaded', () => {
  initBlockly();

  document.getElementById('generateCodeBtn').addEventListener('click', () => {
    const output = buildModJavaFromBlocks();
    const codeOut = document.getElementById('codeOutput');
    codeOut.value = output;
  });

  document.getElementById('exportBtn').addEventListener('click', async () => {
    const modId = document.getElementById('modIdInput').value || 'mcscaffold';
    const files = buildModFilesFromBlocks(modId);
    const res = await window.modBuilder.saveProject({ files, modId });
    const log = document.getElementById('buildLog');
    if (res && res.ok) {
      log.textContent += '\nSaved project files to forge-mdk.';
    } else {
      log.textContent += '\nFailed to save project: ' + (res && res.message);
    }
  });

  document.getElementById('buildModBtn').addEventListener('click', () => {
    document.getElementById('buildLog').textContent = 'Starting Gradle build...\n';
    window.modBuilder.buildMod();
  });

  window.modBuilder.onBuildLog((message) => {
    const log = document.getElementById('buildLog');
    log.textContent += message;
    log.scrollTop = log.scrollHeight;
  });

  window.modBuilder.onBuildFinished((result) => {
    const log = document.getElementById('buildLog');
    log.textContent += '\nBuild finished. Exit code: ' + result.code + '\n';
  });
});
