const express = require('express');
const cors = require('cors');
const moment = require('moment');
const axios = require('axios');
const uuid = require('uuid');
const port = process.env.PORT || 3001
const wallets = require('./walletsDb')
const workspaces = require('./workspaceDB')
const members = require('./membersDB')
let colours = ['#CFE3FD', '#F1E4F7', '#E6FAF1', '#EEFDD7', '#E8E8E8']
const cryptocurrencies = require('./cryptocurrencies')

const app = express();

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


for (let j = 0; j < colours.length; j++) {
for (let i = 0; i < members.length; i++) {
    members[i].colour = colours[i]
  }
}


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


app.get('/workspaces', (req, res) => {
  res.json(workspaces);
})

app.get('/members', (req, res) => {
  if (parseInt(req.query.wallet) > 0) {
    let tempMembers = []
    wallets.forEach(wallet => {
      if (parseInt(req.query.wallet) === wallet.id) {
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
  if (wallets.some(e => e.id === parseInt(req.params.id))) {
    wallets.find(wallet => {
      if (wallet.id === parseInt(req.params.id)) {
        res.json(wallet)
      }
    })

  } else {
    res.status(400).json({ msg: "Wallet does not exist" })
  }
})


app.get('/assets', (req, res) => {
  if (parseInt(req.query.wallet) > 0) {
    // Create an object to store the assets for each assetId and blockchain.
    const assets = [];

    function rearrangeArrayFromHighestUSDToLowest(array) {
      // Sort the array in descending order by the `USD` property.
      array.sort((a, b) => (b.totalTokens * b.price) - (a.totalTokens * a.price));
      return array;
    }

    wallets.forEach(wallet => {
      // Iterate over all assets in the wallet.
      if (wallet.id === parseInt(req.query.wallet)) {
        wallet.balance.forEach(asset => {
          // Get the assetId and blockchain.
          const assetId = asset.assetId;
          const blockchain = wallet.blockchain;

          // Create an object to store the asset data.
          const assetData = {
            uniqueId: uuid.v4(),
            assetId,
            blockchain,
            countOfWallets: 0,
            totalTokens: 0,
            expanded: false,
            wallets: [],
            percentageShareInUSD: 0,
          };

          // Find the existing asset data in the assets array, or create a new one if it doesn't exist.
          let existingAssetData = assets.find(
            assetData => assetData.assetId === assetId && assetData.blockchain === blockchain
          );
          if (!existingAssetData) {
            existingAssetData = assetData;
            assets.push(existingAssetData);
          }

          // Increment the count of wallets for the assetId and blockchain.
          existingAssetData.countOfWallets++;

          // Add the tokens to the total for the assetId and blockchain.
          existingAssetData.totalTokens += asset.tokens;

          // Only add the wallet to the list of wallets for the assetId and blockchain if the assetId of the wallet is the same as the assetId of the existing asset data.
          if (wallet.balance.some(balance => balance.assetId === assetId)) {

            // Only add the balance of the assetId to the wallet.
            existingAssetData.wallets.push({ balance: asset.tokens, assetId: assetId, walletId: wallet.id, walletType: wallet.type, name: wallet.name });

          }
        });
      }
    });


    assets.map(asset => {
      cryptocurrencies.map(crypto => {
        if (asset.assetId == crypto.id) {
          asset.percent_change_24h = crypto.quote.USD.percent_change_24h
          asset.price = crypto.quote.USD.price
          asset.symbol = crypto.symbol.toLowerCase()
          asset.name = crypto.symbol
        }
      })
    })

    let totalValueOfAllAssetsInUSD = 0
    assets.map(asset => {
      asset.USD = (asset.price * asset.totalTokens)
      totalValueOfAllAssetsInUSD = asset.USD + totalValueOfAllAssetsInUSD
    })


    assets.map(asset => {
      asset.percentageShareInUSD = (asset.USD * 100 / totalValueOfAllAssetsInUSD)
    })


    const newAssets = rearrangeArrayFromHighestUSDToLowest(assets)

    return res.json(newAssets);

  }

  // Create an object to store the assets for each assetId and blockchain.
  const assets = [];

  function rearrangeArrayFromHighestUSDToLowest(array) {
    // Sort the array in descending order by the `USD` property.
    array.sort((a, b) => (b.totalTokens * b.price) - (a.totalTokens * a.price));
    return array;
  }

  wallets.forEach(wallet => {
    // Iterate over all assets in the wallet.
    wallet.balance.forEach(asset => {
      // Get the assetId and blockchain.
      const assetId = asset.assetId;
      const blockchain = wallet.blockchain;

      // Create an object to store the asset data.
      const assetData = {
        uniqueId: uuid.v4(),
        assetId,
        blockchain,
        countOfWallets: 0,
        totalTokens: 0,
        expanded: false,
        wallets: [],
        percentageShareInUSD: 0,
      };

      // Find the existing asset data in the assets array, or create a new one if it doesn't exist.
      let existingAssetData = assets.find(
        assetData => assetData.assetId === assetId && assetData.blockchain === blockchain
      );
      if (!existingAssetData) {
        existingAssetData = assetData;
        assets.push(existingAssetData);
      }

      // Increment the count of wallets for the assetId and blockchain.
      existingAssetData.countOfWallets++;

      // Add the tokens to the total for the assetId and blockchain.
      existingAssetData.totalTokens += asset.tokens;

      // Only add the wallet to the list of wallets for the assetId and blockchain if the assetId of the wallet is the same as the assetId of the existing asset data.
      if (wallet.balance.some(balance => balance.assetId === assetId)) {

        // Only add the balance of the assetId to the wallet.
        existingAssetData.wallets.push({ balance: asset.tokens, assetId: assetId, walletId: wallet.id, walletType: wallet.type, name: wallet.name });

      }
    });
  });


  assets.map(asset => {
    cryptocurrencies.map(crypto => {
      if (asset.assetId == crypto.id) {
        asset.percent_change_24h = crypto.quote.USD.percent_change_24h
        asset.price = crypto.quote.USD.price
        asset.symbol = crypto.symbol.toLowerCase()
        asset.name = crypto.symbol
      }
    })
  })

  let totalValueOfAllAssetsInUSD = 0
  assets.map(asset => {
    asset.USD = (asset.price * asset.totalTokens)
    totalValueOfAllAssetsInUSD = asset.USD + totalValueOfAllAssetsInUSD
  })


  assets.map(asset => {
    asset.percentageShareInUSD = (asset.USD * 100 / totalValueOfAllAssetsInUSD)
  })

  const newAssets = rearrangeArrayFromHighestUSDToLowest(assets)

  return res.json(newAssets);
})


app.get('/transactions', (req, res) => {
  if (parseInt(req.query.page) >= 0) {
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
            wallet: wallet.name,
            walletType: wallet.type,
            blockchain: transaction.blockchain,
            multiRecipient: Array.isArray(transaction.toAddress),
            recipents: transaction.toAddress,
            inTokens: transaction.hasOwnProperty("inAssetId") ? parseInt(transaction.inTokens) : null,
            outTokens: transaction.hasOwnProperty("outAssetId") ? parseInt(transaction.outTokens) : null,
            classification: transaction.classification,
          }
          cryptocurrencies.forEach(crypto => {
            if (crypto.id === transaction.outAssetId) {
              transactionTemp.outTokenSymbol = crypto.symbol
              transactionTemp.outUSDPrice = parseInt(crypto.quote.USD.price)
            }
            if (crypto.id === transaction.inAssetId) {
              transactionTemp.inTokenSymbol = crypto.symbol
              transactionTemp.inUSDPrice = parseInt(crypto.quote.USD.price)
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

    const currentPage = parseInt(req.query.page)
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

  if (parseInt(req.query.wallet) > 0) {
    let transactionsList = []
    wallets.forEach(wallet => {
      if (wallet.id === parseInt(req.query.wallet)) {
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
              wallet: wallet.name,
              walletType: wallet.type,
              blockchain: transaction.blockchain,
              multiRecipient: Array.isArray(transaction.toAddress),
              recipents: transaction.toAddress,
              inTokens: transaction.hasOwnProperty("inAssetId") ? parseInt(transaction.inTokens) : null,
              outTokens: transaction.hasOwnProperty("outAssetId") ? parseInt(transaction.outTokens) : null,
              classification: transaction.classification,
            }
            cryptocurrencies.forEach(crypto => {
              if (crypto.id === transaction.outAssetId) {
                transactionTemp.outTokenSymbol = crypto.symbol
                transactionTemp.outUSDPrice = parseInt(crypto.quote.USD.price)
              }
              if (crypto.id === transaction.inAssetId) {
                transactionTemp.inTokenSymbol = crypto.symbol
                transactionTemp.inUSDPrice = parseInt(crypto.quote.USD.price)
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
      }
    });
    let newList = transactionsList.sort(function (x, y) {
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
          wallet: wallet.name,
          walletType: wallet.type,
          blockchain: transaction.blockchain,
          multiRecipient: Array.isArray(transaction.toAddress),
          recipents: transaction.toAddress,
          inTokens: transaction.hasOwnProperty("inAssetId") ? parseInt(transaction.inTokens) : null,
          outTokens: transaction.hasOwnProperty("outAssetId") ? parseInt(transaction.outTokens) : null,
          classification: transaction.classification,
        }
        cryptocurrencies.forEach(crypto => {
          if (crypto.id === transaction.outAssetId) {
            transactionTemp.outTokenSymbol = crypto.symbol
            transactionTemp.outUSDPrice = parseInt(crypto.quote.USD.price)
          }
          if (crypto.id === transaction.inAssetId) {
            transactionTemp.inTokenSymbol = crypto.symbol
            transactionTemp.inUSDPrice = parseInt(crypto.quote.USD.price)
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
})

app.get('/transactions/:walletId', (req, res) => {
  if (parseInt(req.query.page) >= 0) {
    console.log(parseInt(req.query.page))
    let transactionsList = []
    wallets.forEach(wallet => {
      if(parseInt(req.params.walletId) === wallet.id) {
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
              wallet: wallet.name,
              walletType: wallet.type,
              blockchain: transaction.blockchain,
              multiRecipient: Array.isArray(transaction.toAddress),
              recipents: transaction.toAddress,
              inTokens: transaction.hasOwnProperty("inAssetId") ? parseInt(transaction.inTokens) : null,
              outTokens: transaction.hasOwnProperty("outAssetId") ? parseInt(transaction.outTokens) : null,
              classification: transaction.classification,
            }
            cryptocurrencies.forEach(crypto => {
              if (crypto.id === transaction.outAssetId) {
                transactionTemp.outTokenSymbol = crypto.symbol
                transactionTemp.outUSDPrice = parseInt(crypto.quote.USD.price)
              }
              if (crypto.id === transaction.inAssetId) {
                transactionTemp.inTokenSymbol = crypto.symbol
                transactionTemp.inUSDPrice = parseInt(crypto.quote.USD.price)
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
      }
    });

    let newList = transactionsList.sort(function (x, y) {
      return y.timestamp - x.timestamp;
    })

    const currentPage = parseInt(req.query.page)
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
  if (parseInt(req.query.page) >= 0) {
    let needsApproval = []
    wallets.forEach(wallet => {
      if (Object.keys(wallet.proposals).length > 0) {
        wallet.proposals.forEach(proposal => {
          if (proposal.status === "no action" || proposal.status === "actioned" || proposal.status === "approval required") {
            let proposalTemp = {
              id: proposal.proposalId,
              timestamp: proposal.timestamp,
              moreThan3: false,
              titleTransaction: true,
              wallet: wallet.name,
              walletType: wallet.type,
              blockchain: proposal.blockchain,
              multiRecipient: Array.isArray(proposal.toAddress),
              recipents: proposal.toAddress,
              outTokens: proposal.outTokens,
              classification: proposal.classification,
              approvals: proposal.approvals,
              status: proposal.status
            }
            cryptocurrencies.forEach(crypto => {
              if (crypto.id === proposal.outAssetId) {
                proposalTemp.outTokenSymbol = crypto.symbol
                proposalTemp.outUSDPrice = parseInt(crypto.quote.USD.price)
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
    });

    let needsApprovalListTemp = needsApproval.sort(function (x, y) {
      return y.timestamp - x.timestamp;
    })

    const currentPage = parseInt(req.query.page)
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
  }

  if (parseInt(req.query.wallet) > 0) {
    let needsApproval = []
    wallets.forEach(wallet => {
      if (wallet.id === parseInt(req.query.wallet)) {
        if (Object.keys(wallet.proposals).length > 0) {
          wallet.proposals.forEach(proposal => {

            if (proposal.status === "no action" || proposal.status === "actioned" || proposal.status === "approval required") {
              let proposalTemp = {
                id: proposal.proposalId,
                timestamp: proposal.timestamp,
                moreThan3: false,
                titleTransaction: true,
                wallet: wallet.name,
                walletType: wallet.type,
                blockchain: proposal.blockchain,
                multiRecipient: Array.isArray(proposal.toAddress),
                recipents: proposal.toAddress,
                outTokens: proposal.outTokens,
                classification: proposal.classification,
                approvals: proposal.approvals,
                status: proposal.status
              }
              cryptocurrencies.forEach(crypto => {
                if (crypto.id === proposal.outAssetId) {
                  proposalTemp.outTokenSymbol = crypto.symbol
                  proposalTemp.outUSDPrice = parseInt(crypto.quote.USD.price)
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
    })
    let needsApprovalListTemp = needsApproval.sort(function (x, y) {
      return y.timestamp - x.timestamp;
    })

    const needsApprovalCount = needsApprovalListTemp.length


    for (let i = 0; i < needsApprovalListTemp.length - 1; i++) {
      if (needsApprovalListTemp[i].timestamp - needsApprovalListTemp[i + 1].timestamp < (1000 * 60 * 60 * 24)) {
        needsApprovalListTemp[i + 1].titleTransaction = false
      }
    }

    for (let i = 0; i < needsApprovalListTemp.length; i++) {
      if (moment(Date.now()).diff(moment(needsApprovalListTemp[i].timestamp), 'days') < 3) {
        needsApprovalListTemp[i].moreThan3 = true
      }
    }

    return res.json({ needsApproval: needsApprovalListTemp, needsApprovalCount });
  }







})




app.get('/proposals/ready-to-execute', (req, res) => {

  if (parseInt(req.query.page) >= 0) {
    let readyToExecute = []
    wallets.forEach(wallet => {
      if (Object.keys(wallet.proposals).length > 0) {
        wallet.proposals.forEach(proposal => {
          if (proposal.status === "executing" || proposal.status === "execution failed" || proposal.status === "execution ready" || proposal.status === "awaiting nonce") {
            let proposalTemp = {
              id: proposal.proposalId,
              timestamp: proposal.timestamp,
              moreThan3: false,
              titleTransaction: true,
              wallet: wallet.name,
              walletType: wallet.type,
              blockchain: proposal.blockchain,
              multiRecipient: Array.isArray(proposal.toAddress),
              recipents: proposal.toAddress,
              outTokens: proposal.outTokens,
              classification: proposal.classification,
              approvals: proposal.approvals,
              status: proposal.status
            }
            cryptocurrencies.forEach(crypto => {
              if (crypto.id === proposal.outAssetId) {
                proposalTemp.outTokenSymbol = crypto.symbol
                proposalTemp.outUSDPrice = parseInt(crypto.quote.USD.price)
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
    });

    let readyToExecuteTemp = readyToExecute.sort(function (x, y) {
      return y.timestamp - x.timestamp;
    })

    const currentPage = parseInt(req.query.page)
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
  }

  if (parseInt(req.query.wallet) > 0) {
    let readyToExecute = []
    wallets.forEach(wallet => {
      if (wallet.id === parseInt(req.query.wallet)) {
        if (Object.keys(wallet.proposals).length > 0) {
          wallet.proposals.forEach(proposal => {

            if (proposal.status === "executing" || proposal.status === "execution failed" || proposal.status === "execution ready" || proposal.status === "awaiting nonce") {
              let proposalTemp = {
                id: proposal.proposalId,
                timestamp: proposal.timestamp,
                moreThan3: false,
                titleTransaction: true,
                wallet: wallet.name,
                walletType: wallet.type,
                blockchain: proposal.blockchain,
                multiRecipient: Array.isArray(proposal.toAddress),
                recipents: proposal.toAddress,
                outTokens: proposal.outTokens,
                classification: proposal.classification,
                approvals: proposal.approvals,
                status: proposal.status
              }
              cryptocurrencies.forEach(crypto => {
                if (crypto.id === proposal.outAssetId) {
                  proposalTemp.outTokenSymbol = crypto.symbol
                  proposalTemp.outUSDPrice = parseInt(crypto.quote.USD.price)
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
    })
    let readyToExecuteTemp = readyToExecute.sort(function (x, y) {
      return y.timestamp - x.timestamp;
    })

    const readyToExecuteCount = readyToExecuteTemp.length


    for (let i = 0; i < readyToExecuteTemp.length - 1; i++) {
      if (readyToExecuteTemp[i].timestamp - readyToExecuteTemp[i + 1].timestamp < (1000 * 60 * 60 * 24)) {
        readyToExecuteTemp[i + 1].titleTransaction = false
      }
    }

    for (let i = 0; i < readyToExecuteTemp.length; i++) {
      if (moment(Date.now()).diff(moment(readyToExecuteTemp[i].timestamp), 'days') < 3) {
        readyToExecuteTemp[i].moreThan3 = true
      }
    }

    return res.json({ readyToExecute: readyToExecuteTemp, readyToExecuteCount });
  }

})


app.get('/proposals/discarded', (req, res) => {
  if (parseInt(req.query.page) >= 0) {
    let discarded = []
    wallets.forEach(wallet => {
      if (Object.keys(wallet.proposals).length > 0) {
        wallet.proposals.forEach(proposal => {
          if (proposal.status === "discarded" || proposal.status === "rejected") {
            let proposalTemp = {
              id: proposal.proposalId,
              timestamp: proposal.timestamp,
              moreThan3: false,
              titleTransaction: true,
              wallet: wallet.name,
              walletType: wallet.type,
              blockchain: proposal.blockchain,
              multiRecipient: Array.isArray(proposal.toAddress),
              recipents: proposal.toAddress,
              outTokens: proposal.outTokens,
              classification: proposal.classification,
              approvals: proposal.approvals,
              status: proposal.status
            }
            cryptocurrencies.forEach(crypto => {
              if (crypto.id === proposal.outAssetId) {
                proposalTemp.outTokenSymbol = crypto.symbol
                proposalTemp.outUSDPrice = parseInt(crypto.quote.USD.price)
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
    });

    let discardedTemp = discarded.sort(function (x, y) {
      return y.timestamp - x.timestamp;
    })

    const currentPage = parseInt(req.query.page)
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
  }


  if (parseInt(req.query.wallet) > 0) {
    let discarded = []
    wallets.forEach(wallet => {
      if (wallet.id === parseInt(req.query.wallet)) {
        if (Object.keys(wallet.proposals).length > 0) {
          wallet.proposals.forEach(proposal => {

            if (proposal.status === "discarded" || proposal.status === "rejected") {
              let proposalTemp = {
                id: proposal.proposalId,
                timestamp: proposal.timestamp,
                moreThan3: false,
                titleTransaction: true,
                wallet: wallet.name,
                walletType: wallet.type,
                blockchain: proposal.blockchain,
                multiRecipient: Array.isArray(proposal.toAddress),
                recipents: proposal.toAddress,
                outTokens: proposal.outTokens,
                classification: proposal.classification,
                approvals: proposal.approvals,
                status: proposal.status
              }
              cryptocurrencies.forEach(crypto => {
                if (crypto.id === proposal.outAssetId) {
                  proposalTemp.outTokenSymbol = crypto.symbol
                  proposalTemp.outUSDPrice = parseInt(crypto.quote.USD.price)
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
    })
    let discardedTemp = discarded.sort(function (x, y) {
      return y.timestamp - x.timestamp;
    })


    const discardedCount = discardedTemp.length


    for (let i = 0; i < discardedTemp.length - 1; i++) {
      if (discardedTemp[i].timestamp - discardedTemp[i + 1].timestamp < (1000 * 60 * 60 * 24)) {
        discardedTemp[i + 1].titleTransaction = false
      }
    }

    for (let i = 0; i < discardedTemp.length; i++) {
      if (moment(Date.now()).diff(moment(discardedTemp[i].timestamp), 'days') < 3) {
        discardedTemp[i].moreThan3 = true
      }
    }
    return res.json({ discarded: discardedTemp, discardedCount });
  }
})



app.get('/proposals', (req, res) => {
  if (parseInt(req.query.wallet) > 0) {
    let needsApproval = []
    let readyToExecute = []
    let discarded = []



    wallets.forEach(wallet => {
      if (wallet.id === parseInt(req.query.wallet)) {
        if (Object.keys(wallet.proposals).length > 0) {
          wallet.proposals.forEach(proposal => {
            let proposalTemp = {
              id: proposal.proposalId,
              timestamp: proposal.timestamp,
              moreThan3: false,
              titleTransaction: true,
              wallet: wallet.name,
              walletType: wallet.type,
              blockchain: proposal.blockchain,
              multiRecipient: Array.isArray(proposal.toAddress),
              recipents: proposal.toAddress,
              outTokens: proposal.outTokens,
              classification: proposal.classification,
              approvals: proposal.approvals,
              status: proposal.status
            }
            cryptocurrencies.forEach(crypto => {
              if (crypto.id === proposal.outAssetId) {
                proposalTemp.outTokenSymbol = crypto.symbol
                proposalTemp.outUSDPrice = parseInt(crypto.quote.USD.price)
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
          wallet: wallet.name,
          walletType: wallet.type,
          blockchain: proposal.blockchain,
          multiRecipient: Array.isArray(proposal.toAddress),
          recipents: proposal.toAddress,
          outTokens: proposal.outTokens,
          classification: proposal.classification,
          approvals: proposal.approvals,
          status: proposal.status
        }
        cryptocurrencies.forEach(crypto => {
          if (crypto.id === proposal.outAssetId) {
            proposalTemp.outTokenSymbol = crypto.symbol
            proposalTemp.outUSDPrice = parseInt(crypto.quote.USD.price)
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

  // const found = cryptocurrencies.some(crypto => crypto.id === parseInt(req.params.id));

  // if (found) {
  //   res.json(cryptocurrencies.filter(crypto => crypto.id === parseInt(req.params.id)));
  // } else {
  //   res.status(400).json({ msg : `No token with id of ${req.params.id}`})
  // }

})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})