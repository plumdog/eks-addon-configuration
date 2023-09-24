import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const AddonNavigation = ({ addons, onSelectAddon, selectedAddon }: { addons: Array<string> | null, onSelectAddon: Function, selectedAddon: string | null }) => {

  return (
      <Drawer variant="permanent" anchor="left" className="sidebar">
      { addons ? 
      <List>
        {addons.map((addon) => (
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
       : <p>Loading...</p> }
    </Drawer>
  );
};

export default AddonNavigation;
