const axios = require("axios");

const getAllProducts = async () => {
  const response = await axios.get(
    "https://api.apify.com/v2/datasets/VuFwckCdhVhoLJJ08/items?clean=true&format=json"
  );

  const products = response.data;
  console.log(products)
  const productsByIds = {};

  products.forEach((product) => {
    if (productsByIds[product.productId]) {
      productsByIds[product.productId].push(product);
    } else {
      productsByIds[product.productId] = [product];
    }
  });

  Object.values(productsByIds).map((products) =>
    products.sort((a, b) => parseFloat(a["price"].replace('$', '')) - parseFloat(b["price"].replace('$', '')))
  );

  const cheapests = Object.values(productsByIds).map((products) => products[0]);
  console.log(cheapests);

  const {data} = await axios.post('https://api.apify.com/v2/datasets?token=zp4YJam58EiymRe9uRSbJQGzg')
  await axios.post(`https://api.apify.com/v2/datasets/${data.data.id}/items?token=zp4YJam58EiymRe9uRSbJQGzg`, cheapests)

  const newResponse = await axios.get(`https://api.apify.com/v2/datasets/${data.data.id}/items?token=zp4YJam58EiymRe9uRSbJQGzg&format=json`)
  console.log(newResponse.data)
};

getAllProducts();
