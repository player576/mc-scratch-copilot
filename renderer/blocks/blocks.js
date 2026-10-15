(function(){
  // Define a minimal set of blocks for items, blocks and events
  const { Blockly } = window;

  Blockly.defineBlocksWithJsonArray([
    {
      "type": "create_item",
      "message0": "Create Item id %1 name %2 texture %3",
      "args0": [
        {"type":"field_input","name":"ID","text":"my_item"},
        {"type":"field_input","name":"NAME","text":"My Item"},
        {"type":"field_input","name":"TEXTURE","text":"textures/item/my_item.png"}
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 230,
      "tooltip": "Create a simple item",
      "helpUrl": ""
    },
    {
      "type": "create_block",
      "message0": "Create Block id %1 hardness %2 resistance %3",
      "args0": [
        {"type":"field_input","name":"ID","text":"my_block"},
        {"type":"field_number","name":"HARDNESS","value":1},
        {"type":"field_number","name":"RES","value":10}
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 160
    },
    {
      "type": "on_item_use",
      "message0": "On item use item %1 do %2",
      "args0": [
        {"type":"field_input","name":"ITEM","text":"my_item"},
        {"type":"input_statement","name":"DO"}
      ],
      "colour": 20
    }
  ]);

  // Simple JS generator that produces an intermediate JSON representation
  Blockly.JavaScript['create_item'] = function(block) {
    const id = block.getFieldValue('ID');
    const name = block.getFieldValue('NAME');
    const tex = block.getFieldValue('TEXTURE');
    return `__CREATE_ITEM(${JSON.stringify({id,name,tex})});\n`;
  };
  Blockly.JavaScript['create_block'] = function(block) {
    const id = block.getFieldValue('ID');
    const hardness = block.getFieldValue('HARDNESS');
    const res = block.getFieldValue('RES');
    return `__CREATE_BLOCK(${JSON.stringify({id,hardness,res})});\n`;
  };
  Blockly.JavaScript['on_item_use'] = function(block) {
    const item = block.getFieldValue('ITEM');
    const statements = Blockly.JavaScript.statementToCode(block, 'DO');
    return `__ON_ITEM_USE(${JSON.stringify({item,code:statements})});\n`;
  };
})();
