const { randomUUID } = require('crypto');
const {client} = require('./client');


const vendorCategories = [
  'Jewelry Gold',
  'Jewelry Silver',
  'Jewelry GemStone/Crystals',
  'Jewelry Clay',
  'Jewelry Fine Beaded',
  'Jewelry Permanent',
  'Jewelry Childrens',
  'Jewelry Other',
  'Candles Sculpted',
  'Candles Poured',
  'Skincare Body Butters/Scrubs/Oils',
  'Skincare',
  'Apparel',
  'Apparel Childrens',
  'Apparel Specialty',
  'Perfume',
  'Food Sauces',
  'Food Baked Goods',
  'Food Confections',
  'Food Specialty',
  'Accessories Leather',
  'Accessories Hair',
  'Art Resin',
  'Art Abstract/Mixed Media',
  'Art Acrylic/Watercolor',
  'Art Graphic Prints',
  'Art Other',
  'Stationery',
  'Nails',
  'Shoes',
  'Books',
  'Tumblers',
  'Home Decor',
  'Plants',
  'Macrame',
  'Knit/Crochet Items',
  'Pets',
  'Toys',
  'Flowers Fresh',
  'Flowers Dried',
  'Flowers Paper',
  'Flowers Preserved',
  'Cleaning Supplies',
  'Health & Wellness',
];

// Create a new transaction to add the vendor categories
const transaction = client.transaction();

// Loop through the categories and create documents
vendorCategories.forEach((category) => {
  transaction.createOrReplace({
    _id: randomUUID(),
    _type: 'vendorCategory',
    name: category,
  });
});

// Commit the transaction to add the documents
transaction
  .commit()
  .then((response) => {
    console.log('Vendor categories added successfully.');
  })
  .catch((error) => {
    console.error('Error adding vendor categories:', error);
  });
