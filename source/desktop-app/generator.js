// New function to build file list for saving to MDK
function buildModFilesFromBlocks(modId) {
  const workspace = window.workspace;
  const blocks = workspace.getTopBlocks(true);
  const files = [];

  // Use the same generated Java for MCScaffold.java
  const mainJava = buildModJavaFromBlocks();
  const packagePath = 'com/example/mcscaffold';

  files.push({ path: `src/main/java/${packagePath}/MCScaffold.java`, content: mainJava });

  // Create ModItems and ModBlocks from top blocks
  let itemsCode = 'package com.example.mcscaffold;\n\nimport net.minecraft.world.item.Item;\nimport net.minecraftforge.registries.RegistryObject;\n\npublic class ModItems {\n';
  let blocksCode = 'package com.example.mcscaffold;\n\nimport net.minecraft.world.item.BlockItem;\nimport net.minecraft.world.item.Item;\nimport net.minecraft.world.level.block.Block;\nimport net.minecraftforge.registries.RegistryObject;\n\npublic class ModBlocks {\n';

  for (const block of blocks) {
    if (block.type === 'create_item') {
      const name = block.getFieldValue('NAME') || 'example_item';
      const constName = name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
      itemsCode += `    public static final RegistryObject<Item> ${constName} = MCScaffold.ITEMS.register("${name}", () -> new Item(new Item.Properties()));\n`;
    }
    if (block.type === 'create_block') {
      const name = block.getFieldValue('NAME') || 'example_block';
      const constName = name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
      blocksCode += `    public static final RegistryObject<Block> ${constName} = MCScaffold.BLOCKS.register("${name}", () -> new Block(BlockBehaviour.Properties.of().strength(2.0F, 6.0F).requiresCorrectToolForDrops()));\n`;
      blocksCode += `    public static final RegistryObject<Item> ${constName}_ITEM = MCScaffold.ITEMS.register("${name}", () -> new BlockItem(${constName}.get(), new Item.Properties()));\n`;
    }
  }

  itemsCode += '}\n';
  blocksCode += '}\n';

  files.push({ path: `src/main/java/${packagePath}/ModItems.java`, content: itemsCode });
  files.push({ path: `src/main/java/${packagePath}/ModBlocks.java`, content: blocksCode });

  // Resources: lang, models placeholders
  const enUs = {};
  for (const block of blocks) {
    if (block.type === 'create_item') {
      const name = block.getFieldValue('NAME') || 'example_item';
      enUs[`item.${modId}.${name}`] = toTitle(name);
      // item model
      const itemModel = {
        parent: 'item/generated',
        textures: { layer0: ` ${"assets/" + modId + "/textures/item/"}${name}.png` }
      };
      files.push({ path: `src/main/resources/assets/${modId}/models/item/${name}.json`, content: JSON.stringify(itemModel, null, 2) });
    }
    if (block.type === 'create_block') {
      const name = block.getFieldValue('NAME') || 'example_block';
      enUs[`block.${modId}.${name}`] = toTitle(name);
      const blockModel = {
        parent: 'block/cube_all',
        textures: { all: ` ${"assets/" + modId + "/textures/block/"}${name}.png` }
      };
      files.push({ path: `src/main/resources/assets/${modId}/models/block/${name}.json`, content: JSON.stringify(blockModel, null, 2) });
      // block item model
      const blockItemModel = {
        parent: ` ${"assets/" + modId + "/models/block/"}${name}`
      };
      files.push({ path: `src/main/resources/assets/${modId}/models/item/${name}.json`, content: JSON.stringify(blockItemModel, null, 2) });
    }
  }

  // lang file
  files.push({ path: `src/main/resources/assets/${modId}/lang/en_us.json`, content: JSON.stringify(enUs, null, 2) });

  // mods.toml will be updated to set modId
  const modsToml = `modLoader=\"forge\"\nloaderVersion=\"[47,)\"\nlicense=\"MIT\"\n[[mods]]\nmodId=\"${modId}\"\nversion=\"1.0.0\"\ndisplayName=\"MC Scaffold\"\nlogoFile=\"icon.png\"\ncredits=\"MC Scratch Copilot\"\nauthors=\"Player576\"\ndescription=\"Scratch-style mod builder for Forge 1.20.1.\"\n`;
  files.push({ path: 'src/main/resources/META-INF/mods.toml', content: modsToml });

  // simple example recipe if any recipe blocks exist
  for (const block of blocks) {
    if (block.type === 'recipe_craft') {
      const result = block.getFieldValue('RESULT') || 'example_item';
      const recipe = {
        type: 'minecraft:crafting_shaped',
        pattern: ['XXX', 'XXX', 'XXX'],
        key: { X: { item: block.getFieldValue('INGREDIENT') || 'minecraft:diamond' } },
        result: { item: `${modId}:${result}`, count: 1 }
      };
      files.push({ path: `src/main/resources/data/${modId}/recipes/${result}_recipe.json`, content: JSON.stringify(recipe, null, 2) });
    }
    if (block.type === 'recipe_smelt') {
      const result = block.getFieldValue('RESULT') || 'example_item';
      const recipe = {
        type: 'minecraft:smelting',
        ingredient: { item: block.getFieldValue('SOURCE') || 'minecraft:iron_ore' },
        result: `${modId}:${result}`,
        experience: 0.7,
        cookingtime: 200
      };
      files.push({ path: `src/main/resources/data/${modId}/recipes/${result}_smelt.json`, content: JSON.stringify(recipe, null, 2) });
    }
  }

  return files;
}
