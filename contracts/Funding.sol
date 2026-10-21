
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Funding {
    struct Campaign {
        address payable creator;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 amountRaised;
        bool claimed;
    }

    uint256 public campaignCount;

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    event CampaignCreated(
        uint256 indexed id,
        address indexed creator,
        string title,
        uint256 goal,
        uint256 deadline
    );

    event ContributionMade(
        uint256 indexed id,
        address indexed contributor,
        uint256 amount
    );

    event FundsClaimed(uint256 indexed id, uint256 amount);
    event RefundIssued(uint256 indexed id, address indexed contributor, uint256 amount);

    function createCampaign(
        string calldata title,
        string calldata description,
        uint256 goal,
        uint256 durationInDays
    ) external {
        require(bytes(title).length > 0, "Title required");
        require(goal > 0, "Goal must be positive");
        require(durationInDays > 0, "Duration must be positive");

        uint256 deadline = block.timestamp + durationInDays * 1 days;

        campaigns[campaignCount] = Campaign({
            creator: payable(msg.sender),
            title: title,
            description: description,
            goal: goal,
            deadline: deadline,
            amountRaised: 0,
            claimed: false
        });

        emit CampaignCreated(
            campaignCount, msg.sender, title, goal, deadline
        );

        campaignCount++;
    }

    function contribute(uint256 id) external payable {
        Campaign storage campaign = campaigns[id];

        require(id < campaignCount, "Campaign does not exist");
        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(msg.value > 0, "Contribution must be positive");
        require(!campaign.claimed, "Campaign already claimed");

        campaign.amountRaised += msg.value;
        contributions[id][msg.sender] += msg.value;

        emit ContributionMade(id, msg.sender, msg.value);
    }

    function claimFunds(uint256 id) external {
        require(id < campaignCount, "Campaign does not exist");

        Campaign storage campaign = campaigns[id];

        require(msg.sender == campaign.creator, "Creator only");
        require(block.timestamp >= campaign.deadline, "Campaign not ended");
        require(campaign.amountRaised >= campaign.goal, "Goal not reached");
        require(!campaign.claimed, "Funds already claimed");

        campaign.claimed = true;
        uint256 amount = campaign.amountRaised;

        (bool success, ) = campaign.creator.call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsClaimed(id, amount);
    }

    function refund(uint256 id) external {
        require(id < campaignCount, "Campaign does not exist");

        Campaign storage campaign = campaigns[id];

        require(block.timestamp >= campaign.deadline, "Campaign not ended");
        require(campaign.amountRaised < campaign.goal, "Goal was reached");

        uint256 amount = contributions[id][msg.sender];
        require(amount > 0, "Nothing to refund");

        contributions[id][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Refund failed");

        emit RefundIssued(id, msg.sender, amount);
    }
}
