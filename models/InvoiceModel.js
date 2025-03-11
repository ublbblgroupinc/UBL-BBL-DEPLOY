const mongoose = require('mongoose')

const invoiceSchema = mongoose.Schema({
  invoiceNo: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  productDetail: {
    type: String,
    required: true
  },
  productFee: {
    type: String,
    required: true
  },
  productGst: {
    type: String,
    required: true
  },
  productTotal: {
    type: String,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  extraInfo: {
    type: String,
    required: false
  }
})
const Invoice = mongoose.model('Invoice', clientSchema)

module.exports = Invoice
