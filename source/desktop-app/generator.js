// Improved generator that produces more complete Java classes and resource files, including base64 PNG placeholders

// Helper: convert to Title Case
function toTitle(name) {
  return name
    .split(/[_\-\s]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function safeConst(name) {
  return name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
}

function buildModJavaFromBlocks() {
  // This function produces a main MCScaffold.java with DeferredRegister setup
  const modId = (document.getElementById('modIdInput') && document.getElementById('modIdInput').value) || 'mcscaffold';
  const pkg = 'com.example.' + modId;
  const className = toPascal(modId === 'mcscaffold' ? 'mcscaffold' : modId);

  const header = [];
  header.push('package ' + pkg + ';');
  header.push('');
  header.push('import net.minecraft.world.item.Item;');
  header.push('import net.minecraft.world.level.block.Block;');
  header.push('import net.minecraftforge.eventbus.api.IEventBus;');
  header.push('import net.minecraftforge.fml.common.Mod;');
  header.push('import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;');
  header.push('import net.minecraftforge.registries.DeferredRegister;');
  header.push('import net.minecraftforge.registries.ForgeRegistries;');
  header.push('import net.minecraftforge.registries.RegistryObject;');
  header.push('');
  header.push('@Mod("' + modId + '")');
  header.push('public class ' + className + ' {');
  header.push('    public static final String MODID = "' + modId + '";');
  header.push('    public static final DeferredRegister<Block> BLOCKS = DeferredRegister.create(ForgeRegistries.BLOCKS, MODID);');
  header.push('    public static final DeferredRegister<Item> ITEMS = DeferredRegister.create(ForgeRegistries.ITEMS, MODID);');
  header.push('');
  header.push('    public ' + className + '() {');
  header.push('        IEventBus bus = FMLJavaModLoadingContext.get().getModEventBus();');
  header.push('        BLOCKS.register(bus);');
  header.push('        ITEMS.register(bus);');
  header.push('    }');
  header.push('');
  header.push('}');

  return header.join('\n');
}

function toPascal(value) {
  return value
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// Build a collection of files ready to be written into the forge-mdk folder
function buildModFilesFromBlocks(modId) {
  const workspace = window.workspace;
  const blocks = workspace.getTopBlocks(true);
  const files = [];

  const pkg = 'com.example.' + modId;
  const packagePath = pkg.replace(/\./g, '/');

  // Main mod class
  const mainJava = buildModJavaFromBlocks();
  files.push({ path: `src/main/java/${packagePath}/${toPascal(modId)}.java`, content: mainJava });

  // Collect items and blocks
  const items = [];
  const blockDefs = [];
  const recipes = [];

  for (const b of blocks) {
    if (b.type === 'create_item') {
      const name = b.getFieldValue('NAME') || 'example_item';
      items.push({ name });
    }
    if (b.type === 'create_block') {
      const name = b.getFieldValue('NAME') || 'example_block';
      blockDefs.push({ name });
    }
    if (b.type === 'recipe_craft') {
      recipes.push({ result: b.getFieldValue('RESULT') || 'example_item', ingredient: b.getFieldValue('INGREDIENT') || 'minecraft:diamond' });
    }
    if (b.type === 'recipe_smelt') {
      recipes.push({ result: b.getFieldValue('RESULT') || 'example_item', source: b.getFieldValue('SOURCE') || 'minecraft:iron_ore', smelt: true });
    }
  }

  // Generate ModItems.java
  let itemsCode = `package ${pkg};\n\n`;
  itemsCode += 'import net.minecraft.world.item.Item;\n';
  itemsCode += 'import net.minecraftforge.registries.RegistryObject;\n\n';
  itemsCode += 'public class ModItems {\n';
  itemsCode += '    private ModItems() {}\n\n';
  for (const it of items) {
    const constName = safeConst(it.name);
    itemsCode += `    public static final RegistryObject<Item> ${constName} = ${toPascal(modId)}.ITEMS.register("${it.name}", () -> new Item(new Item.Properties()));\n`;
  }
  itemsCode += '}\n';
  files.push({ path: `src/main/java/${packagePath}/ModItems.java`, content: itemsCode });

  // Generate ModBlocks.java
  let blocksCode = `package ${pkg};\n\n`;
  blocksCode += 'import net.minecraft.world.item.BlockItem;\n';
  blocksCode += 'import net.minecraft.world.item.Item;\n';
  blocksCode += 'import net.minecraft.world.level.block.Block;\n';
  blocksCode += 'import net.minecraft.world.level.block.state.BlockBehaviour;\n';
  blocksCode += 'import net.minecraftforge.registries.RegistryObject;\n\n';
  blocksCode += 'public class ModBlocks {\n';
  blocksCode += '    private ModBlocks() {}\n\n';
  for (const bl of blockDefs) {
    const constName = safeConst(bl.name);
    blocksCode += `    public static final RegistryObject<Block> ${constName} = ${toPascal(modId)}.BLOCKS.register("${bl.name}", () -> new Block(BlockBehaviour.Properties.of().strength(2.0F, 6.0F).requiresCorrectToolForDrops()));\n`;
    blocksCode += `    public static final RegistryObject<Item> ${constName}_ITEM = ${toPascal(modId)}.ITEMS.register("${bl.name}", () -> new BlockItem(${constName}.get(), new Item.Properties()));\n`;
  }
  blocksCode += '}\n';
  files.push({ path: `src/main/java/${packagePath}/ModBlocks.java`, content: blocksCode });

  // Resources generation
  const enUs = {};

  // Base64 1x1 PNG placeholder (transparent)
  const placeholderPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

  for (const it of items) {
    enUs[`item.${modId}.${it.name}`] = toTitle(it.name);
    const itemModel = { parent: 'item/generated', textures: { layer0: `"${'${'}' /* placeholder to avoid template issue */ }` } };
    // Simpler model
    const itemModelSimple = { parent: 'item/generated', textures: { layer0: `"${'PLACEHOLDER'}"` } };
    // Write model file (use correct path referencing textures)
    const modelContent = { parent: 'item/generated', textures: { layer0: `${modId}:item/${it.name}` } };
    files.push({ path: `src/main/resources/assets/${modId}/models/item/${it.name}.json`, content: JSON.stringify(modelContent, null, 2) });
    // Add texture PNG as base64 encoding
    files.push({ path: `src/main/resources/assets/${modId}/textures/item/${it.name}.png`, content: placeholderPng, encoding: 'base64' });
  }

  for (const bl of blockDefs) {
    enUs[`block.${modId}.${bl.name}`] = toTitle(bl.name);
    const blockModel = { parent: 'block/cube_all', textures: { all: `${modId}:block/${bl.name}` } };
    files.push({ path: `src/main/resources/assets/${modId}/models/block/${bl.name}.json`, content: JSON.stringify(blockModel, null, 2) });
    const blockItemModel = { parent: `${modId}:block/${bl.name}` };
    files.push({ path: `src/main/resources/assets/${modId}/models/item/${bl.name}.json`, content: JSON.stringify(blockItemModel, null, 2) });
    files.push({ path: `src/main/resources/assets/${modId}/textures/block/${bl.name}.png`, content: placeholderPng, encoding: 'base64' });
  }

  files.push({ path: `src/main/resources/assets/${modId}/lang/en_us.json`, content: JSON.stringify(enUs, null, 2) });

  // recipes
  for (const r of recipes) {
    if (r.smelt) {
      const recipe = { type: 'minecraft:smelting', ingredient: { item: r.source }, result: `${modId}:${r.result}`, experience: 0.7, cookingtime: 200 };
      files.push({ path: `src/main/resources/data/${modId}/recipes/${r.result}_smelt.json`, content: JSON.stringify(recipe, null, 2) });
    } else {
      const recipe = { type: 'minecraft:crafting_shaped', pattern: ['XXX','XXX','XXX'], key: { X: { item: r.ingredient } }, result: { item: `${modId}:${r.result}`, count: 1 } };
      files.push({ path: `src/main/resources/data/${modId}/recipes/${r.result}_recipe.json`, content: JSON.stringify(recipe, null, 2) });
    }
  }

  // mods.toml
  const modsToml = `modLoader=\"forge\"\nloaderVersion=\"[47,)\"\nlicense=\"MIT\"\n[[mods]]\nmodId=\"${modId}\"\nversion=\"1.0.0\"\ndisplayName=\"${toTitle(modId)}\"\nlogoFile=\"icon.png\"\ncredits=\"MC Scratch Copilot\"\nauthors=\"Player576\"\ndescription=\"Scratch-style mod built from blocks by MC Scratch Copilot\"\n`;
  files.push({ path: 'src/main/resources/META-INF/mods.toml', content: modsToml });

  return files;
}

// Small helper to convert to PascalCase for class names
function toPascal(v) {
  return v.split(/[_\-\s]+/).map(p=>p.charAt(0).toUpperCase()+p.slice(1)).join('');
}
