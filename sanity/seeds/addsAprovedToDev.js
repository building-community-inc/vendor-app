
const { createClient } = require("next-sanity");


const client = createClient({
  projectId: "xomfbfrw",
  useCdn: false, // Set to true if you want to use the CDN
  dataset: "production",
});



const vendors = async () => {
  const vendors = await client.fetch('*[_type == "user"]');
  const transaction = client.transaction();
  vendors.forEach((vendor) => {
    transaction.patch(vendor._id, (patch) => patch.set({status: "pending"}));
  });
  await transaction.commit().then((res) => console.log(res));

};

// vendors();

const deleteAllDocumentsOfType = async () => {
  const args = process.argv.slice(2);

  const docType = args[0];

  const documents = await client.fetch(`*[_type == "${docType}"]`);
  console.log("deleting ", documents.length, `${docType} documents`);

  const transaction = client.transaction();
  documents.forEach((doc) => {
    transaction.delete(doc._id);
  });

  await transaction.commit().then((res) => console.log(res));
};


deleteAllDocumentsOfType();


const findDocById = async (id) => {
  const doc = await client.getDocument(id);
  console.log(doc);
};

// findDocById("pi_3OcDzhL4t9b70V4n16bugzDL");

