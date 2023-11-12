import React, { useState, useEffect } from 'react';
import AddonViewer from './AddonViewer';
import AddonNavigation from './AddonNavigation';
import AddonVersionNavigation from './AddonVersionNavigation';
import Homepage from './Homepage';
import useUrlState from '@ahooksjs/use-url-state';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import {
    Addon,
    AddonVersionConfiguration,
    getAddons,
    getAddon,
    getAddonVersionConfiguration,
} from './dataSchemas';

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

const theme = createTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff',
        },
    },
});

function App() {
    const addons = getAddons();

    const [searchParams, setSearchParams] = useUrlState<{addon?: string, version?: string}>({});
    const [selectedAddonData, setSelectedAddonData] = useState<Addon | null>(null);
    const [selectedAddonVersionConfiguration, setSelectedAddonVersionConfiguration] = useState<AddonVersionConfiguration | null>(null);

    useEffect(() => {
        if (searchParams.addon && !selectedAddonData) {
            const addonData = getAddon(searchParams.addon);
            setSelectedAddonData(addonData);
            if (!searchParams.version) {
                const firstVersion = addonData.addonVersions[0];
                if (firstVersion) {
                    setSearchParams({version: firstVersion.addonVersion});
                }
            }
        }
    }, [searchParams, selectedAddonData]);

    const handleAddonSelect = (addonName: string | null) => {
        setSelectedAddonData(null);
        setSearchParams({addon: addonName ?? undefined, version: undefined});
        setSelectedAddonVersionConfiguration(null);
    };

    const handleAddonVersionSelect = (addonVersion: string) => {
        setSearchParams({version: addonVersion});
        setSelectedAddonVersionConfiguration(null);
    };

    useEffect(() => {
        if (searchParams.addon && searchParams.version && !selectedAddonVersionConfiguration) {
            setSelectedAddonVersionConfiguration(getAddonVersionConfiguration(searchParams.addon, searchParams.version));
        }
    }, [searchParams, selectedAddonVersionConfiguration]);

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <MainLayout sidebar={
                    <AddonNavigation
                        addons={addons}
                        onSelectAddon={handleAddonSelect}
                        selectedAddon={searchParams.addon}
                    />
                }>
                    { !searchParams.addon && <Homepage /> }

                    { searchParams.addon && selectedAddonData &&
                      <AddonVersionNavigation
                          addon={selectedAddonData}
                          onSelectAddonVersion={handleAddonVersionSelect}
                          selectedAddonVersion={searchParams.version}
                      /> }

                    { searchParams.addon && selectedAddonData && <AddonViewer data={selectedAddonData} selectedAddonVersion={searchParams.version} selectedAddonVersionConfiguration={selectedAddonVersionConfiguration} /> }

                </MainLayout>
            </ThemeProvider>

        </div>
    );
}

export default App;
