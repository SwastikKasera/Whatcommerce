import ConnectMongo from "../lib/ConnectMongo";
import ProductModel from "@/app/models/Product.model";
import { ProductInterface } from "@/app/models/Product.model";

type Filter = {
  price: {
    min: number;
    max: number;
  };
};

export async function ShowProductsToCustomer(keywords: string[], filter: Filter) {
  await ConnectMongo();
  console.log("reached ShowProductsToCustomer");

  const query: any = {};

  // Constructing query for keywords
  if (keywords && keywords.length > 0) {
    query.$or = [
      { productName: { $regex: keywords.join('|'), $options: "i" } },
      { productDesc: { $regex: keywords.join('|'), $options: "i" } },
    ];
  }

  // Adding price filter
  if (filter.price) {
    query.productPrice = {
      $gte: filter.price.min,
      $lte: filter.price.max,
    };
  }

  try {
    const result = await ProductModel.find<ProductInterface>(query).exec();
    return result;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
}
