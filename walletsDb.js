const wallets = [
    {
        "id": 1,
        "address": "0x742d35Cc6634C0532925a3b8D6B2eB8a7a5C3a1F",
        "type": 1,
        "name": "Marketing",
        "blockchain": [
            { "blockchain": "Ethereum" },
            { "blockchain": "Polygon" }
        ],
        "members": [
            {
                "memberId": 1,
                "role": ["admin", "approver"],
            },
            {
                "memberId": 2,
                "role": "approver",
            },
            {
                "memberId": 3,
                "role": "approver",
            },
            {
                "memberId": 4,
                "role": "viewer",
            },
        ],
        "threshold": 2,
        "transactionLimit": 10000,
        "blockedAssets": [
            { "assetId": 2280 }, // FIL
            { "assetId": 6535 }, // NEAR
        ],
        "balance": [
            {
                "assetId": 1027, // ETH
                "tokens": 8.42,
            },
            {
                "assetId": 1975, // LINK
                "tokens": 450.25,
            },
            {
                "assetId": 825, // USDT
                "tokens": 12500.33,
            },
            {
                "assetId": 3408, // USDC
                "tokens": 8500.67,
            },
            {
                "assetId": 7186, // AAVE
                "tokens": 25.50,
            }
        ],
        "transactions": [
            {
                "transactionId": "0x28443d391cf2b4ba2f5df60e0686fbfeb1274049ffa7dc180adf959d31deafec",
                "timestamp": 1694040359891,
                "outAssetId": 825, // USDT
                "outTokens": 2500.50,
                "blockchain": "Ethereum",
                "classification": "Social Media Campaign",
                "initiator": 1,
                "executer": 2,
                "toAddress": [
                    { "toAddress": "0x3b0d1aD74861Fb70e2DB4Fb7f07EaC27ef884da7" },
                    { "toAddress": "0x0bdDad4fe31f3bc790f304e39aBe6B9302Ee1285" }
                ],
            },
            {
                "transactionId": "0x188b6515af07e339f55f1581001c010db22381aab6426cd484dd4cc09246ce84",
                "timestamp": 1685120359891,
                "inAssetId": 1027, // ETH
                "inTokens": 3.25,
                "blockchain": "Polygon",
                "classification": "Budget Allocation",
                "initiator": 2,
                "executer": 1,
                "toAddress": "0xe6dA2eE2f4ce9ED814CcEf10CFfcAca806999396"
            }
        ],
        "proposals": [
            {
                "proposalId": "0x28443d391cf2b4ba2f5df60e0686fbf1s9774049ffa7dc180adf959d31deafec",
                "timestamp": 1695802080696,
                "outAssetId": 1975, // LINK
                "outTokens": 150.75,
                "blockchain": "Ethereum",
                "classification": "Q4 Marketing Push",
                "initiator": 3,
                "toAddress": [
                    { "toAddress": "0x58d027624e44443dfD1dA8b0d109846aC3925969" },
                    { "toAddress": "0x9aBf7599eF4B23E31a53949e80eBD4324338873a" }
                ],
                "approvals": [
                    { "approverId": 1 },
                ],
                "status": "approval required",
            }
        ]
    },
    {
        "id": 2,
        "address": "0x89a4b83EE41DFaca37eD50eEdCCbf22F9185C29E",
        "type": 2,
        "name": "Treasury",
        "blockchain": "Ethereum",
        "members": [
            {
                "memberId": 1,
                "role": "admin",
            },
            {
                "memberId": 2,
                "role": "approver",
            },
            {
                "memberId": 3,
                "role": "approver",
            },
        ],
        "threshold": 2,
        "balance": [
            {
                "assetId": 1027, // ETH
                "tokens": 124.56,
            },
            {
                "assetId": 1518, // MKR
                "tokens": 85.25,
            },
            {
                "assetId": 825, // USDT
                "tokens": 50000.00,
            },
            {
                "assetId": 3408, // USDC
                "tokens": 75000.00,
            },
            {
                "assetId": 5632, // SNX
                "tokens": 1200.45,
            }
        ],
        "transactions": [
            {
                "transactionId": "0x188b6515af07e339f55f1581001c010db22381aab6426cd484dd4cc09246ce91",
                "timestamp": 1695301319215,
                "inAssetId": 1518, // MKR
                "inTokens": 5.25,
                "blockchain": "Ethereum",
                "classification": "Investment Return",
                "initiator": 1,
                "executer": 1,
                "toAddress": {
                    "addressId": 13
                }
            },
        ],
        "proposals": [
            {
                "proposalId": "0x188b6515af07e339f55f1581001sda0db298781aab64261d484dd4cc09246ce84",
                "timestamp": 1695544533722,
                "outAssetId": 5632, // SNX
                "outTokens": 300.00,
                "blockchain": "Ethereum",
                "classification": "Infrastructure Upgrade",
                "initiator": 2,
                "toAddress": "0xece7b64C4226902Ab07fe24aba2d837a8b426688",
                "approvals": [
                    { "approverId": 1 },
                    { "approverId": 2 },
                ],
                "status": "awaiting nonce",
            },
        ]
    },
    {
        "id": 3,
        "address": "0x56A4b83EE41DFaca37eD50eEdCCbf22F9185C29D",
        "type": 3,
        "name": "Development",
        "blockchain": "Polygon",
        "balance": [
            {
                "assetId": 3890, // MATIC
                "tokens": 25000.00,
            },
            {
                "assetId": 7278, // AAVE
                "tokens": 45.75,
            },
            {
                "assetId": 825, // USDT
                "tokens": 15000.00,
            },
            {
                "assetId": 1027, // ETH
                "tokens": 5.67,
            },
            {
                "assetId": 8290, // CRV
                "tokens": 850.20,
            }
        ],
        "transactions": [
            {
                "transactionId": "0x588c251608c6c03f4d05401056637ab47404de953b32b626c14b3dfba4952d67",
                "timestamp": 1695301734215,
                "outAssetId": 7278, // AAVE
                "outTokens": 12.50,
                "blockchain": "Polygon",
                "classification": "Contract Deployment",
                "initiator": 1,
                "executer": 1,
                "toAddress": {
                    "addressId": 16
                },
            },
        ],
        "proposals": []
    },
    {
        "id": 4,
        "address": "0x67b5c94EE41DFaca37eD50eEdCCbf22F9185C29F",
        "type": 1,
        "name": "Operations",
        "blockchain": [
            { "blockchain": "Ethereum" },
            { "blockchain": "Polygon" }
        ],
        "members": [
            {
                "memberId": 1,
                "role": ["admin", "approver"],
            },
            {
                "memberId": 4,
                "role": "approver",
            },
            {
                "memberId": 5,
                "role": "viewer",
            },
        ],
        "threshold": 2,
        "transactionLimit": 5000,
        "allowedAssets": [
            { "assetId": 825 }, // USDT
            { "assetId": 3408 }, // USDC
            { "assetId": 3890 }, // MATIC
        ],
        "balance": [
            {
                "assetId": 825, // USDT
                "tokens": 25000.00,
            },
            {
                "assetId": 3408, // USDC
                "tokens": 15000.00,
            },
            {
                "assetId": 1027, // ETH
                "tokens": 2.34,
            },
            {
                "assetId": 6758, // SNX
                "tokens": 650.80,
            },
            {
                "assetId": 8290, // CRV
                "tokens": 425.15,
            }
        ],
        "transactions": [
            {
                "transactionId": "0x188b6515af07e33das5fasd41001c010db22381aab64261d484dd4cc09246ce84",
                "timestamp": 1684937653722,
                "outAssetId": 6758, // SNX
                "outTokens": 150.25,
                "blockchain": "Polygon",
                "classification": "Team Expenses",
                "initiator": 1,
                "executer": 4,
                "toAddress": "0x6c3E8800349C5053ae4Ed24F2562a533FEde8D4D"
            },
        ],
        "proposals": [
            {
                "proposalId": "0x28443d391cf2b4ba2f5df60efeb6fbfeb9774049ffa7dc180adf959d31deafec",
                "timestamp": 1695802080696,
                "outAssetId": 8290, // CRV
                "outTokens": 200.75,
                "blockchain": "Ethereum",
                "classification": "Office Equipment",
                "initiator": 4,
                "toAddress": [
                    { "toAddress": "0x89546f17A1793724a7C1F47665DCE7FFd7aE6061" },
                    { "toAddress": "0x65A8F07Bd9A8598E1b5B6C0a88F4779DBC077675" }
                ],
                "approvals": [
                    { "approverId": 1 },
                ],
                "status": "approval required",
            }
        ]
    },
    {
        "id": 5,
        "address": "0x78c6d83EE41DFaca37eD50eEdCCbf22F9185C29G",
        "type": 2,
        "name": "Grants",
        "blockchain": "Ethereum",
        "members": [
            {
                "memberId": 1,
                "role": "admin",
            },
            {
                "memberId": 2,
                "role": "approver",
            },
            {
                "memberId": 6,
                "role": "approver",
            },
        ],
        "threshold": 2,
        "balance": [
            {
                "assetId": 1027, // ETH
                "tokens": 45.67,
            },
            {
                "assetId": 1896, // COMP
                "tokens": 125.40,
            },
            {
                "assetId": 825, // USDT
                "tokens": 100000.00,
            },
            {
                "assetId": 3408, // USDC
                "tokens": 75000.00,
            },
            {
                "assetId": 11156, // YFI
                "tokens": 1.85,
            },
            {
                "assetId": 8104, // 1INCH
                "tokens": 2500.75,
            }
        ],
        "transactions": [
            {
                "transactionId": "0x588c257528c6c03f4d05401056637ab33304d7953b312426c14b3dffb4952d67",
                "timestamp": 1688891080696,
                "outAssetId": 1896, // COMP
                "outTokens": 25.50,
                "blockchain": "Ethereum",
                "classification": "Research Grant",
                "initiator": 2,
                "executer": 1,
                "toAddress": {
                    "addressId": 23
                }
            },
            {
                "transactionId": "0x588c257528c6c03f4d00cz3056637ab47404d7953b312426c14b3dffb4952d67",
                "timestamp": 1688891080696,
                "outAssetId": 8104, // 1INCH
                "outTokens": 500.25,
                "blockchain": "Ethereum",
                "classification": "Community Grant",
                "initiator": 1,
                "executer": 2,
                "toAddress": {
                    "addressId": 26
                }
            }
        ],
        "proposals": [
            {
                "proposalId": "0x188b6515af07e339f55f15sda01c010db22381aab6426cd484dd4cc09246ce84",
                "timestamp": 1695661680696,
                "outAssetId": 11156, // YFI
                "outTokens": 0.75,
                "blockchain": "Ethereum",
                "classification": "Ecosystem Development",
                "initiator": 6,
                "toAddress": {
                    "addressId": 13
                },
                "approvals": [
                    { "approverId": 1 },
                    { "approverId": 2 },
                ],
                "status": "execution failed",
            }
        ]
    }
];

module.exports = wallets;
