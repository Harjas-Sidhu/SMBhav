let { expect } = require("chai");
let { ethers } = require("hardhat");

describe("DocumentRegistry Contract", function () {
    let documentRegistry;
    let owner;
    let user1;
    let user2;
    const testHash = "testHash123";

    beforeEach(async function () {
      const [deployer, u1, u2] = await ethers.getSigners();
      owner = deployer;
      user1 = u1;
      user2 = u2;

      const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
      documentRegistry = await DocumentRegistry.deploy();
    });

    it("should allow different users to store hashes", async function () {
      // user1 stores hash
      await documentRegistry.connect(user1).storeHash(testHash);
      const timestamp1 = await documentRegistry.verifyHash(testHash);
      expect(timestamp1).to.not.equal(0, "Hash should have been stored by user1");

      // user2 stores the same hash
      await documentRegistry.connect(user2).storeHash(testHash);
      const timestamp2 = await documentRegistry.verifyHash(testHash);
      expect(timestamp1).to.equal(timestamp2, "Hash should not overwrite when stored by different users");
    });

    it("should allow users to verify stored hashes", async function () {
      await documentRegistry.connect(user1).storeHash(testHash);
      const timestamp = await documentRegistry.verifyHash(testHash);
      expect(timestamp).to.not.equal(0, "Hash should have been stored by user1");
    });
  });
