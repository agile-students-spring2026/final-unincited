import mongoose from'mongoose'
const Schema = mongoose.Schema

const ArticleSchema = new Schema({ //TODO FILL IN Constraints
    url:{
        type: String,
        required: true,

    },
    title:{
        type: String,

    },
    source:{
        type: String,

    },
    author:{
        type: String,

    },
    publicationDate:{
        type: String,

    },
    thumbnail:{
        type: String,

    },
    articleText:{
        type: String,

    },
    detectedTopic:{
        type: String,

    },
    sentimentLabel:{
        type: String
    },
    sentimentScore:{
        type: Number,
        min: -1,
        max: 1
    },
    biasLabel:{
        type: String,

    },
    biasScore:{
        type: Number,

    },
    confidenceScore:{
        type: Number,

    },
    explanation:{
        type: String,

    },
    evidenceLines:[
        {
            text: String,
            sentimentLabel: String,
            startIndex: Number,
            endIndex: Number
            }
    ],
    //relationship
    submittedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt:{
        
    }
})



// create a model from this schema
const Article = mongoose.model('Article', ArticleSchema)

// export the model
export default Article