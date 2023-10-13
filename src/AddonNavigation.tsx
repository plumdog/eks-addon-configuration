import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import type { Addon } from './dataSchemas';

const AddonNavigation = ({ addons, onSelectAddon, selectedAddon }: { addons: Array<Addon> | null, onSelectAddon: Function, selectedAddon: string | null }) => {

  const addonsByOwner: Record<string, Array<Addon>> = {};
  for (const addon of addons ?? []) {
      const owner: string = addon.owner;
      const group = addonsByOwner[owner] ?? [];
      group.push(addon);
      addonsByOwner[owner] = group;
  }

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
                {Object.entries(addonsByOwner).map(([ownerName, group]) => (
                    <div>
                        <ListSubheader key={ownerName}>{ownerName}</ListSubheader>
                        {(group ?? []).map((addon: Addon) => (
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
