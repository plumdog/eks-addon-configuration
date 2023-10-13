import React, { useState, useEffect } from 'react';
import AddonViewer from './AddonViewer';
import AddonNavigation from './AddonNavigation';
import AddonVersionNavigation from './AddonVersionNavigation';
import Homepage from './Homepage';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const data = require("./data.json");

const drawerWidth = 240;

const MainLayout = ({ children, sidebar }: {children: any, sidebar: any}) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            EKS Addon Configuration
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        { sidebar }
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        { children }
      </Box>
    </Box>
  );
};

function App() {
    const addons = [];
    for (const addonName of data["./addons.json"].sort()) {
        addons.push(data[`./${addonName}/addon.json`]);
    }

    const [selectedAddonName, setSelectedAddonName] = useState<string | null>(null);
    const [selectedAddonData, setSelectedAddonData] = useState<any | null>(null);
    const [selectedAddonVersion, setSelectedAddonVersion] = useState<string | null>(null);
    const [selectedAddonVersionConfiguration, setSelectedAddonVersionConfiguration] = useState<any | null>(null);    

    useEffect(() => {
        if (selectedAddonName && !selectedAddonData) {
            const addonData = data[`./${selectedAddonName}/addon.json`];
            setSelectedAddonData(addonData);
            if (!selectedAddonVersion) {
                const firstVersion = addonData.addonVersions[0];
                if (firstVersion) {
                    setSelectedAddonVersion(firstVersion.addonVersion);
                }
            }
        }
    }, [selectedAddonName, selectedAddonData, selectedAddonVersion]);

    const handleAddonSelect = (addonName: string) => {
        setSelectedAddonData(null);
        setSelectedAddonVersion(null);
        setSelectedAddonVersionConfiguration(null);
        setSelectedAddonName(addonName);
    };

    const handleAddonVersionSelect = (addonVersion: string) => {
        setSelectedAddonVersion(addonVersion);
        setSelectedAddonVersionConfiguration(null);
    };

    useEffect(() => {
        if (selectedAddonName && selectedAddonVersion && !selectedAddonVersionConfiguration) {
            setSelectedAddonVersionConfiguration(data[`./${selectedAddonName}/configurations/${selectedAddonVersion}.json`]);
        }
    }, [selectedAddonName, selectedAddonVersion, selectedAddonVersionConfiguration]);

    return (
        <div className="App">
            <MainLayout sidebar={<AddonNavigation
                addons={addons}
                onSelectAddon={handleAddonSelect}
                selectedAddon={selectedAddonName}
            />}>
            { !selectedAddonName && <Homepage /> }

            { selectedAddonName && selectedAddonData && <AddonVersionNavigation
                addon={selectedAddonData}
                onSelectAddonVersion={handleAddonVersionSelect}
                selectedAddonVersion={selectedAddonVersion}
            /> }

            { selectedAddonName && selectedAddonData && <AddonViewer data={selectedAddonData} addonName={selectedAddonName} selectedAddonVersion={selectedAddonVersion} selectedAddonVersionConfiguration={selectedAddonVersionConfiguration} /> }

        </MainLayout>
            
        </div>
    );
};

export default App;
