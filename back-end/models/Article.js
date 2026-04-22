import mongoose from'mongoose'
const Schema = mongoose.Schema

const ArticleSchema = new Schema({ //TODO FILL IN Constraints
    url:{

    },
    title:{

    },
    source:{

    },
    author:{

    },
    publicationDate:{

    },
    thumbnail:{

    },
    articleText:{

    },
    detectedTopic:{

    },
    sentimentLabel:{

    },
    sentimentScore:{

    },
    biasLabel:{

    },
    biasScore:{

    },
    confidenceScore:{

    },
    explanation:{

    },
    evidenceLines:{

    },

    //relationship
    submittedBy:{

    },
    createdAt:{

    }

})



// create a model from this schema
const Article = mongoose.model('Article', ArticleSchema)

// export the model
export default Article