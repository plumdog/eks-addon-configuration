import {
    getAddons,
    getAddon,
    getAddonVersionConfiguration,
} from './dataSchemas';


test('check', () => {
    const addonVersionCount: Record<string, number> = {};
    for (const addon of getAddons()) {
        addonVersionCount[addon.addonName] = 0;
        getAddon(addon.addonName);
        for (const addonVersion of addon.addonVersions) {
            getAddonVersionConfiguration(addon.addonName, addonVersion.addonVersion);
            addonVersionCount[addon.addonName] += 1;
        }
    }

    console.log(JSON.stringify(addonVersionCount, null, 4));

    expect(Object.keys(addonVersionCount).length).toBeGreaterThan(0);
});
