// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RentalContract is ReentrancyGuard {
    enum Status { Pending, Active, Terminated, Disputed }

    struct Lease {
        address landlord;
        address tenant;
        uint256 rentAmount;
        uint256 durationMonths;
        uint256 startDate;
        uint256 paidMonths;
        Status status;
        uint256 onTimePayments;
        uint256 totalPayments;
        bool disputeRaisedByTenant;
        bool disputeRaisedByLandlord;
    }

    address public admin;
    uint256 public leaseCounter;
    mapping(uint256 => Lease) public leases;

    // Track tenant payment history (tenant => leaseIds[])
    mapping(address => uint256[]) private tenantLeases;

    event LeaseCreated(uint256 leaseId, address landlord, address tenant);
    event LeaseSigned(uint256 leaseId);
    event RentPaid(uint256 leaseId, uint256 monthPaid, uint256 timestamp);
    event LeaseTerminated(uint256 leaseId);
    event DisputeRaised(uint256 leaseId, address raisedBy);
    event DisputeResolved(uint256 leaseId);

    modifier onlyLandlord(uint256 leaseId) {
        require(msg.sender == leases[leaseId].landlord, "Not landlord");
        _;
    }

    modifier onlyTenant(uint256 leaseId) {
        require(msg.sender == leases[leaseId].tenant, "Not tenant");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createLease(
        address _tenant,
        uint256 _rentAmount,
        uint256 _durationMonths
    ) public {
        require(_tenant != address(0), "Invalid tenant address");
        require(_rentAmount > 0, "Rent must be positive");
        require(_durationMonths > 0, "Duration must be positive");

        leases[leaseCounter] = Lease({
            landlord: msg.sender,
            tenant: _tenant,
            rentAmount: _rentAmount,
            durationMonths: _durationMonths,
            startDate: 0,
            paidMonths: 0,
            status: Status.Pending,
            onTimePayments: 0,
            totalPayments: 0,
            disputeRaisedByTenant: false,
            disputeRaisedByLandlord: false
        });

        tenantLeases[_tenant].push(leaseCounter);

        emit LeaseCreated(leaseCounter, msg.sender, _tenant);
        leaseCounter++;
    }

    function signLease(uint256 leaseId) external onlyTenant(leaseId) {
        Lease storage lease = leases[leaseId];
        require(lease.status == Status.Pending, "Already signed or invalid state");
        lease.startDate = block.timestamp;
        lease.status = Status.Active;

        emit LeaseSigned(leaseId);
    }

    function payRent(uint256 leaseId) external payable onlyTenant(leaseId) nonReentrant {
        Lease storage lease = leases[leaseId];
        require(lease.status == Status.Active, "Lease not active");
        require(msg.value == lease.rentAmount, "Incorrect rent amount");
        require(lease.paidMonths < lease.durationMonths, "All months paid");
        require(!lease.disputeRaisedByTenant && !lease.disputeRaisedByLandlord, "Dispute ongoing");

        lease.totalPayments++;
        lease.paidMonths++;

        uint256 dueDate = lease.startDate + lease.paidMonths * 30 days;
        if (block.timestamp <= dueDate) {
            lease.onTimePayments++;
        }

        payable(lease.landlord).transfer(msg.value);
        emit RentPaid(leaseId, lease.paidMonths, block.timestamp);
    }

    function terminateLease(uint256 leaseId) external onlyLandlord(leaseId) {
        Lease storage lease = leases[leaseId];
        require(lease.status == Status.Active || lease.status == Status.Disputed, "Lease not active or disputed");
        lease.status = Status.Terminated;

        emit LeaseTerminated(leaseId);
    }

    // Tenant or landlord can raise dispute
    function raiseDispute(uint256 leaseId) external {
        Lease storage lease = leases[leaseId];
        require(
            msg.sender == lease.tenant || msg.sender == lease.landlord,
            "Only tenant or landlord can raise dispute"
        );
        require(lease.status == Status.Active, "Lease must be active");
        if (msg.sender == lease.tenant) {
            lease.disputeRaisedByTenant = true;
        } else {
            lease.disputeRaisedByLandlord = true;
        }
        lease.status = Status.Disputed;

        emit DisputeRaised(leaseId, msg.sender);
    }

    // Admin resolves dispute
    function resolveDispute(uint256 leaseId) external onlyAdmin {
        Lease storage lease = leases[leaseId];
        require(lease.status == Status.Disputed, "No dispute to resolve");

        lease.disputeRaisedByTenant = false;
        lease.disputeRaisedByLandlord = false;
        lease.status = Status.Active;

        emit DisputeResolved(leaseId);
    }

    function getReputation(uint256 leaseId) external view returns (uint256) {
        Lease memory lease = leases[leaseId];
        if (lease.totalPayments == 0) return 0;
        return (lease.onTimePayments * 100) / lease.totalPayments;
    }

    // Fetch tenant's leases
    function getTenantLeases(address tenant) external view returns (uint256[] memory) {
        return tenantLeases[tenant];
    }

    // Fetch details of a lease
    function getLeaseDetails(uint256 leaseId)
        external
        view
        returns (
            address landlord,
            address tenant,
            uint256 rentAmount,
            uint256 durationMonths,
            uint256 startDate,
            uint256 paidMonths,
            Status status,
            uint256 onTimePayments,
            uint256 totalPayments,
            bool disputeTenant,
            bool disputeLandlord
        )
    {
        Lease memory lease = leases[leaseId];
        return (
            lease.landlord,
            lease.tenant,
            lease.rentAmount,
            lease.durationMonths,
            lease.startDate,
            lease.paidMonths,
            lease.status,
            lease.onTimePayments,
            lease.totalPayments,
            lease.disputeRaisedByTenant,
            lease.disputeRaisedByLandlord
        );
    }
}
