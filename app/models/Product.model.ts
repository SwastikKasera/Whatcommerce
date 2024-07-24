import mongoose, { Model} from "mongoose";

export interface ProductInterface {
  customerId: mongoose.Schema.Types.ObjectId,
  productName: string,
  productDesc: string,
  productCategory: string,
  productPrice: number,
  productColor: string,
  productSize: string,
}
const ProductSchema = new mongoose.Schema<ProductInterface>({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customers" },
  productName: { type: String, required: true },
  productDesc: { type: String, required: true },
  productCategory: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productColor: { type: String, required: true },
  productSize: { type: String, required: true },
});

const ProductModel: Model<ProductInterface> = mongoose.model<ProductInterface>('Product', ProductSchema);
export default ProductModel;
