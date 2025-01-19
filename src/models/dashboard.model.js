const mongoose = require("mongoose");

// Badge Schema
const badgeSchema = new mongoose.Schema({
  name: String,
  description: String,
});

// Metric Schema
const metricSchema = new mongoose.Schema({
  profit: {
    value: Number,
    increase: String,
  },
  sales: {
    value: Number,
    increase: String,
  },
  payments: {
    value: Number,
    decrease: String,
  },
  transactions: {
    value: Number,
    increase: String,
  },
});

// Chart Schema
const chartSchema = new mongoose.Schema({
  totalRevenue: {
    labels: [String],
    data: [Number],
  },
  growth: {
    labels: [String],
    data: [Number],
  },
  profileReport: {
    labels: [String],
    data: [Number],
    increase: String,
  },
});

// Order Category Schema
const orderCategorySchema = new mongoose.Schema({
  name: String,
  value: Number,
  items: [String],
});

// Orders Schema
const ordersSchema = new mongoose.Schema({
  totalOrders: Number,
  categories: [orderCategorySchema],
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  type: String,
  description: String,
  amount: Number,
  currency: String,
  date: { type: Date, default: Date.now },
});

// Order Statistics Schema
const orderStatisticsSchema = new mongoose.Schema({
  totalSales: Number,
  totalOrders: Number,
  categories: [
    {
      name: String,
      value: Number,
    },
  ],
});

// Dashboard Schema
const dashboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    metrics: metricSchema,
    charts: chartSchema,
    orders: ordersSchema,
    transactions: [transactionSchema],
    orderStatistics: orderStatisticsSchema, // Added orderStatistics
    badges: [badgeSchema], // Added badges
  },
  { timestamps: true }
);

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

module.exports = Dashboard;