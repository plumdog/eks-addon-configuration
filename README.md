# eks-addon-configuration
EKS Addons configuration, readable by humans

Hosted at https://www.plumdog.co.uk/eks-addon-configuration/

## Development

Built with Vite (see [vite.config.mts](vite.config.mts)).

```sh
npm install
npm start        # dev server at http://localhost:3000/eks-addon-configuration/
npm run build    # production build into build/
npm test         # vitest, single run
npm run lint
npm run typecheck
```

`src/data.json` is a symlink to `data/data.json`, which is regenerated daily by
[scripts/get_jsonschema.sh](scripts/get_jsonschema.sh) via GitHub Actions.
