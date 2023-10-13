import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const AddonNavigation = ({ addons, onSelectAddon, selectedAddon }: { addons: Array<string> | null, onSelectAddon: Function, selectedAddon: string | null }) => {

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
        {(addons ?? []) .map((addon) => (
          <ListItem
            key={addon}
            button
            selected={selectedAddon === addon}
            onClick={() => onSelectAddon(addon)}
          >
            <ListItemText primary={addon} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default AddonNavigation;
