using System.Collections.Generic;
using System.Linq;
using Backend.Common;
using Newtonsoft.Json;

namespace Backend.Models.AppSearch
{
    public class BaseSearchRequestContent : JsonSerializable
    {
        public string query;
        public ScoreSort sort;
        public BaseSearchRequestContent(string query)
        {
            this.query = query;
            this.sort = new ScoreSort("desc");
        }
        public class ScoreSort
        {
            public string _score;
            public ScoreSort(string sortOption)
            {
                _score = sortOption;
            }
        }
    }

    public class IdentityRequestContent : BaseSearchRequestContent
    {
        public Filters filters;

        public IdentityRequestContent(string searchedText) : base(searchedText)
        {
            filters = new Filters("P");
        }
        public class Filters
        {
            public string[] type;
            public Filters(string type)
            {
                this.type = new string[] { type };
            }
        }

    }

    public class DeleteRequestContent : JsonSerializable
    {
        public IEnumerable<string> docIds;
        public override string ToJson()
        {
            return JsonConvert.SerializeObject(docIds);
        }
        public DeleteRequestContent(IEnumerable<DeleteRequestASDocument> documents)
        {
            docIds = documents.Select(doc => doc.docId);
        }
    }
    public class CreateRequestContent : JsonSerializable
    {
        public IEnumerable<ASDocument> documents;
        public CreateRequestContent(IEnumerable<CreateRequestASDocument> documents)
        {
            this.documents = documents.Select(doc => new ASDocument(doc.text, doc.type.RawString()));
        }
        public override string ToJson()
        {
            return JsonConvert.SerializeObject(documents);
        }
        public class ASDocument
        {
            public string text;
            public string type;
            public ASDocument(string text, string type)
            {
                this.text = text;
                this.type = type;
            }
        }
    }
    public class ReplaceRequestContent : JsonSerializable
    {
        public IEnumerable<ExistingASDocument> documents;
        public ReplaceRequestContent(IEnumerable<ReplaceRequestASDocument> documents)
        {
            this.documents = documents.Select(doc => new ExistingASDocument(doc.docId, doc.newText, doc.type.RawString()));
        }
        public override string ToJson()
        {
            return JsonConvert.SerializeObject(documents);
        }
        public class ExistingASDocument : CreateRequestContent.ASDocument
        {
            public string id;
            public ExistingASDocument(string id, string text, string type) : base(text, type)
            {
                this.id = id;
            }
        }
    }
    public class CreateResponse : JsonDeserializable<CreateResponse>
    {
        public IReadOnlyList<ASDocumentResponse> documentResponses;
        public static new CreateResponse FromJson(string json)
        {
            var createResponse = new CreateResponse();
            createResponse.documentResponses = JsonConvert.DeserializeObject<IReadOnlyList<ASDocumentResponse>>(json);
            return createResponse;
        }

        public class ASDocumentResponse
        {
            public string id;
            public IEnumerable<string> errors;
        }
    }

    public class ReplaceResponse : CreateResponse
    {

    }

    public class DeleteResponse : JsonDeserializable<DeleteResponse>
    {
        public IReadOnlyList<ASDocumentResponse> documentResponses;
        public static new DeleteResponse FromJson(string json)
        {
            var deleteResponse = new DeleteResponse();
            deleteResponse.documentResponses = JsonConvert.DeserializeObject<IReadOnlyList<ASDocumentResponse>>(json);
            return deleteResponse;
        }
        public class ASDocumentResponse
        {
            public string id;
            public bool deleted;
        }

    }
    public class SearchResponse : JsonDeserializable<SearchResponse>
    {
        public Meta meta;
        public IEnumerable<ResultDocument> results;
        public class Meta
        {
            public IEnumerable<string> alerts;
            public IEnumerable<string> warnings;
            public Page page;
            public string request_id;
            public class Page
            {
                public int current;
                public int total_pages;
                public int total_results;
                public int size;
            }

        }
        public class ResultDocument
        {
            public Text text;
            public Text type;
            public Id id;
            public Meta _meta;
            public class Text
            {
                public string raw;
            }
            public class Id
            {
                public string raw;
            }
            public class Meta
            {
                public float score;
            }
        }
    }
}