function generateItemCode(block) {
  const name = block.getFieldValue('NAME') || 'example_item';
  const texture = block.getFieldValue('TEXTURE') || 'example_item';
  const tab = block.getFieldValue('TAB') || 'tools';
  const damage = Blockly.Java.valueToCode(block, 'DAMAGE', Blockly.Java.ORDER_ATOMIC) || '0';
  const durability = Blockly.Java.valueToCode(block, 'DURABILITY', Blockly.Java.ORDER_ATOMIC) || '100';

  return `
public static final RegistryObject<Item> ${toPascal(name)} = ITEMS.register("${name}", () ->
    new Item(new Item.Properties()
        .stacksTo(64)
        .durability(${durability})
        .rarity(Rarity.COMMON)));

@SubscribeEvent
public static void onRegisterItem(FMLCommonSetupEvent event) {
    // Generated texture: assets/mcscaffold/textures/item/${texture}.png
    // Creative tab: ${tab}
    // Base damage: ${damage}
}
`;
}

function generateBlockCode(block) {
  const name = block.getFieldValue('NAME') || 'example_block';
  const hardness = Blockly.Java.valueToCode(block, 'HARDNESS', Blockly.Java.ORDER_ATOMIC) || '2.0F';
  const resistance = Blockly.Java.valueToCode(block, 'RESISTANCE', Blockly.Java.ORDER_ATOMIC) || '6.0F';
  const tool = block.getFieldValue('TOOL') || 'pickaxe';

  return `
public static final RegistryObject<Block> ${toPascal(name)} = BLOCKS.register("${name}", () ->
    new Block(BlockBehaviour.Properties.of().strength(${hardness}, ${resistance}).requiresCorrectToolForDrops()));

public static final RegistryObject<Item> ${toPascal(name)}_ITEM = ITEMS.register("${name}", () ->
    new BlockItem(${toPascal(name)}.get(), new Item.Properties()));

public static void registerBlockDrop() {
    // Tool required: ${tool}
    // Generated block JSON in assets/mcscaffold/models/block/${name}.json
}
`;
}

function toPascal(value) {
  return value
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function buildModJavaFromBlocks() {
  const workspace = window.workspace;
  const blocks = workspace.getTopBlocks(true);
  const generated = [];

  generated.push('package com.example.mcscaffold;');
  generated.push('');
  generated.push('import net.minecraft.world.item.Item;');
  generated.push('import net.minecraft.world.item.BlockItem;');
  generated.push('import net.minecraft.world.level.block.Block;');
  generated.push('import net.minecraft.world.level.block.state.BlockBehaviour;');
  generated.push('import net.minecraftforge.eventbus.api.IEventBus;');
  generated.push('import net.minecraftforge.fml.common.Mod;');
  generated.push('import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;');
  generated.push('import net.minecraftforge.registries.DeferredRegister;');
  generated.push('import net.minecraftforge.registries.ForgeRegistries;');
  generated.push('import net.minecraftforge.registries.RegistryObject;');
  generated.push('');
  generated.push('@Mod("mcscaffold")');
  generated.push('public class MCScaffold {');
  generated.push('    public static final String MODID = "mcscaffold";');
  generated.push('    public static final DeferredRegister<Block> BLOCKS = DeferredRegister.create(ForgeRegistries.BLOCKS, MODID);');
  generated.push('    public static final DeferredRegister<Item> ITEMS = DeferredRegister.create(ForgeRegistries.ITEMS, MODID);');
  generated.push('');
  generated.push('    public MCScaffold() {');
  generated.push('        IEventBus bus = FMLJavaModLoadingContext.get().getModEventBus();');
  generated.push('        BLOCKS.register(bus);');
  generated.push('        ITEMS.register(bus);');
  generated.push('    }');
  generated.push('');

  for (const block of blocks) {
    const type = block.type;
    if (type === 'create_item') {
      generated.push(generateItemCode(block));
    }
    if (type === 'create_block') {
      generated.push(generateBlockCode(block));
    }
    if (type === 'recipe_craft') {
      generated.push('    // Crafting recipe generated for: ' + (block.getFieldValue('RESULT') || 'example_item'));
    }
    if (type === 'recipe_smelt') {
      generated.push('    // Smelting recipe generated for: ' + (block.getFieldValue('RESULT') || 'example_item'));
    }
  }

  generated.push('}');
  return generated.join('\n');
}
