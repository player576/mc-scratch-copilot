function initBlockly() {
  const workspace = Blockly.inject('blocklyDiv', {
    toolbox: `
      <xml id="toolbox" style="display:none">
        <category name="Items" colour="#FF7F50">
          <block type="create_item"></block>
          <block type="item_damage"></block>
        </category>
        <category name="Blocks" colour="#40C4FF">
          <block type="create_block"></block>
          <block type="block_break"></block>
        </category>
        <category name="Entities" colour="#B39DDB">
          <block type="entity_hit"></block>
          <block type="entity_spawn"></block>
        </category>
        <category name="Recipes" colour="#FFD54F">
          <block type="recipe_craft"></block>
          <block type="recipe_smelt"></block>
        </category>
        <category name="Events" colour="#81C784">
          <block type="event_click"></block>
          <block type="event_item_use"></block>
          <block type="event_entity_hit"></block>
        </category>
      </xml>
    `,
    grid: { spacing: 20, length: 3, colour: '#d7dceb', snap: true },
    zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 2, minScale: 0.5 },
    trashcan: true
  });

  window.workspace = workspace;
  window.sourceBlocks = workspace;
}

function getBlocklyXml() {
  const xml = Blockly.Xml.workspaceToDom(window.workspace);
  return Blockly.Xml.domToPrettyText(xml);
}

document.addEventListener('DOMContentLoaded', () => {
  initBlockly();

  document.getElementById('generateCodeBtn').addEventListener('click', () => {
    const output = buildModJavaFromBlocks();
    const codeOut = document.getElementById('codeOutput');
    codeOut.value = output;
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
