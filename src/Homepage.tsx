import React from 'react';
import Box from '@mui/material/Box';
import { MuiMarkdown } from 'mui-markdown';

const homepageMd = `
## EKS Addon Configuration

<br />

---

<br />

EKS Addons have configuration that can be passed as JSON to the <code>configurationValues</code> argument. See:
                
https://docs.aws.amazon.com/eks/latest/APIReference/API_CreateAddon.html#AmazonEKS-CreateAddon-request-configurationValues

<br />

Documented here are the configuration options that can be passed to each. Many have quite involved JSON Schema, this site provides the option to validate your configuration against the schema. Some schemas for some versions of addons are not actually valid JSON Schema. I don't know how this manifests when passing options when creating the addon.

<br />

---

<br />

Source for this site is at https://github.com/plumdog/eks-addon-configuration
`;

const Homepage = () => {
    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <MuiMarkdown>{homepageMd}</MuiMarkdown>
        </Box>
    );
};

export default Homepage;
