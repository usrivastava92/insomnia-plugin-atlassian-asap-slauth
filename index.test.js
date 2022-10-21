const {run} = require("./index.js");

jest.mock("util");
jest.mock("child_process");

const child_process = require("child_process");

beforeEach(() => {
  child_process.exec.mockImplementation((cmd) => {
    return {stdout: cmd, stderr: `Error: execution failed : ${cmd}`};
  });
});

describe("Test run", () => {
  const defaultAudience = "service-name";
  const defaultEnvType = "dev";
  const defaultSlauthGroup = "slauth-group";
  const defaultAsapConfig = "~/.asap-config";
  const defaultContext = "";
  const invalidValueList = ["", null, undefined];

  test("Test slauth token", async () => {
    const output = await run(
      defaultContext,
      "slauth",
      defaultAudience,
      defaultEnvType,
      defaultSlauthGroup,
      defaultAsapConfig,
    );
    expect(output).toBe(
      `/opt/atlassian/bin/atlas slauth token --aud=${defaultAudience} -e ${defaultEnvType} --groups=${defaultSlauthGroup}`,
    );
  });

  test("Test slauth token when no group provided", async () => {
    for (const slauthGroup of invalidValueList) {
      const output = await run(
        defaultContext,
        "slauth",
        defaultAudience,
        defaultEnvType,
        slauthGroup,
        defaultAsapConfig,
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
        "slauth",
        defaultAudience,
        defaultEnvType,
        slauthGroup,
        defaultAsapConfig,
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
        "slauth",
        defaultAudience,
        envType,
        defaultSlauthGroup,
        defaultAsapConfig,
      );
      expect(output).toBe("invalid value defined for `envType`");
    }
  });

  test("Test run with slauth token type when invalid envType is provided", async () => {
    const output = await run(
      defaultContext,
      "slauth",
      defaultAudience,
      "invalid",
      defaultSlauthGroup,
      defaultAsapConfig,
    );
    expect(output).toBe("invalid value defined for `envType`");
  });

  test("Test run with slauth token type when audience is null/blank/undefined", () => {
    invalidValueList.forEach(async (audience) => {
      const output = await run(
        defaultContext,
        "slauth",
        audience,
        defaultEnvType,
        defaultSlauthGroup,
        defaultAsapConfig,
      );
      expect(output).toBe(
        `invalid value defined for \`audience\` : \`${audience}\``,
      );
    });
  });

  test("Test asap token", async () => {
    const output = await run(
      defaultContext,
      "asap",
      defaultAudience,
      defaultEnvType,
      defaultSlauthGroup,
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
        "asap",
        defaultAudience,
        defaultEnvType,
        defaultSlauthGroup,
        asapConfigFilePath,
      );
      expect(output).toBe("invalid value defined for `asapConfigFilePath`");
    }
  });

  test("Test asap when additional claims are provided", async () => {
    const additionalClaims = "exp=123433233";
    const output = await run(
      defaultContext,
      "asap",
      defaultAudience,
      defaultEnvType,
      defaultSlauthGroup,
      defaultAsapConfig,
      additionalClaims,
    );
    expect(output).toBe(
      "/opt/atlassian/bin/atlas asap token --aud=service-name -c ~/.asap-config --additional-claims='exp=123433233'",
    );
  });

  test("Test run with asap token type when audience is not provided", async () => {
    for (const audience of invalidValueList) {
      const output = await run(
        defaultContext,
        "asap",
        audience,
        defaultEnvType,
        defaultSlauthGroup,
        defaultAsapConfig,
      );
      expect(output).toBe(
        `invalid value defined for \`audience\` : \`${audience}\``,
      );
    }
  });

  test("Test run with invalid token type", async () => {
    const output = await run(
      defaultContext,
      "invalid",
      defaultAudience,
      defaultEnvType,
      defaultSlauthGroup,
      defaultAsapConfig,
    );
    expect(output).toBe("unknown token type : invalid");
  });

  test("Test slauth when atlas bin location is provided", async () => {
    const output = await run(
      defaultContext,
      "slauth",
      defaultAudience,
      defaultEnvType,
      defaultSlauthGroup,
      defaultAsapConfig,
      "",
      "/some/location/atlas",
    );
    expect(output).toBe(
      "/some/location/atlas slauth token --aud=service-name -e dev --groups=slauth-group",
    );
  });

  test("Test asap when atlas bin location is provided", async () => {
    const output = await run(
      defaultContext,
      "asap",
      defaultAudience,
      defaultEnvType,
      defaultSlauthGroup,
      defaultAsapConfig,
      "",
      "/some/location/atlas",
    );
    expect(output).toBe(
      "/some/location/atlas asap token --aud=service-name -c ~/.asap-config",
    );
  });
});
