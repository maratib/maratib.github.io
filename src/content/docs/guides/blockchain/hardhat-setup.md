---
title: Hardhat 3 Setup
description: Hardhat 3 Setup, VSCode test runner for hardhat 3
---

**Hardhat 3 setup** with [node:test runner](https://marketplace.visualstudio.com/items?itemName=connor4312.nodejs-testing) explorer in VSCode

```bash
# add hardhat alias as hh to .zshrc
alias hh="npx hardhat"
```

## 1. Create Hardhat 3 project

```bash

mkdir hardhat-example

cd hardhat-example

pnpm dlx hardhat --init

```

<details>
<summary>Hardhat options while initialization</summary>

```bash
👷 Welcome to Hardhat v3.0.9 👷

✔ Which version of Hardhat would you like to use? · hardhat-3
✔ Where would you like to initialize the project?

Please provide either a relative or an absolute path: · .
✔ What type of project would you like to initialize? · node-test-runner-viem
✨ Template files copied ✨
✔ You need to install the necessary dependencies using the following command:
pnpm add --save-dev "hardhat@^3.0.9" "@nomicfoundation/hardhat-toolbox-viem@^5.0.0" "@nomicfoundation/hardhat-ignition@^3.0.0" "@types/node@^22.8.5" "forge-std@foundry-rs/forge-std#v1.9.4" "typescript@~5.8.0" "viem@^2.30.0"

Do you want to run it now? (Y/n) · true

pnpm add --save-dev "hardhat@^3.0.9" "@nomicfoundation/hardhat-toolbox-viem@^5.0.0" "@nomicfoundation/hardhat-ignition@^3.0.0" "@types/node@^22.8.5" "forge-std@foundry-rs/forge-std#v1.9.4" "typescript@~5.8.0" "viem@^2.30.0"
```

</details>

## 2. Test setup for Hardhat 3 project

<br><br>

#### Add required VSCode extension for test explorer

- [node:test runner](https://marketplace.visualstudio.com/items?itemName=connor4312.nodejs-testing)

<br>

#### Add required settings in settings.json of VSCode

```json
{
  "nodejs-testing.extensions": [
    {
      "extensions": ["mjs", "cjs", "js"],
      "parameters": []
    },
    {
      "extensions": ["mts", "cts", "ts"],
      "parameters": ["--import", "tsx"]
    }
  ]
}
```

<br>

#### Add required dependencies

```bash
 pnpm add -D tsx

 # Don't forget to build before running tests using the explorer
 hh build

 #Run tests from command line
 hh test
```
