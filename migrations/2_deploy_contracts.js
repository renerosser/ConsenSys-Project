const Decentragram = artifacts.require("Decentragram");

module.exports = function(deployer) {
	// truffle migrate --reset
  	deployer.deploy(Decentragram);
};