import React from 'react';
import Box from '@mui/material/Box';
import { MuiMarkdown } from 'mui-markdown';

const homepageMd = `
EKS Addons have configuration that can be passed as JSON to the <code>configurationValues</code> argument. See:
                
https://docs.aws.amazon.com/eks/latest/APIReference/API_CreateAddon.html#AmazonEKS-CreateAddon-request-configurationValues

Documented here are the configuration options that can be passed to each.

Source for this site is at https://github.com/plumdog/eks-addon-configuration
`;

const Homepage = () => {
    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <MuiMarkdown>{homepageMd}</MuiMarkdown>
        </Box>
    );
}

export default Homepage;
