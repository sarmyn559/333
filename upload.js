const { Web3Storage, File } = require('web3.storage')
require('dotenv').config('./.env')

const client = new Web3Storage({ token: process.env.WEB3_TOKEN })

const metadata = {
    "name": "Z3RO - #0",
    "date": "2022-10-10T19:58:04.430Z",
    "artifactUri": "ipfs://bafybeicamahylk23qftsfpxfhioleibkrbdjzknupes6j5w3fs2cvr2u4m",
    "displayUri": "ipfs://bafkreih4kwto4alfpg2gwohadja5v7ovqg2fpqkjhj5cpskzqvi6mt2x2i",
    "thumbnailUri": "ipfs://bafkreiflkxi7unhoxdkvyguvicz4b3nqkdhrpro6evwuhzwynbn5tbldpq",
    "formats": [
      {
        "uri": "ipfs://bafybeicamahylk23qftsfpxfhioleibkrbdjzknupes6j5w3fs2cvr2u4m",
        "mimeType": "image/png",
        "fileSize": 7585263
      },
      {
        "uri": "ipfs://bafkreih4kwto4alfpg2gwohadja5v7ovqg2fpqkjhj5cpskzqvi6mt2x2i",
        "mimeType": "image/jpeg",
        "fileSize": 152734
      },
      {
        "uri": "ipfs://bafkreiflkxi7unhoxdkvyguvicz4b3nqkdhrpro6evwuhzwynbn5tbldpq",
        "mimeType": "image/jpeg",
        "fileSize": 31603
      }
    ],
    "decimals": 0,
    "shouldPreferSymbol": false,
    "description": `This is the first token minted on the thr33som3s Tezos smart contract.

Originally airdropped to the top 20 purchasers of the Black and White Inserts, Tokens #1 and #2, in appreciation of their commitment to the project.  Editions were also airdropped to Sebuh and Grit for their help on making this contract.
******** digital capture of original painting, gouache on vintage baseball card, 2022. ************ NFT image is for personal use, no commercial rights are granted. Twitter @thr33som3s and IG @thr33somes to see upcoming cards and new series. ************ ALL thr33som3s have FUTURE UTILITY`,
    "symbol": "MINT",
    "tags": ["thr33som3s", "genesis", "z3ro"],
    "creators": ["tz1MvePPBoQGqesNJ4x3VRf2bn81it7kGjCc"],
    "royalties": { "decimals": 3, "shares": { "tz1MvePPBoQGqesNJ4x3VRf2bn81it7kGjCc": 250 } }
  }


async function main () {
    const cid = await client.put([new File([JSON.stringify(metadata)], 'json', { type: 'application/json' })], { wrapWithDirectory: false })
    console.log(cid)
}
main()