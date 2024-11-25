const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PackageTrackingDeployment", (m) => {
  const packageTracking = m.contract("PackageTracking");
  return { packageTracking };
});
