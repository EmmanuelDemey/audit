
# Audit

[![Actions Status](https://github.com/EmmanuelDemey/audit/workflows/Build/badge.svg)](https://github.com/EmmanuelDemey/audit/actions)

## Installation


```bash
git clone https://github.com/EmmanuelDemey/audit
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

And use this file thankt to the `--config` option. 

```shell
npm run start -- --config config.yaml
```

## Tech Stack

Typescript, Puppeteer, Github Actions


## Authors

- [@EmmanuelDemey](https://www.github.com/EmmanuelDemey)

  
