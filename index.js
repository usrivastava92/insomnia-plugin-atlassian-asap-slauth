const {execSync} = require("child_process");

const execSyncSafely = (cmd) => {
  try {
    return execSync(cmd).toString().trim();
  } catch (failed) {
    return failed.toString().trim();
  }
};

const validEnvTypesSet = new Set(["dev", "staging", "prod"]);
const getAtlasBinPath = "/opt/atlassian/bin/atlas";

const isNullUndefinedOrBlank = (value) => {
  return value === null || value === undefined || value === "";
};

const getSlauthToken = (audience, envType, slauthGroup) => {
  if (!validEnvTypesSet.has(envType)) {
    return "invalid value defined for `envType`";
  }
  const groupArgument = isNullUndefinedOrBlank(slauthGroup) ? "" : `--groups=${slauthGroup}`;
  return execSyncSafely(
    `${getAtlasBinPath} slauth token --aud=${audience} -e ${envType} ${groupArgument}`,
  );
};

const getAsapToken = (audience, asapConfigFilePath) => {
  if (isNullUndefinedOrBlank(asapConfigFilePath)) {
    return "invalid value defined for `asapConfigFilePath`";
  }
  return execSyncSafely(
    `${getAtlasBinPath} asap token --aud=${audience} -c ${asapConfigFilePath}`,
  );
};

const run = (
  context,
  tokenType,
  audience,
  envType,
  slauthGroup,
  asapConfigFilePath,
) => {
  if (isNullUndefinedOrBlank(audience)) {
    return `invalid value defined for \`audience\` : \`${audience}\``;
  }
  if (tokenType === "slauth") {
    return getSlauthToken(audience, envType, slauthGroup);
  }
  if (tokenType === "asap") {
    return getAsapToken(audience, asapConfigFilePath);
  }
  return `unknown token type : ${tokenType}`;
};

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
        defaultValue: "slauth",
      },
      {
        displayName: "Audience (mandatory)",
        help: "Specify audience for your asap/slauth",
        type: "string",
        placeholder: "Specify audience for your asap/slauth",
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
        defaultValue: "dev",
      },
      {
        displayName: "Slauth Group",
        help: "Provide the SLAUTH group which you want to use to generate the slauth token",
        type: "string",
        placeholder: "micros-sv--{{serviceName}}-dl-admins",
      },
      {
        displayName: "Asap Config File Path (mandatory if Type is ASAP)",
        help: "Specify the path to your ~/.asap-config file. This file will be used to fetch you asap credentials such as KeyId, PrivateKey, etc",
        type: "string",
        placeholder: "~/.asap-config",
      },
    ],
    run,
  },
];

module.exports.templateTags = templateTags;
module.exports.run = run;
module.exports.getAsapToken = getAsapToken;
module.exports.getSlauthToken = getSlauthToken;
module.exports.execSyncSafely = execSyncSafely;
