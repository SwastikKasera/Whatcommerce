import mongoose from "mongoose"

const customerCreationSchema = new mongoose.Schema({
  CustomerId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(), 
  },
  customerName: { type: "string", required: true },
  customerWebsite: { type: "string", required: true },
  customerDesc: { type: "string", required: true },
  customerBusinessCategory: { type: "string", required: true },
  customerPhone: { type: "string", required:true}
}, {
  timestamps: true
})

const model = mongoose.model('Customers', customerCreationSchema)
export default model