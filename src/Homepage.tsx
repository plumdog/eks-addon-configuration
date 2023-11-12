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

### How to use this site

- Review the list of available EKS Addons in the left hand menu, and select the addon you are interested in
- Select the version of the addon you are interested in, probably the latest version unless you already have a version installed
- Review the JSON Schema for the configuration options
- Enter some configuration in the text area
- Click the "Validate" button to validate your configuration against the JSON schema
    - If it is not valid, you will be shown the errors
- Click the "Pretty" button to format your configuration
    - This is useful if you have pasted in some configuration that is not formatted nicely

<br />

### Notes

- All of the data on this site is retrieved from the AWS API.
- Any issues with the data on this site should be raised with the publisher of the EKS Addon.
    - Unless the data shown on this site does not match with the data returned from the AWS API in region us-east-1.
- You can review any of this configuration yourself using the AWS CLI: <code>aws eks describe-addon-configuration ...</code>
    - This is exactly how the information is sourced for this site, see [\`get_jsonschema.sh\`](https://github.com/plumdog/eks-addon-configuration/blob/main/scripts/get_jsonschema.sh).

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
