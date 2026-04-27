import mongoose from'mongoose'
const Schema = mongoose.Schema

const EvidenceLineSchema = new Schema({ 
    quote:              {type: String},
    highlight:          {type: String},
    taxonomyTag:        {type: String},
    taxonomyLabel:      {type: String},
    colorHex:           {type: String},
    reason:             {type: String},
    startIndex:         {type: Number},
    endIndex:           {type: Number},
}, {_id: false}) // we use _id as false meaning Mongoose will not autogenerate IDs for each evidence line

const ArticleSchema = new Schema({
    url:                {type: String, required: true, unique: true},
    title:              {type: String, required: true},
    source:             {type: String},
    author:             {type: String},
    publicationDate:    {type: Date},
    thumbnail:          {type: String},
    articleText:        {type: String, required: true},

    // AI results
    detectedTopic:      {type: String},
    sentimentLabel:     {type: String},
    sentimentScore:     {type: Number},
    biasLabel:          {type: String},
    biasScore:          {type: Number},
    confidenceScore:    {type: Number},
    explanation:        {type: String},
    evidenceLines:      {type: [EvidenceLineSchema], default: []},

    // Identify which user submitted
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    },

    createdAt: {type: Date, default: Date.now},
})


// create a model from this schema
const Article = mongoose.model('Article', ArticleSchema)

// export the model
export default Article