import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type { Addon } from './dataSchemas';

const AddonVersionNavigation = ({ addon, onSelectAddonVersion, selectedAddonVersion }: { addon: Addon, onSelectAddonVersion: Function, selectedAddonVersion: string | null }) => {
  const handleAddonVersionSelect = (addonVersionName: string) => {
    onSelectAddonVersion(addonVersionName);
  };

  const addonVersions = [];
  for (const version of addon.addonVersions ?? []) {
      addonVersions.push(version.addonVersion);
  }

  return (
      <Box sx={{ minWidth: 120 }}>
      <FormControl>
        <InputLabel>Version</InputLabel>
        <Select
          value={selectedAddonVersion}
          label="Version"
          onChange={(event) => {
              handleAddonVersionSelect(event.target.value ?? '')
          }}
        >
          {(addonVersions ?? []).map((addonVersion) => (
              <MenuItem value={addonVersion}>{addonVersion}</MenuItem>
          )) }
        </Select>
      </FormControl>
    </Box>
  );
};

export default AddonVersionNavigation;
