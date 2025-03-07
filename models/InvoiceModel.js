const mongoose = require('mongoose')

const mongooseSchema = mongoose.Schema(
    {
        id: {
            type: String,
            required: [true, "Enter invoice id"]
        }
    }
)