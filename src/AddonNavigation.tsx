import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import type { Addon } from './dataSchemas';

interface AddonOwnerGroup {
    owner: string,
    addons: Array<Addon>,
}

const groupAddonsByOwner = (addons: Array<Addon>): Array<AddonOwnerGroup> => {

    const grouped: Record<string, Array<Addon>> = {};
    for (const addon of addons) {
        const owner: string = addon.owner;
        const group = grouped[owner] ?? [];
        group.push(addon);
        grouped[owner] = group;
    }

    const addonsByOwner: Array<AddonOwnerGroup> = [];
    for (const [groupName, addons] of Object.entries(grouped)) {
        addonsByOwner.push({
            owner: groupName,
            addons,
        });
    }

    addonsByOwner.sort((groupA: AddonOwnerGroup, groupB: AddonOwnerGroup): number => {
        if (groupA.owner === groupB.owner) {
            return 0;
        }
        return (groupA.owner < groupB.owner) ? -1 : 1;
    });

    return addonsByOwner;
};

const AddonNavigation = ({
    addons,
    onSelectAddon,
    selectedAddon,
}: {
    addons: Array<Addon> | null,
    onSelectAddon: (addonName: string | null) => void,
    selectedAddon: string | null,
}) => {
    const addonsByOwner = groupAddonsByOwner(addons ?? []);

    return (
        <Drawer variant="permanent" anchor="left" className="sidebar">
            <List>
                <ListItem
                    key="_home"
                    button
                    onClick={() => onSelectAddon(null)}
                >
                    <ListItemText primary="Home" />
                </ListItem>
                <Divider />
                {addonsByOwner.map((addonOwnerGroup) => (
                    <div key={addonOwnerGroup.owner}>
                        <ListSubheader key={addonOwnerGroup.owner}>{addonOwnerGroup.owner}</ListSubheader>
                        {(addonOwnerGroup.addons).map((addon: Addon) => (
                            <ListItem
                                key={addon.addonName}
                                button
                                selected={selectedAddon === addon.addonName}
                                onClick={() => onSelectAddon(addon.addonName)}
                            >
                                <ListItemText primary={addon.addonName} />
                            </ListItem>
                        ))}
                    </div>
                ))}
            </List>
        </Drawer>
    );
};

export default AddonNavigation;
