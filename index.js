const {promisify} = require("util");
const {exec} = require("child_process");

const promisifyExec = promisify(exec);

const execSafely = async (cmd) => {
  try {
    const output = await promisifyExec(cmd);
    return output.stdout.trim();
  } catch (failed) {
    return failed.stderr.trim();
  }
};

const validEnvTypesSet = new Set(["dev", "staging", "prod"]);
const getAtlasBinPath = "/opt/atlassian/bin/atlas";

const isNullUndefinedOrBlank = (value) => {
  return value === null || value === undefined || value === "";
};

const getSlauthToken = async (audience, envType, slauthGroup) => {
  if (!validEnvTypesSet.has(envType)) {
    return "invalid value defined for `envType`";
  }
  const groupArgument = isNullUndefinedOrBlank(slauthGroup)
    ? ""
    : `--groups=${slauthGroup}`;
  return execSafely(
    `${getAtlasBinPath} slauth token --aud=${audience} -e ${envType} ${groupArgument}`,
  );
};

const getAsapToken = async (audience, asapConfigFilePath, additionalClaims) => {
  if (isNullUndefinedOrBlank(asapConfigFilePath)) {
    return "invalid value defined for `asapConfigFilePath`";
  }

  const additionalClaimsArg = additionalClaims
    ? `--additional-claims='${additionalClaims}'`
    : "";

  return execSafely(
    `${getAtlasBinPath} asap token --aud=${audience} -c ${asapConfigFilePath} ${additionalClaimsArg}`,
  );
};

const run = async (
  context,
  tokenType,
  audience,
  envType,
  slauthGroup,
  asapConfigFilePath,
  additionalClaims,
) => {
  if (isNullUndefinedOrBlank(audience)) {
    return `invalid value defined for \`audience\` : \`${audience}\``;
  }
  if (tokenType === "slauth") {
    return getSlauthToken(audience, envType, slauthGroup);
  }
  if (tokenType === "asap") {
    return getAsapToken(audience, asapConfigFilePath, additionalClaims);
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
      {
        displayName: "Additional Claims",
        help: "Provide additional claims for the ASAP token",
        type: "string",
        placeholder: "",
      },
    ],
    run,
  },
];

module.exports.templateTags = templateTags;
module.exports.run = run;
module.exports.getAsapToken = getAsapToken;
module.exports.getSlauthToken = getSlauthToken;
module.exports.execSafely = execSafely;
