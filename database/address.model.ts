import mongoose from "mongoose";
const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true }, // Đường
  district: { type: String }, // Quận (tuỳ chọn)
  city: { type: String, required: true }, // Thành phố
  country: { type: String, required: true }, // Quốc gia
});

const Address = mongoose.model("Address", AddressSchema);
export { AddressSchema, Address };
