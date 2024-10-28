import mongoose from "mongoose";

// Model cho Job
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Vị trí công việc
  company: { type: String }, // Công ty (tuỳ chọn)
  location: { type: String }, // Địa điểm làm việc (tuỳ chọn)
});

const Job = mongoose.model("Job", JobSchema);
export { JobSchema, Job };
