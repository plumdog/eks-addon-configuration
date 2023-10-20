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

import {
    rootSchema,
    addonListSchema,
    addonSchema,
    addonVersionConfigurationSchema,
    Addon,
    AddonVersionConfiguration
} from './dataSchemas';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = rootSchema.parse(require('./data.json'));

const drawerWidth = 240;

const MainLayout = ({ children, sidebar }: {children: Array<React.ReactNode>, sidebar: React.ReactNode}) => {
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
    const addons: Array<Addon> = [];
    for (const addonName of addonListSchema.parse(data['./addons.json']).sort()) {
        addons.push(addonSchema.parse(data[`./${addonName}/addon.json`]));
    }

    const [selectedAddonName, setSelectedAddonName] = useState<string | null>(null);
    const [selectedAddonData, setSelectedAddonData] = useState<Addon | null>(null);
    const [selectedAddonVersion, setSelectedAddonVersion] = useState<string | null>(null);
    const [selectedAddonVersionConfiguration, setSelectedAddonVersionConfiguration] = useState<AddonVersionConfiguration | null>(null);

    useEffect(() => {
        if (selectedAddonName && !selectedAddonData) {
            const addonData = addonSchema.parse(data[`./${selectedAddonName}/addon.json`]);
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
            setSelectedAddonVersionConfiguration(addonVersionConfigurationSchema.parse(data[`./${selectedAddonName}/configurations/${selectedAddonVersion}.json`]));
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
}

export default App;
