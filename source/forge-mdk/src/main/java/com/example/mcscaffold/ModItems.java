package com.example.mcscaffold;

import net.minecraft.world.item.Item;
import net.minecraftforge.registries.RegistryObject;

public class ModItems {
    public static final RegistryObject<Item> EXAMPLE_ITEM = MCScaffold.ITEMS.register("example_item", () ->
        new Item(new Item.Properties()));
}
