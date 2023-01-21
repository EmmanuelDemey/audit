
# Audit

[![Actions Status](https://github.com/EmmanuelDemey/audit/workflows/Build/badge.svg)](https://github.com/EmmanuelDemey/audit/actions)

## Installation


```bash
git clone https://github.com/EmmanuelDemey/audit
cd audit 
npm install
```

## Usage/Examples

You have to define your settings in a YAML configuration file. 

```yaml
auditor:
  name: Emmanuel DEMEY
  email: demey.emmanuel@gmail.com

audit:
  path: ./
  urls:
    - http://localhost:3000

exporter: logger



```

And use this file thanks to the `--config` option. 

```shell
npx nx build cli
node dist/packages/cli/src/index.js --config ./demo/example.yaml
```

## Tech Stack

Typescript, Puppeteer, Github Actions, NX


## Authors

- [@EmmanuelDemey](https://www.github.com/EmmanuelDemey)

  
