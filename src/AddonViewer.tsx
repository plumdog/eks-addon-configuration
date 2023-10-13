import React from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import type { Addon, AddonVersionConfiguration } from './dataSchemas';

const AddonViewer = ({ addonName, data, selectedAddonVersion, selectedAddonVersionConfiguration }: { addonName: string, data: Addon, selectedAddonVersion: string | null, selectedAddonVersionConfiguration: AddonVersionConfiguration }) => {

  const [tab, setTab] = React.useState('1');

  const handleChangeTab = (event: unknown, newValue: string) => {
      setTab(newValue);
  };

  return (
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Typography variant="h2">
          { data.addonName }
        </Typography>
        <List>
          <ListItem>
            Type: { data.type }
          </ListItem>
          <ListItem>
            Publisher: { data.publisher }
          </ListItem>
          <ListItem>
            Owner: { data.owner }
          </ListItem>
        </List>
        <Divider />

      { selectedAddonVersion && selectedAddonVersionConfiguration && <div>
          <p>Version: { selectedAddonVersion }</p>

        <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label="JSONSchema" value="1" />
            <Tab label="Human" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <pre>{ JSON.stringify(selectedAddonVersionConfiguration, null, 2) }</pre>
        </TabPanel>
          <TabPanel value="2">TODO</TabPanel>
      </TabContext>
    </Box>
          </div>
          }
      </Box>
  );
};

export default AddonViewer;
