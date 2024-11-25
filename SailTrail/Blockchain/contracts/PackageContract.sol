// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PackageTracking {
    struct Package {
        uint256 id;
        string[] processes;
        address currentResponsible;
        bool scanned;
    }

    struct Authority {
        address authorityAddress;
        string name;
    }

    mapping(uint256 => Package) public packages;
    mapping(address => Authority) public authorities;
    uint256 public totalPackages;
    uint256 public scannedPackages;

    event PackageScanned(uint256 indexed packageId, address indexed authority, string process);
    event ResponsiblePartyUpdated(uint256 indexed packageId, address indexed newResponsible);

    modifier onlyAuthority() {
        require(bytes(authorities[msg.sender].name).length > 0, "Not an authorized authority");
        _;
    }

    function registerAuthority(address authorityAddress, string memory name) public {
        require(bytes(authorities[authorityAddress].name).length == 0, "Authority already registered");
        authorities[authorityAddress] = Authority(authorityAddress, name);
    }

    function registerPackage(uint256 packageId) public {
        require(packages[packageId].id == 0, "Package already registered");
        packages[packageId] = Package({
            id: packageId,
            processes: new string[](0),
            currentResponsible: address(0),
            scanned: false
        });
        totalPackages++;
    }

    function scanPackage(uint256 packageId, string memory process) public onlyAuthority {
        Package storage pkg = packages[packageId];
        require(pkg.id != 0, "Package not registered");
        require(!pkg.scanned, "Package already scanned");

        pkg.scanned = true;
        pkg.processes.push(process);
        pkg.currentResponsible = msg.sender;
        scannedPackages++;

        emit PackageScanned(packageId, msg.sender, process);
    }

    function updateResponsibleParty(uint256 packageId, address newResponsible) public onlyAuthority {
        Package storage pkg = packages[packageId];
        require(pkg.id != 0, "Package not registered");
        require(pkg.scanned, "Package not scanned yet");

        pkg.currentResponsible = newResponsible;
        emit ResponsiblePartyUpdated(packageId, newResponsible);
    }

    function getPackageDetails(uint256 packageId) public view returns (Package memory) {
        return packages[packageId];
    }

    function getAuthorityDetails(address authorityAddress) public view returns (Authority memory) {
        return authorities[authorityAddress];
    }
}
