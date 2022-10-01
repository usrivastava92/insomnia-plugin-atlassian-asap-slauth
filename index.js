const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

const defaultBinLocation = "/opt/atlassian/bin/atlas";

async function executeCommandSafely(cmd) {
  try {
    const result = await exec(cmd);
    return result.stdout.trim();
  } catch (failed) {
    console.log("Command execution failed with " + failed);
    return failed.stderr;
  }
}

async function getSlauthToken(audience, envType, slauthGroup) {
  if (audience === null || audience === "") {
    return "invalid value defined for `audience`";
  }
  if (envType === null || envType === "") {
    return "invalid value defined for `envType`";
  }
  if (slauthGroup === null || slauthGroup === "") {
    return "invalid value defined for `slauthGroup`";
  }
  return executeCommandSafely(`${defaultBinLocation} slauth token --aud=${audience} -e ${envType} --groups=${slauthGroup}`);
}

async function getAsapToken(audience, asapConfigFilePath) {
  if (audience === null || audience === "") {
    return "invalid value defined for `audience`";
  }
  if (asapConfigFilePath === null || asapConfigFilePath === "") {
    return "invalid value defined for `asapConfigFilePath`";
  }
  return executeCommandSafely(`${defaultBinLocation} asap token --aud=${audience} -c ${asapConfigFilePath}`);
}

async function run(
  context,
  tokenType,
  audience,
  envType,
  slauthGroup,
  asapConfigFilePath
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
          { displayName: "slauth", value: "slauth" },
          { displayName: "asap", value: "asap" }
        ]
      },
      {
        displayName: "Audience (mandatory)",
        help: "Specify audience for your ASAP/SLAUTH",
        type: "string"
      },
      {
        displayName: "Environment Type (mandatory if Type is SLAUTH)",
        help: "Select the environment for which you want to generate SLAUTH token",
        type: "enum",
        options: [
          { displayName: "dev", value: "dev" },
          { displayName: "staging", value: "staging" },
          { displayName: "prod", value: "prod" }
        ]
      },
      {
        displayName: "Slauth Group (mandatory if Type is SLAUTH)",
        help: "Provide the SLAUTH group which you want to use to generate the token",
        type: "string"
      },
      {
        displayName: "Asap Config File Path (mandatory if Type is ASAP)",
        help: "Specify the path to your ~/.asap-config file",
        type: "string"
      }
    ],
    run
  }
];

module.exports.templateTags = templateTags;
module.exports.run = run;
module.exports.executeCommandSafely = executeCommandSafely;
module.exports.getAsapToken = getAsapToken;
module.exports.getSlauthToken = getSlauthToken;