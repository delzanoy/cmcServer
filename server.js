const express = require('express');
const cors = require('cors');
const moment = require('moment');
const axios = require('axios');
const uuid = require('uuid');
const port = process.env.PORT || 3001
const wallets = require('./walletsDb')
const workspaces = require('./workspaceDB')
const membersTemp = require('./membersDB')
const addresses = require('./addressesDb')
const groups = require('./groupsDb')
let colours = ['#CFE3FD', '#F1E4F7', '#E6FAF1', '#EEFDD7', '#E8E8E8']
const cryptocurrencies = require('./cryptocurrencies')

const app = express();

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// Create a new array to store the members with colors.
const members = [];

// Iterate over the members and assign a color to each one.
membersTemp.forEach((member, index) => {
  members.push({
    ...member,
    colour: colours[index % colours.length],
  });
});

app.get('/crypto', (req, res) => {
  new Promise(async (resolve, reject) => {
    try {
      response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        headers: {
          'X-CMC_PRO_API_KEY': '68d5b06e-e05e-4163-a22c-8dbc35d5aa0f',
        },
      });
    } catch (ex) {
      response = null;
      // error
      console.log(ex);
      reject(ex);
    }
    if (response) {
      // success
      const json = response.data.data;

      res.json(json);
      resolve(json);
    }
  });
})
// let cryptocurrencies = [];
// async function fetchCryptoData() {
//   try {
//     console.log('Fetching crypto data...');
//     const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
//       headers: { 'X-CMC_PRO_API_KEY': '68d5b06e-e05e-4163-a22c-8dbc35d5aa0f' },
//       params: { start: 1, limit: 100, convert: 'USD' }
//     });
    
//     cryptocurrencies = response.data.data;
//     console.log(`Updated ${cryptoData.length} cryptocurrencies at ${new Date().toISOString()}`);
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// }

// fetchCryptoData();

// // Update every 5 minutes
// setInterval(fetchCryptoData, 5 * 60 * 1000);



app.get('/workspaces', (req, res) => {
  res.json(workspaces);
})

app.get('/members', (req, res) => {
  if (parseFloat(req.query.wallet) > 0) {
    let tempMembers = []
    wallets.forEach(wallet => {
      if (parseFloat(req.query.wallet) === wallet.id) {
        wallet.members.forEach(walletMember => {
          members.forEach(member => {
            if (member.id === walletMember.memberId) {
              let tempMember = {
                id: member.id,
                name: member.name,
                email: member.email,
                role: walletMember.role,
                colour: member.colour,
              }
              tempMembers.push(tempMember);
            }
          })
        })
      }
    })
    return res.json(tempMembers)
  }
  res.json(members);
})


app.get('/wallets', (req, res) => {
  res.json(wallets);
})


app.get('/wallet/:id', (req, res) => {
  if (wallets.some(e => e.id === parseFloat(req.params.id))) {
    wallets.find(wallet => {
      if (wallet.id === parseFloat(req.params.id)) {
        res.json(wallet)
      }
    })
  } else {
    res.status(400).json({ msg: "Wallet does not exist" })
  }
})

// // New assets with wallet share
// app.get('/assets', (req, res) => {
//   // Filter wallets if walletId is provided
//   const filteredWallets = req.query.walletId >= 0 
//     ? wallets.filter(wallet => wallet.id === parseFloat(req.query.walletId))
//     : wallets;

//   // Create an object to store the assets for each assetId and blockchain
//   const assets = [];

//   function rearrangeArrayFromHighestUSDToLowest(array) {
//     return array.sort((a, b) => (b.totalTokens * b.price) - (a.totalTokens * a.price));
//   }

//   // Process wallets and aggregate asset data
//   filteredWallets.forEach(wallet => {
//     wallet.balance.forEach(asset => {
//       const assetId = asset.assetId;
//       const blockchain = wallet.blockchain;

//       // Find or create asset data
//       let existingAssetData = assets.find(
//         assetData => assetData.assetId === assetId && assetData.blockchain === blockchain
//       );
      
//       if (!existingAssetData) {
//         existingAssetData = {
//           uniqueId: uuid.v4(),
//           assetId,
//           blockchain,
//           countOfWallets: 0,
//           totalTokens: 0,
//           expanded: false,
//           wallets: [],
//           percentageShareInUSD: 0,
//         };
//         assets.push(existingAssetData);
//       }

//       // Update asset aggregates
//       existingAssetData.countOfWallets++;
//       existingAssetData.totalTokens += asset.tokens;

//       // Add wallet to asset's wallet list with percentage share
//       existingAssetData.wallets.push({ 
//         balance: asset.tokens, 
//         assetId: assetId, 
//         walletId: wallet.id, 
//         walletType: wallet.type, 
//         name: wallet.name 
//       });
//     });
//   });

//   // Enrich with cryptocurrency data
//   assets.forEach(asset => {
//     const crypto = cryptocurrencies.find(c => c.id == asset.assetId);
//     if (crypto) {
//       asset.percent_change_24h = crypto.quote.USD.percent_change_24h;
//       asset.price = crypto.quote.USD.price;
//       asset.symbol = crypto.symbol.toLowerCase();
//       asset.name = crypto.symbol;
//       asset.fullName = crypto.name;
//     }
//   });

//   // Calculate USD values and total portfolio value
//   let totalValueOfAllAssetsInUSD = 0;
//   assets.forEach(asset => {
//     asset.USD = asset.price * asset.totalTokens;
//     totalValueOfAllAssetsInUSD += asset.USD;
//   });

//   // Calculate percentage shares
//   assets.forEach(asset => {
//     // Percentage of this asset in the total portfolio
//     asset.percentageShareInUSD = (asset.USD * 100 / totalValueOfAllAssetsInUSD);
    
//     // Calculate percentage share per wallet for this specific asset
//     asset.wallets.forEach(wallet => {
//       wallet.percentageShare = (wallet.balance * 100 / asset.totalTokens);
//     });
//   });

//   const sortedAssets = rearrangeArrayFromHighestUSDToLowest(assets);
//   return res.json(sortedAssets);
// });
// Assets with wallet share end





// New assets with wallet share
app.get('/assets', (req, res) => {
  // Filter wallets if walletId is provided
  const filteredWallets = req.query.walletId >= 0 
    ? wallets.filter(wallet => wallet.id === parseFloat(req.query.walletId))
    : wallets;

  // Create an object to store the assets for each assetId and blockchain
  const assets = [];

  function rearrangeArrayFromHighestUSDToLowest(array) {
    return array.sort((a, b) => (b.totalTokens * b.price) - (a.totalTokens * a.price));
  }

  // Process wallets and aggregate asset data
  filteredWallets.forEach(wallet => {
    wallet.balance.forEach(asset => {
      const assetId = asset.assetId;
      const blockchain = wallet.blockchain;

      // Find or create asset data
      let existingAssetData = assets.find(
        assetData => assetData.assetId === assetId && assetData.blockchain === blockchain
      );
      
      if (!existingAssetData) {
        existingAssetData = {
          uniqueId: uuid.v4(),
          assetId,
          blockchain,
          countOfWallets: 0,
          totalTokens: 0,
          expanded: false,
          wallets: [],
          percentageShareInUSD: 0,
        };
        assets.push(existingAssetData);
      }

      // Update asset aggregates
      existingAssetData.countOfWallets++;
      existingAssetData.totalTokens += asset.tokens;

      // Add wallet to asset's wallet list with percentage share
      existingAssetData.wallets.push({ 
        balance: asset.tokens, 
        assetId: assetId, 
        walletId: wallet.id, 
        walletType: wallet.type, 
        name: wallet.name,
      });
    });
  });

  // Enrich with cryptocurrency data
  assets.forEach(asset => {
    const crypto = cryptocurrencies.find(c => c.id == asset.assetId);
    if (crypto) {
      asset.percent_change_24h = crypto.quote.USD.percent_change_24h;
      asset.price = crypto.quote.USD.price;
      asset.symbol = crypto.symbol.toLowerCase();
      asset.name = crypto.symbol;
      asset.fullName = crypto.name;
    }
  });

  // Calculate USD values and total portfolio value
  let totalValueOfAllAssetsInUSD = 0;
  assets.forEach(asset => {
    asset.USD = asset.price * asset.totalTokens;
    totalValueOfAllAssetsInUSD += asset.USD;
  });

  // Calculate percentage shares
  assets.forEach(asset => {
    // Percentage of this asset in the total portfolio
    asset.percentageShareInUSD = (asset.USD * 100 / totalValueOfAllAssetsInUSD);
    
    // Calculate percentage share per wallet for this specific asset
    asset.wallets.forEach(wallet => {
      wallet.percentageShare = (wallet.balance * 100 / asset.totalTokens);
    });
  });

  const sortedAssets = rearrangeArrayFromHighestUSDToLowest(assets);
  return res.json(sortedAssets);
});







app.get('/assets/:id', (req, res) => {
  if (parseFloat(req.params.id) > 0) {

  }
})

app.get('/balance/:id', (req, res) => {
  let total = 0;
  let proposed = 0;
  if (wallets.some(e => e.id === parseFloat(req.params.id))) {
    wallets.find(wallet => {
      if (wallet.id === parseFloat(req.params.id)) {
        cryptocurrencies.forEach(crypto => {
          wallet.balance.forEach(bal => {
            if(crypto.id === bal.assetId)  {
              total += (bal.tokens * crypto.quote.USD.price)
            }
          })
          if(wallet.proposals.length > 0) {
            wallet.proposals.forEach(proposal => {
              if(proposal.hasOwnProperty("outAssetId")) {
                if(proposal.outAssetId === crypto.id) {
                  proposed += (proposal.outTokens * crypto.quote.USD.price)
                }
              }
              if(proposal.hasOwnProperty("inAssetId")) {
                if(proposal.outAssetId === crypto.id) {
                  total += (proposal.outTokens * crypto.quote.USD.price)
                }
              }
            })
          } else {
            proposed = 0;
          }
        })
        res.json({
          total: total,
          proposed: proposed,
        })
      }
    })
  } else {
    res.status(400).json({ msg: "Wallet does not exist" })
  }
})


app.get('/transactions', (req, res) => {
// all Tx start
  if (req.query.page === undefined) {
      let transactionsList = []
      wallets.forEach(wallet => {
        if (Object.keys(wallet.transactions).length > 0) {
          wallet.transactions.forEach(transaction => {
            let transactionTemp = {
              id: transaction.transactionId,
              timestamp: transaction.timestamp,
              moreThan3: false,
              titleTransaction: true,
              expanded: false,
              incoming: transaction.hasOwnProperty("inAssetId"),
              outgoing: transaction.hasOwnProperty("outAssetId"),
              walletId: wallet.id,
              wallet: wallet.name,
              walletType: wallet.type,
              blockchain: transaction.blockchain,
              multiRecipient: Array.isArray(transaction.toAddress),
              recipients: transaction.toAddress,
              inTokens: transaction.hasOwnProperty("inAssetId") ? parseFloat(transaction.inTokens) : null,
              outTokens: transaction.hasOwnProperty("outAssetId") ? parseFloat(transaction.outTokens) : null,
              classification: transaction.classification,
            }
            cryptocurrencies.forEach(crypto => {
              if (crypto.id === transaction.outAssetId) {
                transactionTemp.outTokenSymbol = crypto.symbol
                transactionTemp.outUSDPrice = parseFloat(crypto.quote.USD.price)
              }
              if (crypto.id === transaction.inAssetId) {
                transactionTemp.inTokenSymbol = crypto.symbol
                transactionTemp.inUSDPrice = parseFloat(crypto.quote.USD.price)
              }
              members.forEach(member => {
                if (member.id === transaction.initiator) {
                  transactionTemp.initiator = member.name
                }
                if (member.id === transaction.executer) {
                  transactionTemp.executer = member.name
                }
              })
            })
            transactionsList.push(transactionTemp);

          })
        }
      });

      let newList = transactionsList.sort(function (x, y) {
        return y.timestamp - x.timestamp;
      })
      const currentPage = parseFloat(req.query.page)
      const transactionsPerPage = 25
      const lastIndex = (currentPage + 1) * transactionsPerPage
      const firstIndex = lastIndex - transactionsPerPage
      const transactions = newList.slice(firstIndex, lastIndex)
      const transactionsCount = transactionsList.length

      for (let i = 0; i < transactions.length - 1; i++) {
        if (transactions[i].timestamp - transactions[i + 1].timestamp < (1000 * 60 * 60 * 24)) {
          transactions[i + 1].titleTransaction = false
        }
      }

      for (let i = 0; i < transactions.length; i++) {
        if (moment(Date.now()).diff(moment(transactions[i].timestamp), 'days') < 3) {
          transactions[i].moreThan3 = true
        }
      }

      return res.json({ transactions, transactionsCount });
  }
// all Tx ends here










  
  
  if (parseFloat(req.query.page) >= 0) {
    if (parseFloat(req.query.walletId) > 0) {
      let transactionsList = []
      wallets.forEach(wallet => {
        if (Object.keys(wallet.transactions).length > 0) {
          wallet.transactions.forEach(transaction => {
            if (wallet.id === parseFloat(req.query.walletId)) {
              let transactionTemp = {
                id: transaction.transactionId,
                timestamp: transaction.timestamp,
                moreThan3: false,
                titleTransaction: true,
                expanded: false,
                incoming: transaction.hasOwnProperty("inAssetId"),
                outgoing: transaction.hasOwnProperty("outAssetId"),
                walletId: wallet.id,
                wallet: wallet.name,
                walletType: wallet.type,
                blockchain: transaction.blockchain,
                multiRecipient: Array.isArray(transaction.toAddress),
                recipients: transaction.toAddress,
                inTokens: transaction.hasOwnProperty("inAssetId") ? parseFloat(transaction.inTokens) : null,
                outTokens: transaction.hasOwnProperty("outAssetId") ? parseFloat(transaction.outTokens) : null,
                classification: transaction.classification,
              }
              cryptocurrencies.forEach(crypto => {
                if (crypto.id === transaction.outAssetId) {
                  transactionTemp.outTokenSymbol = crypto.symbol
                  transactionTemp.outUSDPrice = parseFloat(crypto.quote.USD.price)
                }
                if (crypto.id === transaction.inAssetId) {
                  transactionTemp.inTokenSymbol = crypto.symbol
                  transactionTemp.inUSDPrice = parseFloat(crypto.quote.USD.price)
                }
                members.forEach(member => {
                  if (member.id === transaction.initiator) {
                    transactionTemp.initiator = member.name
                  }
                  if (member.id === transaction.executer) {
                    transactionTemp.executer = member.name
                  }
                })
              })
              transactionsList.push(transactionTemp);
            }
          })
        }
      });

      let newList = transactionsList.sort(function (x, y) {
        return y.timestamp - x.timestamp;
      })

      const currentPage = parseFloat(req.query.page)
      const transactionsPerPage = 25
      const lastIndex = (currentPage + 1) * transactionsPerPage
      const firstIndex = lastIndex - transactionsPerPage
      const transactions = newList.slice(firstIndex, lastIndex)
      const transactionsCount = transactionsList.length

      for (let i = 0; i < transactions.length - 1; i++) {
        if (transactions[i].timestamp - transactions[i + 1].timestamp < (1000 * 60 * 60 * 24)) {
          transactions[i + 1].titleTransaction = false
        }
      }

      for (let i = 0; i < transactions.length; i++) {
        if (moment(Date.now()).diff(moment(transactions[i].timestamp), 'days') < 3) {
          transactions[i].moreThan3 = true
        }
      }
      return res.json({ transactions, transactionsCount });
    } else {
      let transactionsList = []
      wallets.forEach(wallet => {
        if (Object.keys(wallet.transactions).length > 0) {
          wallet.transactions.forEach(transaction => {
            let transactionTemp = {
              id: transaction.transactionId,
              timestamp: transaction.timestamp,
              moreThan3: false,
              titleTransaction: true,
              expanded: false,
              incoming: transaction.hasOwnProperty("inAssetId"),
              outgoing: transaction.hasOwnProperty("outAssetId"),
              walletId: wallet.id,
              wallet: wallet.name,
              walletType: wallet.type,
              blockchain: transaction.blockchain,
              multiRecipient: Array.isArray(transaction.toAddress),
              recipients: transaction.toAddress,
              inTokens: transaction.hasOwnProperty("inAssetId") ? parseFloat(transaction.inTokens) : null,
              outTokens: transaction.hasOwnProperty("outAssetId") ? parseFloat(transaction.outTokens) : null,
              classification: transaction.classification,
            }
            cryptocurrencies.forEach(crypto => {
              if (crypto.id === transaction.outAssetId) {
                transactionTemp.outTokenSymbol = crypto.symbol
                transactionTemp.outUSDPrice = parseFloat(crypto.quote.USD.price)
              }
              if (crypto.id === transaction.inAssetId) {
                transactionTemp.inTokenSymbol = crypto.symbol
                transactionTemp.inUSDPrice = parseFloat(crypto.quote.USD.price)
              }
              members.forEach(member => {
                if (member.id === transaction.initiator) {
                  transactionTemp.initiator = member.name
                }
                if (member.id === transaction.executer) {
                  transactionTemp.executer = member.name
                }
              })
            })
            transactionsList.push(transactionTemp);

          })
        }
      });

      let newList = transactionsList.sort(function (x, y) {
        return y.timestamp - x.timestamp;
      })
      const currentPage = parseFloat(req.query.page)
      const transactionsPerPage = 25
      const lastIndex = (currentPage + 1) * transactionsPerPage
      const firstIndex = lastIndex - transactionsPerPage
      const transactions = newList.slice(firstIndex, lastIndex)
      const transactionsCount = transactionsList.length

      for (let i = 0; i < transactions.length - 1; i++) {
        if (transactions[i].timestamp - transactions[i + 1].timestamp < (1000 * 60 * 60 * 24)) {
          transactions[i + 1].titleTransaction = false
        }
      }

      for (let i = 0; i < transactions.length; i++) {
        if (moment(Date.now()).diff(moment(transactions[i].timestamp), 'days') < 3) {
          transactions[i].moreThan3 = true
        }
      }

      return res.json({ transactions, transactionsCount });
    }

  }
})

app.get('/transactions/:id', (req, res) => {
  if (parseFloat(req.query.page) >= 0) {
    let transactionsList = []
    wallets.forEach(wallet => {

      if (Object.keys(wallet.transactions).length > 0) {
        wallet.transactions.forEach(transaction => {
          if (transaction.id === parseFloat(req.params.id)) {
            let transactionTemp = {
              id: transaction.transactionId,
              timestamp: transaction.timestamp,
              moreThan3: false,
              titleTransaction: true,
              expanded: false,
              incoming: transaction.hasOwnProperty("inAssetId"),
              outgoing: transaction.hasOwnProperty("outAssetId"),
              walletId: wallet.id,
              wallet: wallet.name,
              walletType: wallet.type,
              blockchain: transaction.blockchain,
              multiRecipient: Array.isArray(transaction.toAddress),
              recipients: transaction.toAddress,
              inTokens: transaction.hasOwnProperty("inAssetId") ? parseFloat(transaction.inTokens) : null,
              outTokens: transaction.hasOwnProperty("outAssetId") ? parseFloat(transaction.outTokens) : null,
              classification: transaction.classification,
            }
            cryptocurrencies.forEach(crypto => {
              if (crypto.id === transaction.outAssetId) {
                transactionTemp.outTokenSymbol = crypto.symbol
                transactionTemp.outUSDPrice = parseFloat(crypto.quote.USD.price)
              }
              if (crypto.id === transaction.inAssetId) {
                transactionTemp.inTokenSymbol = crypto.symbol
                transactionTemp.inUSDPrice = parseFloat(crypto.quote.USD.price)
              }
              members.forEach(member => {
                if (member.id === transaction.initiator) {
                  transactionTemp.initiator = member.name
                }
                if (member.id === transaction.executer) {
                  transactionTemp.executer = member.name
                }
              })
            })
            transactionsList.push(transactionTemp);
          }
        })
      }

    });

    let newList = transactionsList.sort(function (x, y) {
      return y.timestamp - x.timestamp;
    })

    const currentPage = parseFloat(req.query.page)
    const transactionsPerPage = 25
    const lastIndex = (currentPage + 1) * transactionsPerPage
    const firstIndex = lastIndex - transactionsPerPage
    const transactions = newList.slice(firstIndex, lastIndex)
    const transactionsCount = transactionsList.length

    for (let i = 0; i < transactions.length - 1; i++) {
      if (transactions[i].timestamp - transactions[i + 1].timestamp < (1000 * 60 * 60 * 24)) {
        transactions[i + 1].titleTransaction = false
      }
    }

    for (let i = 0; i < transactions.length; i++) {
      if (moment(Date.now()).diff(moment(transactions[i].timestamp), 'days') < 3) {
        transactions[i].moreThan3 = true
      }
    }

    return res.json({ transactions, transactionsCount });
  }
})


app.get('/proposals/needs-approval', (req, res) => {
  let needsApproval = []
  wallets.forEach(wallet => {
    if (parseFloat(req.query.walletId) >= 0) {

      if (parseFloat(req.query.walletId) === wallet.id) {

        if (Object.keys(wallet.proposals).length > 0) {
          wallet.proposals.forEach(proposal => {

            if (proposal.status === "no action" || proposal.status === "actioned" || proposal.status === "approval required") {
              let proposalTemp = {
                id: proposal.proposalId,
                timestamp: proposal.timestamp,
                moreThan3: false,
                titleTransaction: true,
                walletId: wallet.id,
                wallet: wallet.name,
                walletType: wallet.type,
                blockchain: proposal.blockchain,
                multiRecipient: Array.isArray(proposal.toAddress),
                recipients: proposal.toAddress,
                outTokens: proposal.outTokens,
                classification: proposal.classification,
                approvals: proposal.approvals,
                status: proposal.status
              }
              cryptocurrencies.forEach(crypto => {
                if (crypto.id === proposal.outAssetId) {
                  proposalTemp.outTokenSymbol = crypto.symbol
                  proposalTemp.outUSDPrice = parseFloat(crypto.quote.USD.price)
                }
              })
              members.forEach(member => {
                if (member.id === proposal.initiator) {
                  proposalTemp.initiator = member.name,
                    proposalTemp.initiatorColour = member.colour
                }
              })
              needsApproval.push(proposalTemp)
            }
          })
        }
      }
    } else {
      if (Object.keys(wallet.proposals).length > 0) {
        wallet.proposals.forEach(proposal => {
          if (proposal.status === "no action" || proposal.status === "actioned" || proposal.status === "approval required") {
            let proposalTemp = {
              id: proposal.proposalId,
              timestamp: proposal.timestamp,
              moreThan3: false,
              titleTransaction: true,
              walletId: wallet.id,
              wallet: wallet.name,
              walletType: wallet.type,
              blockchain: proposal.blockchain,
              multiRecipient: Array.isArray(proposal.toAddress),
              recipients: proposal.toAddress,
              outTokens: proposal.outTokens,
              classification: proposal.classification,
              approvals: proposal.approvals,
              status: proposal.status
            }
            cryptocurrencies.forEach(crypto => {
              if (crypto.id === proposal.outAssetId) {
                proposalTemp.outTokenSymbol = crypto.symbol
                proposalTemp.outUSDPrice = parseFloat(crypto.quote.USD.price)
              }
            })
            members.forEach(member => {
              if (member.id === proposal.initiator) {
                proposalTemp.initiator = member.name,
                  proposalTemp.initiatorColour = member.colour
              }
            })
            needsApproval.push(proposalTemp)
          }
        })
      }
    }

  });


  let needsApprovalListTemp = needsApproval.sort(function (x, y) {
    return y.timestamp - x.timestamp;
  })

  const currentPage = parseFloat(req.query.page) || 0
  const needsApprovalPerPage = 25
  const lastIndex = (currentPage + 1) * needsApprovalPerPage
  const firstIndex = lastIndex - needsApprovalPerPage
  const needsApprovalList = needsApprovalListTemp.slice(firstIndex, lastIndex)
  const needsApprovalCount = needsApproval.length


  for (let i = 0; i < needsApprovalList.length - 1; i++) {
    if (needsApprovalList[i].timestamp - needsApprovalList[i + 1].timestamp < (1000 * 60 * 60 * 24)) {
      needsApprovalList[i + 1].titleTransaction = false
    }
  }

  for (let i = 0; i < needsApprovalList.length; i++) {
    if (moment(Date.now()).diff(moment(needsApprovalList[i].timestamp), 'days') < 3) {
      needsApprovalList[i].moreThan3 = true
    }
  }

  return res.json({ needsApproval: needsApprovalList, needsApprovalCount });
})




app.get('/proposals/ready-to-execute', (req, res) => {
  let readyToExecute = []
  wallets.forEach(wallet => {
    if (parseFloat(req.query.walletId) >= 0) {

      if (parseFloat(req.query.walletId) === wallet.id) {

        if (Object.keys(wallet.proposals).length > 0) {
          wallet.proposals.forEach(proposal => {

            if (proposal.status === "executing" || proposal.status === "execution failed" || proposal.status === "execution ready" || proposal.status === "awaiting nonce") {
              let proposalTemp = {
                id: proposal.proposalId,
                timestamp: proposal.timestamp,
                moreThan3: false,
                titleTransaction: true,
                walletId: wallet.id,
                wallet: wallet.name,
                walletType: wallet.type,
                blockchain: proposal.blockchain,
                multiRecipient: Array.isArray(proposal.toAddress),
                recipients: proposal.toAddress,
                outTokens: proposal.outTokens,
                classification: proposal.classification,
                approvals: proposal.approvals,
                status: proposal.status
              }
              cryptocurrencies.forEach(crypto => {
                if (crypto.id === proposal.outAssetId) {
                  proposalTemp.outTokenSymbol = crypto.symbol
                  proposalTemp.outUSDPrice = parseFloat(crypto.quote.USD.price)
                }
              })
              members.forEach(member => {
                if (member.id === proposal.initiator) {
                  proposalTemp.initiator = member.name,
                    proposalTemp.initiatorColour = member.colour
                }
              })
              readyToExecute.push(proposalTemp)

            }
          })
        }
      }
    } else {
      if (Object.keys(wallet.proposals).length > 0) {
        wallet.proposals.forEach(proposal => {
          if (proposal.status === "executing" || proposal.status === "execution failed" || proposal.status === "execution ready" || proposal.status === "awaiting nonce") {
            let proposalTemp = {
              id: proposal.proposalId,
              timestamp: proposal.timestamp,
              moreThan3: false,
              titleTransaction: true,
              walletId: wallet.id,
              wallet: wallet.name,
              walletType: wallet.type,
              blockchain: proposal.blockchain,
              multiRecipient: Array.isArray(proposal.toAddress),
              recipients: proposal.toAddress,
              outTokens: proposal.outTokens,
              classification: proposal.classification,
              approvals: proposal.approvals,
              status: proposal.status
            }
            cryptocurrencies.forEach(crypto => {
              if (crypto.id === proposal.outAssetId) {
                proposalTemp.outTokenSymbol = crypto.symbol
                proposalTemp.outUSDPrice = parseFloat(crypto.quote.USD.price)
              }
            })
            members.forEach(member => {
              if (member.id === proposal.initiator) {
                proposalTemp.initiator = member.name,
                  proposalTemp.initiatorColour = member.colour
              }
            })
            readyToExecute.push(proposalTemp)
          }
        })
      }
    }
  });

  let readyToExecuteTemp = readyToExecute.sort(function (x, y) {
    return y.timestamp - x.timestamp;
  })

  const currentPage = parseFloat(req.query.page)
  const readyToExecutePerPage = 25
  const lastIndex = (currentPage + 1) * readyToExecutePerPage
  const firstIndex = lastIndex - readyToExecutePerPage
  const readyToExecuteList = readyToExecuteTemp.slice(firstIndex, lastIndex)
  const readyToExecuteCount = readyToExecuteTemp.length


  for (let i = 0; i < readyToExecuteList.length - 1; i++) {
    if (readyToExecuteList[i].timestamp - readyToExecuteList[i + 1].timestamp < (1000 * 60 * 60 * 24)) {
      readyToExecuteList[i + 1].titleTransaction = false
    }
  }

  for (let i = 0; i < readyToExecuteList.length; i++) {
    if (moment(Date.now()).diff(moment(readyToExecuteList[i].timestamp), 'days') < 3) {
      readyToExecuteList[i].moreThan3 = true
    }
  }

  return res.json({ readyToExecute: readyToExecuteList, readyToExecuteCount });
})


app.get('/proposals/discarded', (req, res) => {

  let discarded = []
  wallets.forEach(wallet => {
    if (parseFloat(req.query.walletId) >= 0) {

      if (parseFloat(req.query.walletId) === wallet.id) {

        if (Object.keys(wallet.proposals).length > 0) {
          wallet.proposals.forEach(proposal => {

            if (proposal.status === "discarded" || proposal.status === "rejected") {
              let proposalTemp = {
                id: proposal.proposalId,
                timestamp: proposal.timestamp,
                moreThan3: false,
                titleTransaction: true,
                walletId: wallet.id,
                wallet: wallet.name,
                walletType: wallet.type,
                blockchain: proposal.blockchain,
                multiRecipient: Array.isArray(proposal.toAddress),
                recipients: proposal.toAddress,
                outTokens: proposal.outTokens,
                classification: proposal.classification,
                approvals: proposal.approvals,
                status: proposal.status
              }
              cryptocurrencies.forEach(crypto => {
                if (crypto.id === proposal.outAssetId) {
                  proposalTemp.outTokenSymbol = crypto.symbol
                  proposalTemp.outUSDPrice = parseFloat(crypto.quote.USD.price)
                }
              })
              members.forEach(member => {
                if (member.id === proposal.initiator) {
                  proposalTemp.initiator = member.name,
                    proposalTemp.initiatorColour = member.colour
                }
              })
              discarded.push(proposalTemp)

            }
          })
        }
      }
    } else {
      if (Object.keys(wallet.proposals).length > 0) {
        wallet.proposals.forEach(proposal => {
          if (proposal.status === "discarded" || proposal.status === "rejected") {
            let proposalTemp = {
              id: proposal.proposalId,
              timestamp: proposal.timestamp,
              moreThan3: false,
              titleTransaction: true,
              walletId: wallet.id,
              wallet: wallet.name,
              walletType: wallet.type,
              blockchain: proposal.blockchain,
              multiRecipient: Array.isArray(proposal.toAddress),
              recipients: proposal.toAddress,
              outTokens: proposal.outTokens,
              classification: proposal.classification,
              approvals: proposal.approvals,
              status: proposal.status
            }
            cryptocurrencies.forEach(crypto => {
              if (crypto.id === proposal.outAssetId) {
                proposalTemp.outTokenSymbol = crypto.symbol
                proposalTemp.outUSDPrice = parseFloat(crypto.quote.USD.price)
              }
            })
            members.forEach(member => {
              if (member.id === proposal.initiator) {
                proposalTemp.initiator = member.name,
                  proposalTemp.initiatorColour = member.colour
              }
            })
            discarded.push(proposalTemp)
          }
        })
      }
    }
  });

  let discardedTemp = discarded.sort(function (x, y) {
    return y.timestamp - x.timestamp;
  })

  const currentPage = parseFloat(req.query.page)
  const discardedPerPage = 25
  const lastIndex = (currentPage + 1) * discardedPerPage
  const firstIndex = lastIndex - discardedPerPage
  const discardedList = discardedTemp.slice(firstIndex, lastIndex)
  const discardedCount = discardedTemp.length


  for (let i = 0; i < discardedList.length - 1; i++) {
    if (discardedList[i].timestamp - discardedList[i + 1].timestamp < (1000 * 60 * 60 * 24)) {
      discardedList[i + 1].titleTransaction = false
    }
  }

  for (let i = 0; i < discardedList.length; i++) {
    if (moment(Date.now()).diff(moment(discardedList[i].timestamp), 'days') < 3) {
      discardedList[i].moreThan3 = true
    }
  }

  return res.json({ discarded: discardedList, discardedCount });
})



app.get('/proposals', (req, res) => {
  if (parseFloat(req.query.wallet) > 0) {
    let needsApproval = []
    let readyToExecute = []
    let discarded = []



    wallets.forEach(wallet => {
      if (wallet.id === parseFloat(req.query.wallet)) {
        if (Object.keys(wallet.proposals).length > 0) {
          wallet.proposals.forEach(proposal => {
            let proposalTemp = {
              id: proposal.proposalId,
              timestamp: proposal.timestamp,
              moreThan3: false,
              titleTransaction: true,
              walletId: wallet.id,
              wallet: wallet.name,
              walletType: wallet.type,
              blockchain: proposal.blockchain,
              multiRecipient: Array.isArray(proposal.toAddress),
              recipients: proposal.toAddress,
              outTokens: proposal.outTokens,
              classification: proposal.classification,
              approvals: proposal.approvals,
              status: proposal.status
            }
            cryptocurrencies.forEach(crypto => {
              if (crypto.id === proposal.outAssetId) {
                proposalTemp.outTokenSymbol = crypto.symbol
                proposalTemp.outUSDPrice = parseFloat(crypto.quote.USD.price)
              }
            })
            members.forEach(member => {
              if (member.id === proposal.initiator) {
                proposalTemp.initiator = member.name,
                  proposalTemp.initiatorColour = member.colour
              }
            })

            if (proposal.status === "executing" || proposal.status === "execution failed" || proposal.status === "execution ready" || proposal.status === "awaiting nonce") {
              readyToExecute.push(proposalTemp)
            }
            if (proposal.status === "discarded" || proposal.status === "rejected") {
              discarded.push(proposalTemp)
            }
            if (proposal.status === "no action" || proposal.status === "actioned" || proposal.status === "approval required") {
              needsApproval.push(proposalTemp)
            }

            // proposalList.push(proposalTemp);
          })
        }
      }
    });

    let proposalList = readyToExecute.concat(discarded.concat(needsApproval))

    let newList = proposalList.sort(function (x, y) {
      return y.timestamp - x.timestamp;
    })

    for (let i = 0; i < newList.length - 1; i++) {
      if (newList[i].timestamp - newList[i + 1].timestamp < (1000 * 60 * 60 * 24)) {
        newList[i + 1].titleTransaction = false
      }
    }

    for (let i = 0; i < newList.length; i++) {
      if (moment(Date.now()).diff(moment(newList[i].timestamp), 'days') < 3) {
        newList[i].moreThan3 = true
      }
    }

    return res.json(newList);
  }



  let needsApproval = []
  let readyToExecute = []
  let discarded = []


  wallets.forEach(wallet => {
    if (Object.keys(wallet.proposals).length > 0) {
      wallet.proposals.forEach(proposal => {
        let proposalTemp = {
          id: proposal.proposalId,
          timestamp: proposal.timestamp,
          moreThan3: false,
          titleTransaction: true,
          walletId: wallet.id,
          wallet: wallet.name,
          walletType: wallet.type,
          blockchain: proposal.blockchain,
          multiRecipient: Array.isArray(proposal.toAddress),
          recipients: proposal.toAddress,
          outTokens: proposal.outTokens,
          classification: proposal.classification,
          approvals: proposal.approvals,
          status: proposal.status
        }
        cryptocurrencies.forEach(crypto => {
          if (crypto.id === proposal.outAssetId) {
            proposalTemp.outTokenSymbol = crypto.symbol
            proposalTemp.outUSDPrice = parseFloat(crypto.quote.USD.price)
          }
        })
        members.forEach(member => {
          if (member.id === proposal.initiator) {
            proposalTemp.initiator = member.name,
              proposalTemp.initiatorColour = member.colour
          }
        })
        if (proposal.status === "executing" || proposal.status === "execution failed" || proposal.status === "execution ready" || proposal.status === "awaiting nonce") {
          readyToExecute.push(proposalTemp)
        }
        if (proposal.status === "discarded" || proposal.status === "rejected") {
          discarded.push(proposalTemp)
        }
        if (proposal.status === "no action" || proposal.status === "actioned" || proposal.status === "approval required") {
          needsApproval.push(proposalTemp)
        }
      })
    }
  });


  const addTitle = (arrayName) => {

    for (let i = 0; i < arrayName.length - 1; i++) {
      if (arrayName[i].timestamp - arrayName[i + 1].timestamp < (1000 * 60 * 60 * 24)) {
        arrayName[i + 1].titleTransaction = false
      }
    }

    for (let i = 0; i < arrayName.length; i++) {
      if (moment(Date.now()).diff(moment(arrayName[i].timestamp), 'days') < 3) {
        arrayName[i].moreThan3 = true
      }
    }

    return arrayName;

  }

  needsApproval = needsApproval.sort(function (x, y) {
    return y.timestamp - x.timestamp;
  })

  readyToExecute = readyToExecute.sort(function (x, y) {
    return y.timestamp - x.timestamp;
  })

  discarded = discarded.sort(function (x, y) {
    return y.timestamp - x.timestamp;
  })

  let needsApprovalNew = addTitle(needsApproval)
  let readyToExecuteNew = addTitle(readyToExecute)
  let discardedNew = addTitle(discarded)

  let proposalList = discardedNew.concat(readyToExecuteNew.concat(needsApprovalNew))



  return res.json(proposalList);
})

app.get('/addresses', (req, res) => {
  addresses.map(address => {
    address.selected = false
    address.groups.forEach(group => {
      groups.forEach(g => {
        if (g.id === group.groupId) {
          group.groupName = g.name
        }
      })
    })
  })
  return res.json(addresses)
})


app.get('/groups', (req, res) => {
  const groupMemberCountsTemp = [];

  // Create a new group for ungrouped addresses.
  const ungroupedGroup = {
    id: 0,
    name: 'Ungrouped',
    count: 0
  };

  // Add the ungrouped group to the array of group member counts.
  groupMemberCountsTemp.push(ungroupedGroup);

  // Iterate over the groups and addresses to count the number of members in each group.
  groups.forEach(group => {
    members.forEach(member => {
      if (member.id === group.lastModifiedById) {
        groupMemberCountsTemp.push({
          id: group.id,
          name: group.name,
          lastModified: group.lastModified,
          lastModifiedById: group.lastModifiedById,
          lastModifiedBy: member.name,
          count: 0,
        });
      }
    })
  });

  addresses.forEach(address => {
    if (address.groups.length === 0) {
      // Add the ungrouped address to the ungrouped group.
      ungroupedGroup.count++;
    } else {
      // Add the address to the corresponding group.
      address.groups.forEach(group => {
        groupMemberCountsTemp.find(groupInfo => groupInfo.id === group.groupId).count++;
      });
    }
  });

  return res.json(groupMemberCountsTemp)
})


app.get('/cryptocurrencies', (req, res) => {

  const tokenUsdMap = [];

  cryptocurrencies.forEach(crypto => {
    tokenUsdMap.push(
      {
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        usdPrice: crypto.quote.USD.price,
        percentchange_24hr: crypto.quote.USD.percent_change_24h
      }
    )
  })

  res.json(cryptocurrencies);
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
