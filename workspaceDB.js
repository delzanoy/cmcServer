const workspaces = [
    {
        "id": 1,
        "name": "Acme & Co.",
        "members":  [
            {
                "memberId": 1,
                "status": "active"
            },
            {
                "memberId": 2,
                "status": "active"
            },
            {
                "memberId": 3,
                "status": "active"
            },
            {
                "memberId": 4,
                "status": "authorisation reset"
            },
            {
                "memberId": 5,
                "status": "suspended"
            },
            {
                "memberId": 6,
                "status": "invited"
            },
            {
                "memberId": 7,
                "status": "invited"
            },
        ],
        "active": true,
        "wallets": [],
    },
    {
        "id": 2,
        "name": "Sirius Cybernetics",
        "members":  [
            {
                "memberId": 1,
            },
            {
                "memberId": 8,
            },
            {
                "memberId": 9,
            },
            {
                "memberId": 4,
            },
            {
                "memberId": 7,
            },
        ],
        "active": false,
        "wallets": [],
    },
    {
        "id": 3,
        "name": "Wonka Industries",
        "members":  [
            {
                "memberId": 1,
            },
            {
                "memberId": 10,
            },
            {
                "memberId": 8,
            },
            {
                "memberId": 4,
            },
            {
                "memberId": 11,
            },
        ],
        "active": false,
        "wallets": [],
    },
    {
        "id": 4,
        "name": "Tyrell Corp.",
        "members":  [
            {
                "memberId": 11,
            },
            {
                "memberId": 1,
            },
            {
                "memberId": 6,
            },
            {
                "memberId": 12,
            },
            {
                "memberId": 8,
            },
        ],
        "active": false,
    },
    {
        "id": 5,
        "name": "Nakatomi Trading Corp.",
        "members":  [
            {
                "memberId": 10,
            },
            {
                "memberId": 14,
            },
            {
                "memberId": 13,
            },
            {
                "memberId": 15,
            },
            {
                "memberId": 1,
            },
        ],
        "active": false,
        "wallets": [],
    },
    {
        "id": 6,
        "name": "E Corp",
        "members":  [
            {
                "memberId": 8,
            },
            {
                "memberId": 14,
            },
            {
                "memberId": 4,
            },
            {
                "memberId": 1,
            },
            {
                "memberId": 7,
            },
        ],
        "active": false,
        "wallets": [],
    },
  ]
  
  module.exports = workspaces;