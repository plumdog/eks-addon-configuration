#!/bin/bash -e

export AWS_MAX_ATTEMPTS=10

script_dir="$(dirname "$(readlink -f "$0")")"
project_dir="$(dirname "$script_dir")"
data_dir="$project_dir/data/"

rm -rf "$data_dir"
mkdir -p "$data_dir"

addons="$(aws eks describe-addon-versions --region us-east-1 --query addons --output json)"

aws eks describe-addon-versions --region us-east-1 --query addons --output json | jq 'map(.addonName) | sort' > "$data_dir/addons.json"

function writeAddonVersionConfiguration() {
    addonName="$1"
    addonVersion="$2"
    configurationsDir="$3"
    aws eks describe-addon-configuration --region us-east-1 --addon-name "$addonName" --addon-version "$addonVersion" --query configurationSchema --output text | jq . > "$configurationsDir/$addonVersion.json"
}

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
        writeAddonVersionConfiguration "$addonName" "$addonVersion" "$configurationsDir" &
    done
done

while true; do
    jobs_remaining="$(jobs -r | wc -l)"
    if [[ $jobs_remaining == 0 ]]; then
        break
    fi

    echo "$jobs_remaining jobs remaining"
    sleep 1
    wait -n
done

wait

sleep 1

(cd "$data_dir" && find . -name '*.json' | LC_COLLATE=C LC_ALL=C sort | while read filepath; do >&2 echo "filepath: $filepath"; cat "$filepath" | jq --arg filepath "$filepath" '{$filepath: .}'; done | jq -s 'add' > data.json)
