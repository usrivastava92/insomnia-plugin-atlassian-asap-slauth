const {run} = require("./index.js");

jest.mock("child_process");

const child_process = require("child_process");

beforeEach(() => {
  child_process.execSync.mockImplementation((cmd) => cmd);
});

describe("Test run", () => {
  const defaultAudience = "service-name";
  const defaultEnvType = "dev";
  const defaultSlauthGroup = "slauth-group";
  const defaultAsapConfig = "~/.asap-config";
  const defaultContext = "";
  const invalidValueList = ["", null, undefined];

  test("Test slauth token", () => {
    const output = run(
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

  test("Test slauth token when no group provided", () => {
    invalidValueList.forEach((slauthGroup) => {
      const output = run(
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
    });
  });

  test("Test command execution failure", () => {
    child_process.execSync.mockImplementation((cmd) => {
      throw new Error(`execution failed : ${cmd}`);
    });
    invalidValueList.forEach((slauthGroup) => {
      const output = run(
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
    });
  });

  test("Test run with slauth token type when envType is null/blank/undefined", () => {
    invalidValueList.forEach((envType) => {
      let output = run(
        defaultContext,
        "slauth",
        defaultAudience,
        envType,
        defaultSlauthGroup,
        defaultAsapConfig,
      );
      expect(output).toBe("invalid value defined for `envType`");
    });
  });

  test("Test run with slauth token type when invalid envType is provided", () => {
    const output = run(
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
    invalidValueList.forEach((audience) => {
      const output = run(
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

  test("Test asap token", () => {
    const output = run(
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

  test("Test run with asap token type when asapConfigFilePath is null/blank/undefined", () => {
    invalidValueList.forEach((asapConfigFilePath) => {
      const output = run(
        defaultContext,
        "asap",
        defaultAudience,
        defaultEnvType,
        defaultSlauthGroup,
        asapConfigFilePath,
      );
      expect(output).toBe("invalid value defined for `asapConfigFilePath`");
    });
  });

  test("Test run with asap token type when audience is not provided", () => {
    invalidValueList.forEach((audience) => {
      const output = run(
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
    });
  });

  test("Test run with invalid token type", () => {
    const output = run(
      defaultContext,
      "invalid",
      defaultAudience,
      defaultEnvType,
      defaultSlauthGroup,
      defaultAsapConfig,
    );
    expect(output).toBe("unknown token type : invalid");
  });
});
