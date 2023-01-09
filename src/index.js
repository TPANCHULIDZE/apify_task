const axios = require("axios");
const token = "zp4YJam58EiymRe9uRSbJQGzg";

const findMinimal = (price1, price2) => {
  price1 = parseFloat(price1.replace("$", ""));
  price2 = parseFloat(price2.replace("$", ""));

  return price1 < price2;
};

const getCheapestProducts = async () => {
  const response = await axios.get(
    "https://api.apify.com/v2/datasets/VuFwckCdhVhoLJJ08/items?clean=true&format=json"
  );

  const products = response.data;
  const productsByIds = {};

  products.forEach((product) => {
    if (productsByIds[product.productId]) {
      if (findMinimal(product.price, productsByIds[product.productId].price))
        productsByIds[product.productId] = product;
    } else {
      productsByIds[product.productId] = product;
    }
  });

  return Object.values(productsByIds);
};

const modifiedProductsData = async (products) => {
  const { data } = await axios.post(
    "https://api.apify.com/v2/datasets?token=" + token
  );
  const { id } = data.data;
  await axios.post(
    `https://api.apify.com/v2/datasets/${id}/items?token=`+ token,
    products
  );

  const modifiedData = await axios.get(
    `https://api.apify.com/v2/datasets/${id}/items?token=${token}`
  );
  console.log(modifiedData.data);
};

const main = async () => {
  const products = await getCheapestProducts();
  await modifiedProductsData(products)
};

main();
