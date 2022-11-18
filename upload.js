const { Web3Storage, File } = require("web3.storage");
require("dotenv").config("./.env");
const { char2Bytes } = require("@taquito/utils");

const client = new Web3Storage({ token: process.env.WEB3_TOKEN });

const metadata = {
  date: "2022-10-11T19:33:05.869Z",
  artifactUri:
    "ipfs://bafybeie7c3abbddxsb23e5kkbltu63ejb4e4ymxehuug3jnyfg2espov7a",
  displayUri:
    "ipfs://bafkreibmtirtvl4vgmm7n4q63bbuanf66vbmbfz5q7d37fjqwakpuw34zq",
  thumbnailUri:
    "ipfs://bafkreif7yjvvjheuxd3yihscvjlwq2lhqlszfzteke4p7tcw2pepaataha",
  formats: [
    {
      uri: "ipfs://bafybeie7c3abbddxsb23e5kkbltu63ejb4e4ymxehuug3jnyfg2espov7a",
      mimeType: "image/png",
      fileSize: 6204272,
    },
    {
      uri: "ipfs://bafkreibmtirtvl4vgmm7n4q63bbuanf66vbmbfz5q7d37fjqwakpuw34zq",
      mimeType: "image/jpeg",
      fileSize: 151590,
    },
    {
      uri: "ipfs://bafkreif7yjvvjheuxd3yihscvjlwq2lhqlszfzteke4p7tcw2pepaataha",
      mimeType: "image/jpeg",
      fileSize: 30622,
    },
  ],
  decimals: 0,
  shouldPreferSymbol: false,
  name: "1988 Tom Niedenfuer Judy Garland Series 9 Insert #JGB1 (BLACK)",
  description:
    "This card is an INSERT. It is not a Series 9 Base. **** This Insert has DUAL Utility. It has all the announced Utilities of a standard Insert and it also has Painting Utility. This insert is considered a BLACK INSERT in painting mechanics.  This is a Cycle 2 Insert. \n\n******** digital capture of original painting, gouache on vintage baseball card, 2022. ************ NFT image is for personal use, no commercial rights are granted. Twitter @thr33som3s and IG @thr33somes to see upcoming cards and new series. ************ ALL editions in Series 9 will have FUTURE UTILITY",
  symbol: "MINT",
  tags: ["thr33som3s", "insert", "painting", "black"],
  creators: ["tz1MvePPBoQGqesNJ4x3VRf2bn81it7kGjCc"],
  rights: "None - All Rights Reserved",
  royalties: { decimals: 3, shares: { 'tz1MvePPBoQGqesNJ4x3VRf2bn81it7kGjCc': 250 } },
};

async function main() {
  const cid = await client.put(
    [
      new File([JSON.stringify(metadata)], "json", {
        type: "application/json",
      }),
    ],
    { wrapWithDirectory: false }
  );
  console.log(char2Bytes(`ipfs://${cid}`));
}
main();
