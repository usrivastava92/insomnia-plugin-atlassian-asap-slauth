const {run} = require("./index.js");

jest.mock("child_process", () => {
  return {
    execSync: (cmd) => cmd,
  };
});

describe("Test run", () => {
  test("Test slauth token", () => {
    const audience = "service-name";
    const envType = "dev";
    const slauthGroup = "slauth-group";
    const tokenType = "slauth";
    const output = run("", tokenType, audience, envType, slauthGroup, "");
    expect(output).toBe(
      `/opt/atlassian/bin/atlas slauth token --aud=${audience} -e ${envType} --groups=${slauthGroup}`,
    );
  });

  test("Test run with slauth token type when envType not provided", () => {
    const audience = "micros-service";
    const envType = "";
    const slauthGroup = "grp";
    const tokenType = "slauth";
    const output = run("", tokenType, audience, envType, slauthGroup, "");
    expect(output).toBe("invalid value defined for `envType`");
  });

  test("Test run with slauth token type when invalid envType is provided", () => {
    const audience = "micros-service";
    const envType = "invalid";
    const slauthGroup = "grp";
    const tokenType = "slauth";
    const output = run("", tokenType, audience, envType, slauthGroup, "");
    expect(output).toBe("invalid value defined for `envType`");
  });

  test("Test run with slauth token type when audience not provided", () => {
    const audience = "";
    const envType = "staging";
    const slauthGroup = "grp";
    const tokenType = "slauth";
    const output = run("", tokenType, audience, envType, slauthGroup, "");
    expect(output).toBe(
      `invalid value defined for \`audience\` : \`${audience}\``,
    );
  });

  test("Test asap token", () => {
    const audience = "service-name";
    const tokenType = "asap";
    const asapConfigFilePath = "~/.asap-config";
    const output = run("", tokenType, audience, "", "", asapConfigFilePath);
    expect(output).toBe(
      `/opt/atlassian/bin/atlas asap token --aud=${audience} -c ${asapConfigFilePath}`,
    );
  });

  test("Test run with asap token type when asapConfigFilePath is not provided", () => {
    const audience = "aud";
    const tokenType = "asap";
    const output = run("", tokenType, audience, "", "", "");
    expect(output).toBe("invalid value defined for `asapConfigFilePath`");
  });

  test("Test run with asap token type when audience is not provided", () => {
    const asapConfigFilePath = "grp";
    const tokenType = "asap";
    const audience = "";
    const output = run("", tokenType, audience, "", "", asapConfigFilePath);
    expect(output).toBe(
      `invalid value defined for \`audience\` : \`${audience}\``,
    );
  });

  test("Test run with invalid token type", () => {
    const output = run("", "invalid", "aud", "", "", "");
    expect(output).toBe("unknown token type : invalid");
  });
});
