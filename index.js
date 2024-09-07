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

const MicrosEnvs = Object.freeze({
  local: {type: "local", region: "local"},
  ddev: {
    type: "dev",
    region: "ap-southeast-2",
  },
  "dev-west2": {
    type: "dev",
    region: "us-west-2",
  },
  adev: {
    type: "dev",
    region: "ap-southeast-2",
  },
  "adev-west2": {
    type: "dev",
    region: "us-west-2",
  },
  "pdev-apse2": {
    type: "platdev",
    region: "ap-southeast-2",
  },
  "pdev-west2": {
    type: "platdev",
    region: "us-west-2",
  },
  "stg-east": {
    type: "staging",
    region: "us-east-1",
  },
  "stg-west": {
    type: "staging",
    region: "us-west-1",
  },
  "stg-west2": {
    type: "staging",
    region: "us-west-2",
  },
  "stg-euwest": {
    type: "staging",
    region: "eu-west-1",
  },
  "stg-eucentral": {
    type: "staging",
    region: "eu-central-1",
  },
  "stg-eucentral2": {
    type: "staging",
    region: "eu-central-2",
  },
  "stg-cacentral": {
    type: "staging",
    region: "ca-central-1",
  },
  "stg-apse": {
    type: "staging",
    region: "ap-southeast-1",
  },
  "stg-apse2": {
    type: "staging",
    region: "ap-southeast-2",
  },
  "prod-east": {
    type: "prod",
    region: "us-east-1",
  },
  "prod-west": {
    type: "prod",
    region: "us-west-1",
  },
  "prod-west2": {
    type: "prod",
    region: "us-west-2",
  },
  "prod-euwest": {
    type: "prod",
    region: "eu-west-1",
  },
  "prod-euwest2": {
    type: "prod",
    region: "eu-west-2",
  },
  "prod-eucentral": {
    type: "prod",
    region: "eu-central-1",
  },
  "prod-eucentral2": {
    type: "prod",
    region: "eu-central-2",
  },
  "prod-cacentral": {
    type: "prod",
    region: "ca-central-1",
  },
  "prod-apse": {
    type: "prod",
    region: "ap-southeast-1",
  },
  "prod-apse2": {
    type: "prod",
    region: "ap-southeast-2",
  },
  "prod-apsouth": {
    type: "prod",
    region: "ap-south-1",
  },
  "prod-apne": {
    type: "prod",
    region: "ap-northeast-1",
  },
  "prod-apne2": {
    type: "prod",
    region: "ap-northeast-2",
  },
  "prod-saeast": {
    type: "prod",
    region: "sa-east-1",
  },
});

const validEnvTypesSet = new Set(
  Object.values(MicrosEnvs).map((env) => env.type),
);
const validEnvSet = new Set(Object.keys(MicrosEnvs));

const defaultAtlasBinPath = "/opt/atlassian/bin/atlas";

const isNotDefined = (value) => {
  return value === null || value === undefined || value === "";
};

const generateAsap = async (
  context,
  audience,
  asapConfigFilePath,
  additionalClaims,
  atlasBinaryLocation,
) => {
  const bin = isNotDefined(atlasBinaryLocation)
    ? defaultAtlasBinPath
    : atlasBinaryLocation;
  if (isNotDefined(audience)) {
    return `invalid value defined for \`audience\` : \`${audience}\``;
  }
  if (isNotDefined(asapConfigFilePath)) {
    return "invalid value defined for `asapConfigFilePath`";
  }
  const additionalClaimsArg = additionalClaims
    ? `--additional-claims='${additionalClaims}'`
    : "";
  return execSafely(
    `${bin} asap token --aud=${audience} -c ${asapConfigFilePath} ${additionalClaimsArg}`,
  );
};

const generateSlauth = async (
  context,
  audience,
  envType,
  slauthGroup,
  atlasBinaryLocation,
) => {
  const bin = isNotDefined(atlasBinaryLocation)
    ? defaultAtlasBinPath
    : atlasBinaryLocation;
  if (isNotDefined(audience)) {
    return `invalid value defined for \`audience\` : \`${audience}\``;
  }
  if (!validEnvTypesSet.has(envType)) {
    return "invalid value defined for `envType`";
  }
  const groupArgument = isNotDefined(slauthGroup)
    ? ""
    : `--groups=${slauthGroup}`;
  return execSafely(
    `${bin} slauth token --aud=${audience} -e ${envType} ${groupArgument}`,
  );
};

const generateMicrosBaseUrl = async (
  context,
  serviceId,
  microsEnv,
  localPort,
) => {
  if (isNotDefined(serviceId)) {
    return `invalid value defined for \`serviceId\` : \`${serviceId}\``;
  }
  if (!validEnvSet.has(microsEnv)) {
    return `invalid value defined for \`microsEnv\` : \`${microsEnv}\``;
  }
  if (microsEnv === "local") {
    if (isNotDefined(localPort)) {
      return `invalid value defined for \`localPort\` : \`${localPort}\``;
    }
    return `http://localhost:${localPort}`;
  }
  const envTye = MicrosEnvs[microsEnv].type;
  const awsRegion = MicrosEnvs[microsEnv].region;
  return `https://${serviceId}.${awsRegion}.${envTye}.atl-paas.net`;
};

module.exports.templateTags = [
  {
    displayName: "asap",
    name: "atlassianAsap",
    description: "Generate ASAP token",
    args: [
      {
        displayName: "Audience (mandatory)",
        help: "Specify audience for your asap",
        type: "string",
        placeholder: "Specify audience for your asap",
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
        placeholder: "additionalClaim1=value1,additionalClaim2=value2",
      },
      {
        displayName: "Atlas binary location",
        help: "Required if your atlas binary location is not /opt/atlassian/bin/atlas",
        type: "string",
        placeholder: "/opt/atlassian/bin/atlas",
      },
    ],
    run: generateAsap,
  },
  {
    displayName: "slauth",
    name: "atlassianSlauth",
    description: "Generate SLAUTH token",
    args: [
      {
        displayName: "Audience (mandatory)",
        help: "Specify audience for Slauth token",
        type: "string",
        placeholder: "Specify audience for Slauth token",
      },
      {
        displayName: "Environment Type (mandatory)",
        help: "Select the environment for which you want to generate Slauth token",
        type: "enum",
        options: Array.from(validEnvTypesSet, (envType) => ({
          displayName: envType,
          value: envType,
        })),
        defaultValue: "dev",
      },
      {
        displayName: "Slauth Group",
        help: "Provide the SLAUTH group which you want to use to generate the slauth token",
        type: "string",
        placeholder: "micros-sv--{{serviceName}}-dl-admins",
      },
      {
        displayName: "Atlas binary location",
        help: "Required if your atlas binary location is not /opt/atlassian/bin/atlas",
        type: "string",
        placeholder: "/opt/atlassian/bin/atlas",
      },
    ],
    run: generateSlauth,
  },
  {
    displayName: "microsBaseUrl",
    name: "atlassianMicrosBaseUrl",
    description: "Generate BaseUrl for micros service",
    args: [
      {
        displayName: "Micros Service Id (mandatory)",
        help: "Micros service id for which you want to generate the base url",
        type: "string",
        placeholder: "eg: service-id",
      },
      {
        displayName: "Micros Env (mandatory)",
        help: "Select the environment for which you want to generate Base Url",
        type: "enum",
        options: Array.from(validEnvSet, (env) => ({
          displayName: env,
          value: env,
        })),
        defaultValue: "ddev",
      },
      {
        displayName: "Local Port (mandatory if Micros Env is local)",
        help: "Port for base url for local env",
        type: "number",
        defaultValue: "8080",
      },
    ],
    run: generateMicrosBaseUrl,
  },
];
