const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DocumentRegistryModule", (m) => {
    const documentRegistry = m.contract("DocumentRegistry");
    return { documentRegistry };
});
