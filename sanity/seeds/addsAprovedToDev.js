const { createClient } = require("next-sanity");


const client = createClient({
  projectId: "xomfbfrw",
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
