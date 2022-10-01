const {promisify} = require("util");
const exec = promisify(require("child_process").exec);

const defaultBinLocation = "/opt/atlassian/bin/atlas";
const validEnvTypesSet = new Set(["dev", "staging", "prod"]);

async function getSlauthToken(audience, envType, slauthGroup) {
  if (audience === null || audience === "") {
    return "invalid value defined for `audience`";
  }
  if (!validEnvTypesSet.has(envType)) {
    return "invalid value defined for `envType`";
  }
  const groupArgument = slauthGroup ? `--groups=${slauthGroup}` : "";
  return executeCommandSafely(
    `${defaultBinLocation} slauth token --aud=${audience} -e ${envType} ${groupArgument} `,
  );
}

async function getAsapToken(audience, asapConfigFilePath) {
  if (audience === null || audience === "") {
    return "invalid value defined for `audience`";
  }
  if (asapConfigFilePath === null || asapConfigFilePath === "") {
    return "invalid value defined for `asapConfigFilePath`";
  }
  return executeCommandSafely(
    `${defaultBinLocation} asap token --aud=${audience} -c ${asapConfigFilePath}`,
  );
}

async function executeCommandSafely(cmd) {
  try {
    const result = await exec(cmd);
    return result.stdout.trim();
  } catch (failed) {
    return failed.stderr;
  }
}

async function run(
  context,
  tokenType,
  audience,
  envType,
  slauthGroup,
  asapConfigFilePath,
) {
  if (tokenType === "slauth") {
    return getSlauthToken(audience, envType, slauthGroup);
  }
  if (tokenType === "asap") {
    return getAsapToken(audience, asapConfigFilePath);
  }
  return `unknown token type : ${tokenType}`;
}

const templateTags = [
  {
    displayName: "asap/slauth",
    name: "atlassianAsapSlauth",
    description: "Generate ASAP/SLAUTH token",
    args: [
      {
        displayName: "Token Type (mandatory)",
        help: "Select the token type",
        type: "enum",
        options: [
          {displayName: "slauth", value: "slauth"},
          {displayName: "asap", value: "asap"},
        ],
      },
      {
        displayName: "Audience (mandatory)",
        help: "Specify audience for your asap/slauth",
        type: "string",
      },
      {
        displayName: "Environment Type (mandatory if Type is SLAUTH)",
        help: "Select the environment for which you want to generate slauth token",
        type: "enum",
        options: [
          {displayName: "dev", value: "dev"},
          {displayName: "staging", value: "staging"},
          {displayName: "prod", value: "prod"},
        ],
      },
      {
        displayName: "Slauth Group",
        help: "Provide the SLAUTH group which you want to use to generate the slauth token",
        type: "string",
      },
      {
        displayName: "Asap Config File Path (mandatory if Type is ASAP)",
        help: "Specify the path to your ~/.asap-config file. This file will be used to fetch you asap credentials such as KeyId, PrivateKey, etc",
        type: "string",
      },
    ],
    run,
  },
];

module.exports.templateTags = templateTags;
module.exports.run = run;
module.exports.executeCommandSafely = executeCommandSafely;
module.exports.getAsapToken = getAsapToken;
module.exports.getSlauthToken = getSlauthToken;
