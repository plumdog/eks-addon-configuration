import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import type { Addon, AddonVersionConfiguration } from './dataSchemas';

const AddonViewer = ({ data, selectedAddonVersion, selectedAddonVersionConfiguration }: { data: Addon, selectedAddonVersion: string | null, selectedAddonVersionConfiguration: AddonVersionConfiguration }) => {

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
                    <pre>{ JSON.stringify(selectedAddonVersionConfiguration, null, 2) }</pre>
                </Box>
            </div>
            }
        </Box>
    );
};

export default AddonViewer;
