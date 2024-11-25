const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("PackageTracking Contract", function () {
    let packageTracking;
    let owner;
    let authority1;
    let authority2;
    let packageId = 1;

    beforeEach(async function () {
        const PackageTracking = await ethers.getContractFactory(
            "PackageTracking"
        );
        packageTracking = await PackageTracking.deploy();
        [owner, authority1, authority2] = await ethers.getSigners();
    });

    it("should allow registering an authority", async function () {
        const authorityAddress = authority1.address;
        await packageTracking.registerAuthority(
            authorityAddress,
            "Authority 1"
        );
        const authority = await packageTracking.getAuthorityDetails(
            authorityAddress
        );
        expect(authority.name).to.equal("Authority 1");
        expect(authority.authorityAddress).to.equal(authorityAddress);
    });

    it("should allow registering a package", async function () {
        await packageTracking.registerPackage(packageId);
        const pkg = await packageTracking.getPackageDetails(packageId);
        expect(pkg.id).to.equal(packageId);
        expect(pkg.scanned).to.equal(false);
        expect(pkg.processes.length).to.equal(0);
    });

    it("should allow an authority to scan a package", async function () {
        await packageTracking.registerPackage(packageId);
        await packageTracking.registerAuthority(
            authority1.address,
            "Authority 1"
        );

        const process = "Package received by Authority 1";
        await packageTracking
            .connect(authority1)
            .scanPackage(packageId, process);

        const pkg = await packageTracking.getPackageDetails(packageId);
        expect(pkg.scanned).to.equal(true);
        expect(pkg.processes).to.include(process);
        expect(pkg.currentResponsible).to.equal(authority1.address);
    });

    it("should emit a PackageScanned event when a package is scanned", async function () {
        await packageTracking.registerPackage(packageId);
        await packageTracking.registerAuthority(
            authority1.address,
            "Authority 1"
        );

        const process = "Package scanned by Authority 1";
        await expect(
            packageTracking.connect(authority1).scanPackage(packageId, process)
        )
            .to.emit(packageTracking, "PackageScanned")
            .withArgs(packageId, authority1.address, process);
    });

    it("should allow updating the responsible party", async function () {
        await packageTracking.registerPackage(packageId);
        await packageTracking.registerAuthority(
            authority1.address,
            "Authority 1"
        );
        await packageTracking.registerAuthority(
            authority2.address,
            "Authority 2"
        );

        const process = "Package scanned by Authority 1";
        await packageTracking
            .connect(authority1)
            .scanPackage(packageId, process);

        await packageTracking
            .connect(authority2)
            .updateResponsibleParty(packageId, authority2.address);

        const pkg = await packageTracking.getPackageDetails(packageId);
        expect(pkg.currentResponsible).to.equal(authority2.address);
    });

    it("should emit a ResponsiblePartyUpdated event when the responsible party is updated", async function () {
        await packageTracking.registerPackage(packageId);
        await packageTracking.registerAuthority(
            authority1.address,
            "Authority 1"
        );
        await packageTracking.registerAuthority(
            authority2.address,
            "Authority 2"
        );

        const process = "Package scanned by Authority 1";
        await packageTracking
            .connect(authority1)
            .scanPackage(packageId, process);

        await expect(
            packageTracking
                .connect(authority2)
                .updateResponsibleParty(packageId, authority2.address)
        )
            .to.emit(packageTracking, "ResponsiblePartyUpdated")
            .withArgs(packageId, authority2.address);
    });
});
