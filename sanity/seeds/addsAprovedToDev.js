const { createClient } = require("next-sanity");


const client = createClient({
  projectId: "xomfbfrw",
  dataset: "development",
  token: "skQn2uk2XttOketiUngOA2HhdZd5mlov60h8fjut2RSTVst5miLf4r8NVX9xFaVKahQ5oXi6E2FXT3djKxUAgDOxkOMePyxMEm6sEmwmDY0FWsGWUknrzDXCD2CBgwYh1bnW4YVIWaxKxlx6GhOteDy9kwBaCIQtbM0E8SdGk0EvSHlNMsy0", // Optional if your dataset is public
  useCdn: false, // Set to true if you want to use the CDN
});



const vendors = async () => {
  const vendors = await client.fetch('*[_type == "user"]');
  const transaction = client.transaction();
  vendors.forEach((vendor) => {
    transaction.patch(vendor._id, (patch) => patch.set({status: "pending"}));
  });
  await transaction.commit().then((res) => console.log(res));

};

vendors();
