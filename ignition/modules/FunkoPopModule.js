const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FunkoPopModule", (m) => {
  
  const funko = m.contract("FunkoPopMarketplace");

  return { funko };
});
