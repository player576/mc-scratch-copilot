Blockly.Blocks['create_item'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Create item')
      .appendField(new Blockly.FieldTextInput('example_item'), 'NAME');
    this.appendDummyInput()
      .appendField('Texture')
      .appendField(new Blockly.FieldTextInput('example_item'), 'TEXTURE');
    this.appendDummyInput()
      .appendField('Tab')
      .appendField(new Blockly.FieldDropdown([['Combat','combat'], ['Decorations','decor'], ['Tools','tools']]), 'TAB');
    this.appendValueInput('DAMAGE').setCheck('Number').appendField('Damage');
    this.appendValueInput('DURABILITY').setCheck('Number').appendField('Durability');
    this.setColour('#FF7F50');
    this.setTooltip('Create a new item for the mod');
    this.setHelpUrl('');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['create_block'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Create block')
      .appendField(new Blockly.FieldTextInput('example_block'), 'NAME');
    this.appendValueInput('HARDNESS').setCheck('Number').appendField('Hardness');
    this.appendValueInput('RESISTANCE').setCheck('Number').appendField('Blast Resistance');
    this.appendDummyInput()
      .appendField('Tool')
      .appendField(new Blockly.FieldDropdown([['Pickaxe','pickaxe'], ['Axe','axe'], ['Shovel','shovel']]), 'TOOL');
    this.setColour('#40C4FF');
    this.setTooltip('Create a block with custom properties');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['recipe_craft'] = {
  init: function () {
    this.appendDummyInput().appendField('Crafting recipe');
    this.appendDummyInput().appendField(new Blockly.FieldTextInput('example_item'), 'RESULT');
    this.appendDummyInput().appendField(new Blockly.FieldTextInput('minecraft:diamond'), 'INGREDIENT');
    this.setColour('#FFD54F');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['recipe_smelt'] = {
  init: function () {
    this.appendDummyInput().appendField('Smelting recipe');
    this.appendDummyInput().appendField(new Blockly.FieldTextInput('example_item'), 'RESULT');
    this.appendDummyInput().appendField(new Blockly.FieldTextInput('minecraft:iron_ore'), 'SOURCE');
    this.setColour('#FFD54F');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['event_click'] = {
  init: function () {
    this.appendDummyInput().appendField('When block is clicked');
    this.appendStatementInput('DO');
    this.setColour('#81C784');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['event_item_use'] = {
  init: function () {
    this.appendDummyInput().appendField('When item used');
    this.appendStatementInput('DO');
    this.setColour('#81C784');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['event_entity_hit'] = {
  init: function () {
    this.appendDummyInput().appendField('When entity hit');
    this.appendStatementInput('DO');
    this.setColour('#81C784');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['item_damage'] = {
  init: function () {
    this.appendDummyInput().appendField('Item damage');
    this.appendValueInput('VALUE').setCheck('Number');
    this.setColour('#FF7F50');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['block_break'] = {
  init: function () {
    this.appendDummyInput().appendField('Block break');
    this.appendValueInput('DROP').setCheck('String');
    this.setColour('#40C4FF');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['entity_hit'] = {
  init: function () {
    this.appendDummyInput().appendField('Entity hit event');
    this.appendDummyInput().appendField(new Blockly.FieldTextInput('minecraft:zombie'), 'TARGET');
    this.setColour('#B39DDB');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['entity_spawn'] = {
  init: function () {
    this.appendDummyInput().appendField('Spawn entity');
    this.appendDummyInput().appendField(new Blockly.FieldTextInput('minecraft:sheep'), 'ENTITY');
    this.setColour('#B39DDB');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};
