package com.example.mcscaffold;

import net.minecraft.world.item.BlockItem;
import net.minecraft.world.item.Item;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraftforge.registries.RegistryObject;

public class ModBlocks {
    public static final RegistryObject<Block> EXAMPLE_BLOCK = MCScaffold.BLOCKS.register("example_block", () ->
        new Block(BlockBehaviour.Properties.of().strength(2.0F, 6.0F).requiresCorrectToolForDrops()));

    public static final RegistryObject<Item> EXAMPLE_BLOCK_ITEM = MCScaffold.ITEMS.register("example_block", () ->
        new BlockItem(EXAMPLE_BLOCK.get(), new Item.Properties()));
}
