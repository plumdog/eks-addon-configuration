#!/bin/bash -e

script_dir="$(dirname "$(readlink -f "$0")")"
project_dir="$(dirname "$script_dir")"
data_dir="$project_dir/data/"
mkdir -p "$data_dir"

addons="$(aws eks describe-addon-versions --region us-east-1 --query addons --output json)"

aws eks describe-addon-versions --region us-east-1 --query addons --output json | jq 'map(.addonName)' > "$data_dir/addons.json"

for addonBase64 in $(echo "$addons" | jq -r '.[] | @base64'); do
    addon="$(echo "$addonBase64" | base64 --decode | jq .)"
    addonName="$(echo "$addon" | jq -r '.addonName')"
    addonDir="$data_dir/$addonName/"
    mkdir -p "$addonDir"
    echo "$addon" > "$addonDir/addon.json"

    configurationsDir="$addonDir/configurations"
    mkdir -p "$configurationsDir"

    for addonVersionBase64 in $(echo "$addon" | jq -r '.addonVersions[] | .addonVersion | @base64'); do
        addonVersion="$(echo "$addonVersionBase64" | base64 -d)"
        aws eks describe-addon-configuration --region us-east-1 --addon-name "$addonName" --addon-version "$addonVersion" --query configurationSchema --output text | jq . > "$configurationsDir/$addonVersion.json"
    done
done
