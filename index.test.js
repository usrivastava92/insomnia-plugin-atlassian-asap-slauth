const {templateTags} = require("./index.js");

jest.mock("util");
jest.mock("child_process");

const child_process = require("child_process");

beforeEach(() => {
  child_process.exec.mockImplementation((cmd) => {
    return {stdout: cmd, stderr: `Error: execution failed : ${cmd}`};
  });
});

describe("Test Slauth", () => {
  const defaultAudience = "service-name";
  const defaultEnvType = "dev";
  const defaultSlauthGroup = "slauth-group";
  const defaultContext = "";
  const invalidValueList = ["", null, undefined];
  const run = templateTags.find((tag) => tag.name === "atlassianSlauth").run;

  test("Test slauth token", async () => {
    const output = await run(
      defaultContext,
      defaultAudience,
      defaultEnvType,
      defaultSlauthGroup,
    );
    expect(output).toBe(
      `/opt/atlassian/bin/atlas slauth token --aud=${defaultAudience} -e ${defaultEnvType} --groups=${defaultSlauthGroup}`,
    );
  });

  test("Test slauth token when no group provided", async () => {
    for (const slauthGroup of invalidValueList) {
      const output = await run(
        defaultContext,
        defaultAudience,
        defaultEnvType,
        slauthGroup,
      );
      expect(output).toBe(
        `/opt/atlassian/bin/atlas slauth token --aud=${defaultAudience} -e ${defaultEnvType}`,
      );
    }
  });

  test("Test command execution failure", async () => {
    child_process.exec.mockImplementation((cmd) => {
      throw {stderr: `Error: execution failed : ${cmd}`};
    });
    for (const slauthGroup of invalidValueList) {
      const output = await run(
        defaultContext,
        defaultAudience,
        defaultEnvType,
        slauthGroup,
      );
      expect(output).toBe(
        `Error: execution failed : /opt/atlassian/bin/atlas slauth token --aud=${defaultAudience} -e ${defaultEnvType}`,
      );
    }
  });

  test("Test run with slauth token type when envType is null/blank/undefined", async () => {
    for (const envType of invalidValueList) {
      let output = await run(
        defaultContext,
        defaultAudience,
        envType,
        defaultSlauthGroup,
      );
      expect(output).toBe("invalid value defined for `envType`");
    }
  });

  test("Test run with slauth token type when invalid envType is provided", async () => {
    const output = await run(
      defaultContext,
      defaultAudience,
      "invalid",
      defaultSlauthGroup,
    );
    expect(output).toBe("invalid value defined for `envType`");
  });

  test("Test run with slauth token type when audience is null/blank/undefined", () => {
    invalidValueList.forEach(async (audience) => {
      const output = await run(
        defaultContext,
        audience,
        defaultEnvType,
        defaultSlauthGroup,
      );
      expect(output).toBe(
        `invalid value defined for \`audience\` : \`${audience}\``,
      );
    });
  });

  test("Test slauth when atlas bin location is provided", async () => {
    const output = await run(
      defaultContext,
      defaultAudience,
      defaultEnvType,
      defaultSlauthGroup,
      "/some/location/atlas",
    );
    expect(output).toBe(
      "/some/location/atlas slauth token --aud=service-name -e dev --groups=slauth-group",
    );
  });
});

describe("Test Asap", () => {
  const defaultAudience = "service-name";
  const defaultAsapConfig = "~/.asap-config";
  const defaultContext = "";
  const invalidValueList = ["", null, undefined];
  const run = templateTags.find((tag) => tag.name === "atlassianAsap").run;

  test("Test asap token", async () => {
    const output = await run(
      defaultContext,
      defaultAudience,
      defaultAsapConfig,
    );
    expect(output).toBe(
      `/opt/atlassian/bin/atlas asap token --aud=${defaultAudience} -c ${defaultAsapConfig}`,
    );
  });

  test("Test run with asap token type when asapConfigFilePath is null/blank/undefined", async () => {
    for (const asapConfigFilePath of invalidValueList) {
      const output = await run(
        defaultContext,
        defaultAudience,
        asapConfigFilePath,
      );
      expect(output).toBe("invalid value defined for `asapConfigFilePath`");
    }
  });

  test("Test asap when additional claims are provided", async () => {
    const additionalClaims = "exp=123433233";
    const output = await run(
      defaultContext,
      defaultAudience,
      defaultAsapConfig,
      additionalClaims,
    );
    expect(output).toBe(
      "/opt/atlassian/bin/atlas asap token --aud=service-name -c ~/.asap-config --additional-claims='exp=123433233'",
    );
  });

  test("Test run with asap token type when audience is not provided", async () => {
    for (const audience of invalidValueList) {
      const output = await run(defaultContext, audience, defaultAsapConfig);
      expect(output).toBe(
        `invalid value defined for \`audience\` : \`${audience}\``,
      );
    }
  });

  test("Test asap when atlas bin location is provided", async () => {
    const output = await run(
      defaultContext,
      defaultAudience,
      defaultAsapConfig,
      "",
      "/some/location/atlas",
    );
    expect(output).toBe(
      "/some/location/atlas asap token --aud=service-name -c ~/.asap-config",
    );
  });

  test("Test asap when additional claims are provided", async () => {
    const additionalClaims = "exp=123433233";
    const output = await run(
      defaultContext,
      defaultAudience,
      defaultAsapConfig,
      additionalClaims,
    );
    expect(output).toBe(
      "/opt/atlassian/bin/atlas asap token --aud=service-name -c ~/.asap-config --additional-claims='exp=123433233'",
    );
  });

  test("Test run with asap token type when audience is not provided", async () => {
    for (const audience of invalidValueList) {
      const output = await run(defaultContext, audience, defaultAsapConfig);
      expect(output).toBe(
        `invalid value defined for \`audience\` : \`${audience}\``,
      );
    }
  });

  test("Test asap when atlas bin location is provided", async () => {
    const output = await run(
      defaultContext,
      defaultAudience,
      defaultAsapConfig,
      "",
      "/some/location/atlas",
    );
    expect(output).toBe(
      "/some/location/atlas asap token --aud=service-name -c ~/.asap-config",
    );
  });
});

describe("Test Micros Base Url", () => {
  const defaultServiceId = "service-id";
  const defaultEnv = "stg-east";
  const defaultContext = "";
  const run = templateTags.find(
    (tag) => tag.name === "atlassianMicrosBaseUrl",
  ).run;

  test("Test micros base url", async () => {
    const output = await run(defaultContext, defaultServiceId, defaultEnv);
    expect(output).toBe("https://service-id.us-east-1.staging.atl-paas.net");
  });

  test("Test local base url", async () => {
    const output = await run(defaultContext, defaultServiceId, "local");
    expect(output).toBe("http://localhost:8080");
  });

  test("Test invalid env", async () => {
    const output = await run(defaultContext, defaultServiceId, "invalid");
    expect(output).toBe("invalid value defined for `microsEnv` : `invalid`");
  });
});
