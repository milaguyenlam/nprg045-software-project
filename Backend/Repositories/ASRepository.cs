using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models.AppSearch;
using Microsoft.Extensions.Configuration;
using Backend.Common;
using System.Net.Http;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Linq;

namespace Backend.Repositories
{

    public interface IASRepository
    {
        Task<IEnumerable<ResponseASDocument>> CreateASDocumentsAsync(IReadOnlyList<CreateRequestASDocument> documents);
        Task<IEnumerable<ResponseASDocument>> DeleteASDocumentsAsync(IReadOnlyList<DeleteRequestASDocument> documents);
        Task<IEnumerable<ResponseASDocument>> ReplaceASDocumentsAsync(IReadOnlyList<ReplaceRequestASDocument> documents);
        Task<T> SearchFor<T>(BaseSearchRequestContent query, Func<SearchResponse, T> processSearchResponseFunc);
    }

    public class ASRepository : IASRepository
    {
        private readonly HttpClient searchClient;
        private readonly HttpClient docClient;
        private readonly ILogger logger;

        private readonly int syncBatchSize;
        private readonly int syncWaitPeriod;
        private readonly int syncMaxIterations;
        public ASRepository(IConfiguration configuration)
        {
            logger = (new LoggerFactory()).CreateLogger<ASRepository>();
            searchClient = InitializeSearchClient(configuration);
            docClient = InitializeDocClient(configuration);
            syncBatchSize = configuration.GetASSyncBatchSize();
            syncWaitPeriod = configuration.GetASSyncWaitPeriod();
            syncMaxIterations = configuration.GetASSyncMaxIterations();
        }

        public async Task<T> SearchFor<T>(BaseSearchRequestContent query, Func<SearchResponse, T> processSearchResponseFunc)
        {
            var httpResponse = await searchClient.PostAsync("", new StringContent(query.ToJson(), Encoding.UTF8, "application/json"));
            if (httpResponse.IsSuccessStatusCode)
            {
                var rawContent = await httpResponse.Content.ReadAsStringAsync();
                var searchResponse = SearchResponse.FromJson(rawContent);
                return processSearchResponseFunc(searchResponse);
            }
            else
            {
                return default(T);
            }
        }
        public async Task<IEnumerable<ResponseASDocument>> CreateASDocumentsAsync(IReadOnlyList<CreateRequestASDocument> documents)
        {
            return await SyncASDocumentsAsync<CreateRequestASDocument>(
                documents,
                (documents) =>
                {
                    var content = new CreateRequestContent(documents);
                    return new StringContent(content.ToJson(), Encoding.UTF8, "application/json");
                },
                (stringContent) =>
                {
                    return docClient.PostAsync("", stringContent);
                },
                (rawResponseContent, requestDocuments) =>
                {
                    if (rawResponseContent == null)
                    {
                        return requestDocuments.Select(requestDoc => new ResponseASDocument(requestDoc.entityId, requestDoc.type, false, null));
                    }
                    var response = CreateResponse.FromJson(rawResponseContent);
                    CheckRequestResponseLength(response.documentResponses, requestDocuments);
                    var resultList = new List<ResponseASDocument>();
                    for (int i = 0; i < requestDocuments.Count(); i++)
                    {
                        var requestDoc = requestDocuments[i];
                        var responseDoc = response.documentResponses[i];
                        var success = responseDoc.id != "" && responseDoc.errors.Count() == 0;
                        resultList.Add(new ResponseASDocument(requestDoc.entityId, requestDoc.type, success, responseDoc.id));
                    }
                    return resultList;
                }
                );
        }

        public async Task<IEnumerable<ResponseASDocument>> DeleteASDocumentsAsync(IReadOnlyList<DeleteRequestASDocument> documents)
        {
            return await SyncASDocumentsAsync<DeleteRequestASDocument>(
                documents,
                (documents) =>
                {
                    var content = new DeleteRequestContent(documents);
                    return new StringContent(content.ToJson(), Encoding.UTF8, "application/json");
                },
                (stringContent) =>
                {
                    var deleteRequest = new HttpRequestMessage(HttpMethod.Delete, "");
                    deleteRequest.Content = stringContent;
                    return docClient.SendAsync(deleteRequest);
                },
                (rawResponseContent, requestDocuments) =>
                {
                    if (rawResponseContent == null)
                    {
                        return requestDocuments.Select(requestDoc => new ResponseASDocument(requestDoc.entityId, requestDoc.type, false, requestDoc.docId));
                    }
                    var response = DeleteResponse.FromJson(rawResponseContent);
                    CheckRequestResponseLength(response.documentResponses, requestDocuments);
                    var resultList = new List<ResponseASDocument>();
                    for (int i = 0; i < requestDocuments.Count(); i++)
                    {
                        var requestDoc = requestDocuments[i];
                        var responseDoc = response.documentResponses[i];
                        var success = responseDoc.id == requestDoc.docId && responseDoc.deleted;
                        resultList.Add(new ResponseASDocument(requestDoc.entityId, requestDoc.type, success, responseDoc.id));
                    }
                    return resultList;
                }
                );
        }

        public async Task<IEnumerable<ResponseASDocument>> ReplaceASDocumentsAsync(IReadOnlyList<ReplaceRequestASDocument> documents)
        {
            return await SyncASDocumentsAsync<ReplaceRequestASDocument>(
                documents,
                (documents) =>
                {
                    var content = new ReplaceRequestContent(documents);
                    return new StringContent(content.ToJson(), Encoding.UTF8, "application/json");
                },
                (stringContent) =>
                {
                    return docClient.PostAsync("", stringContent);
                },
                (rawResponseContent, requestDocuments) =>
                {
                    if (rawResponseContent == null)
                    {
                        return requestDocuments.Select(requestDoc => new ResponseASDocument(requestDoc.entityId, requestDoc.type, false, requestDoc.docId));
                    }
                    var response = ReplaceResponse.FromJson(rawResponseContent);
                    CheckRequestResponseLength(response.documentResponses, requestDocuments);
                    var resultList = new List<ResponseASDocument>();
                    for (int i = 0; i < requestDocuments.Count(); i++)
                    {
                        var requestDoc = requestDocuments[i];
                        var responseDoc = response.documentResponses[i];
                        var success = responseDoc.id == requestDoc.docId && responseDoc.errors.Count() == 0;
                        resultList.Add(new ResponseASDocument(requestDoc.entityId, requestDoc.type, success, responseDoc.id));
                    }
                    return resultList;
                }
                );
        }

        private async Task<IEnumerable<ResponseASDocument>> SyncASDocumentsAsync<T>(
            IReadOnlyList<T> documents,
            Func<IReadOnlyList<T>, StringContent> createRequestContentFunc,
            Func<StringContent, Task<HttpResponseMessage>> makeRequestFunc,
            Func<string, IReadOnlyList<T>, IEnumerable<ResponseASDocument>> processResponseFunc)
        {
            if (documents == null || documents.Count == 0)
            {
                throw new ArgumentNullException("Null or Empty document requests was passed.");
            }
            var responses = new List<ResponseASDocument>();
            var batches = documents.Split<T>(syncBatchSize);
            foreach (var batch in batches)
            {
                var httpContent = createRequestContentFunc(batch);
                var iterations = 0;
                var notSuccesful = true;
                HttpResponseMessage httpResponse = null;
                try
                {
                    while (notSuccesful)
                    {

                        httpResponse = await makeRequestFunc(httpContent);
                        if (httpResponse.IsSuccessStatusCode)
                        {
                            notSuccesful = false;
                        }
                        else if (httpResponse.StatusCode == System.Net.HttpStatusCode.TooManyRequests && iterations < syncMaxIterations)
                        {
                            logger.LogWarning($"AS server returned with TooManyRequests. Sleeping and waiting for the server.");
                            iterations++;
                            System.Threading.Thread.Sleep(syncWaitPeriod);
                        }
                        else
                        {
                            logger.LogError($"Couldn't not get successful answer from AS server after {iterations} iterations.");
                            break;
                        }
                    }
                }
                catch (Exception e)
                {
                    logger.LogError(e, $"Couldn't successfully make request on AS server.");
                }
                if (notSuccesful)
                {
                    responses.AddRange(processResponseFunc(null, batch));
                }
                else
                {
                    var rawContent = await httpResponse.Content.ReadAsStringAsync();
                    responses.AddRange(processResponseFunc(rawContent, batch));
                }
            }
            return responses;
        }

        private void CheckRequestResponseLength<T1, T2>(IEnumerable<T1> list1, IEnumerable<T2> list2)
        {
            if (list1.Count() != list2.Count())
            {
                throw new ArgumentException("$Couldn't match response and request documents while processing replace response: different length");
            }
        }


        private HttpClient InitializeSearchClient(IConfiguration configuration)
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri(configuration.GetASSearchUrl());
            client.DefaultRequestHeaders.Add("Authorization", configuration.GetASSearchKey());
            return client;
        }
        private HttpClient InitializeDocClient(IConfiguration configuration)
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri(configuration.GetASDocumentUrl());
            client.DefaultRequestHeaders.Add("Authorization", configuration.GetASPrivateKey());
            return client;
        }
    }
}