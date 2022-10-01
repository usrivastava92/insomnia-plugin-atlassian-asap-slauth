const { run } = require("./index.js");

describe("Test run", () => {

  test("Test run with slauth token type when envType not provided", async () => {
    const audience = "micros-service";
    const envType = "";
    const slauthGroup = "grp";
    const tokenType = "slauth";
    const output = await run("", tokenType, audience, envType, slauthGroup, "");
    expect(output).toBe("invalid value defined for `envType`");
  });

  test("Test run with slauth token type when invalid envType is provided", async () => {
    const audience = "micros-service";
    const envType = "invalid";
    const slauthGroup = "grp";
    const tokenType = "slauth";
    const output = await run("", tokenType, audience, envType, slauthGroup, "");
    expect(output).toBe("invalid value defined for `envType`");
  });

  test("Test run with slauth token type when audience not provided", async () => {
    const audience = "";
    const envType = "staging";
    const slauthGroup = "grp";
    const tokenType = "slauth";
    const output = await run("", tokenType, audience, envType, slauthGroup, "");
    expect(output).toBe("invalid value defined for `audience`");
  });

  test("Test run with asap token type when asapConfigFilePath is not provided", async () => {
    const audience = "aud";
    const tokenType = "asap";
    const output = await run("", tokenType, audience, "", "", "");
    expect(output).toBe("invalid value defined for `asapConfigFilePath`");
  });

  test("Test run with asap token type when audience is not provided", async () => {
    const asapConfigFilePath = "grp";
    const tokenType = "asap";
    const output = await run("", tokenType, "", "", "", asapConfigFilePath);
    expect(output).toBe("invalid value defined for `audience`");
  });

  test("Test run with invalid token type", async () => {
    const output = await run("", "invalid", "", "", "", "");
    expect(output).toBe("unknown token type : invalid");
  });
});
