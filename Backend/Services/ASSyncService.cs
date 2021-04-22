using System;
using Backend.Models.Database;
using System.Collections.Generic;
using Backend.Repositories;
using System.Threading.Tasks;
using Backend.Models.AppSearch;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.Extensions.Configuration;
using Backend.Common;

namespace Backend.Services
{
    public interface IASSyncService
    {
        Task SyncASDocumentsAsync();
    }

    public class ASSyncService : IASSyncService
    {
        private readonly IRepositoryContext repositoryContext;
        private readonly ILogger<ASSyncService> logger;
        private readonly IConfiguration configuration;

        private class EntityInfo
        {
            public SearchEntityType entityType;
            public string entityText;
            public AsDocMapping mapping;

            public EntityInfo(SearchEntityType entityType, string entityText, AsDocMapping mapping)
            {
                this.entityType = entityType;
                this.entityText = entityText;
                this.mapping = mapping;
            }
        }

        public ASSyncService(IRepositoryContext repositoryContext, IConfiguration configuration, ILogger<ASSyncService> logger)
        {
            this.repositoryContext = repositoryContext;
            this.logger = logger;
            this.configuration = configuration;
        }

        public async Task SyncASDocumentsAsync()
        {
            logger.LogInformation("Starting App Search synching");

            var changesRepo = repositoryContext.DbChanges;

            var allInserts = changesRepo.GetInserts().Select(dl => new Tuple<string, int>(dl.EntityType, dl.EntityId)).ToHashSet();
            var allUpdates = changesRepo.GetUpdates().Select(dl => new Tuple<string, int>(dl.EntityType, dl.EntityId)).ToHashSet();
            var allDeletes = changesRepo.GetDeletes().Select(dl => new Tuple<string, int>(dl.EntityType, dl.EntityId)).ToHashSet();

            var obsoleteInserts = allInserts.Intersect(allDeletes);
            var obsoleteUpdates = allUpdates.Intersect(allDeletes);
            var relevantInserts = allInserts.Except(obsoleteInserts);
            var relevantUpdates = allUpdates.Except(obsoleteUpdates);

            var createRequests = new List<CreateRequestASDocument>();
            foreach (var insert in relevantInserts)
            {
                try
                {
                    createRequests.Add(MakeASCreateRequest(insert.Item1, insert.Item2));
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error: SynchWithSearch - could not make AS Create request");
                }
            }

            var updateRequests = new List<ReplaceRequestASDocument>();
            foreach (var update in relevantUpdates)
            {
                try
                {
                    updateRequests.Add(MakeASReplaceRequest(update.Item1, update.Item2));
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error: SynchWithSearch - could not make AS Replace request");
                }
            }

            var deleteRequests = new List<DeleteRequestASDocument>();
            foreach (var del in allDeletes)
            {
                try
                {
                    deleteRequests.Add(MakeASDeleteRequest(del.Item1, del.Item2));
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error: SynchWithSearch - could not make AS delete request");
                }
            }

            var createdSuccess = await ExecuteCreateASRequests(createRequests);
            var uncommittedUpdates = relevantInserts.Intersect(relevantUpdates).Count() > 0;
            if (uncommittedUpdates)
            {
                //there's some pending change to a not mapped entity
                //we need to commit the mapping so we can use it update
                if (createdSuccess)
                {
                    repositoryContext.CommitAll();
                }
            }
            var replaceSuccess = await ExecuteReplaceASRequests(updateRequests);
            var deleteSuccess = await ExecuteDeleteASRequests(deleteRequests);

            foreach (var oi in obsoleteInserts)
            {
                changesRepo.Delete(dbc => dbc.EntityType.Equals(oi.Item1) && dbc.EntityId.Equals(oi.Item2)
                                            && dbc.Operation.Equals(DbChangeOperation.CREATE.RawString()));
            }
            foreach (var ou in obsoleteUpdates)
            {
                changesRepo.Delete(dbc => dbc.EntityType.Equals(ou.Item1) && dbc.EntityId.Equals(ou.Item2)
                                            && dbc.Operation.Equals(DbChangeOperation.UPDATE.RawString()));
            }
            var obsoleteChanges = obsoleteUpdates.Count() > 0 || obsoleteInserts.Count() > 0;

            if ((!uncommittedUpdates && createdSuccess) || replaceSuccess || deleteSuccess || obsoleteChanges)
            {
                repositoryContext.CommitAll();
            }

            logger.LogInformation("Finished App Search synching");
        }

        private bool DeleteSuccessChanges(IEnumerable<ResponseASDocument> responses, DbChangeOperation operation)
        {
            bool changeMade = false;
            var opStr = operation.RawString();
            foreach (var res in responses)
            {
                if (res.success)
                {
                    repositoryContext.DbChanges.Delete(dbc =>
                        dbc.EntityType == res.type.RawString()
                        && dbc.EntityId == res.entityId
                        && dbc.Operation.Equals(opStr));

                    changeMade = true;
                }
                else
                {
                    logger.LogWarning($"DB change record was not deleted because the request to AS was not successful for: {res.type} {res.entityId}");
                }
            }
            return changeMade;
        }

        private void CreateASMapping(IEnumerable<ResponseASDocument> responses)
        {
            foreach (var res in responses)
            {
                if (res.success)
                {
                    repositoryContext.ASDocMappings.Add(
                        new AsDocMapping()
                        {
                            EntityType = res.type.RawString(),
                            EntityId = res.entityId,
                            DocId = res.docId,
                        }
                    );
                }
            }
        }

        private void DeleteASMapping(IEnumerable<ResponseASDocument> responses)
        {
            foreach (var res in responses)
            {
                if (res.success)
                {
                    repositoryContext.ASDocMappings.Delete(mp =>
                        mp.DocId.Equals(res.docId)
                        && mp.EntityId == res.entityId
                        && mp.EntityType.Equals(res.type.RawString())
                    );
                }
            }
        }

        private async Task<bool> ExecuteCreateASRequests(List<CreateRequestASDocument> createRequests)
        {
            if (createRequests.Count == 0)
                return false;

            bool changesMade = false;
            try
            {
                logger.LogInformation($"Executing AS indexing creation from DB");
                var cTaskRes = await repositoryContext.AppSearch.CreateASDocumentsAsync(createRequests);
                changesMade = DeleteSuccessChanges(cTaskRes, DbChangeOperation.CREATE);
                if (changesMade)
                {
                    CreateASMapping(cTaskRes);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Could not execute AS create requests");
            }
            return changesMade;
        }

        private async Task<bool> ExecuteReplaceASRequests(List<ReplaceRequestASDocument> updateRequests)
        {
            if (updateRequests.Count == 0)
                return false;

            bool changesMade = false;
            try
            {
                logger.LogInformation($"Executing AS indexing updates from DB");
                var rTaskRes = await repositoryContext.AppSearch.ReplaceASDocumentsAsync(updateRequests);
                changesMade = DeleteSuccessChanges(rTaskRes, DbChangeOperation.UPDATE);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Could not execute AS update requests.");
            }
            return changesMade;
        }

        private async Task<bool> ExecuteDeleteASRequests(List<DeleteRequestASDocument> delRequests)
        {
            if (delRequests.Count == 0)
                return false;

            bool changesMade = false;
            try
            {
                logger.LogInformation($"Executing AS indexing deletes to DB");
                var dTaskRes = await repositoryContext.AppSearch.DeleteASDocumentsAsync(delRequests);
                changesMade = DeleteSuccessChanges(dTaskRes, DbChangeOperation.DELETE);
                if (changesMade)
                {
                    DeleteASMapping(dTaskRes);
                }

            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Could not execute AS deletion requests");
            }
            return changesMade;
        }

        private EntityInfo GetEntityInfo(string entityTypeStr, int entityId)
        {
            var entityType = SearchEntityTypeEnumExtensions.FromString(entityTypeStr);
            var entityText = GetEntityText(entityType, entityId);
            var mapping = repositoryContext.ASDocMappings.Get(
                                mp => mp.EntityId == entityId && mp.EntityType.Equals(entityTypeStr));

            return new EntityInfo(entityType, entityText, mapping);
        }

        private CreateRequestASDocument MakeASCreateRequest(string entityTypeStr, int entityId)
        {
            var ent = GetEntityInfo(entityTypeStr, entityId);
            if (ent.mapping != null)
            {
                throw new ArgumentException($"There's already existing ASDocMapping for entity {entityId} of type {entityTypeStr}");
            }

            return new CreateRequestASDocument(ent.entityType, entityId, ent.entityText);
        }

        private ReplaceRequestASDocument MakeASReplaceRequest(string entityTypeStr, int entityId)
        {
            var ent = GetEntityInfo(entityTypeStr, entityId);
            if (ent.mapping == null)
            {
                throw new ArgumentException($"No existing ASDocMapping for entity {entityId} of type {entityTypeStr}");
            }

            return new ReplaceRequestASDocument(ent.entityType, entityId, ent.entityText, ent.mapping.DocId);
        }

        private DeleteRequestASDocument MakeASDeleteRequest(string entityTypeStr, int entityId)
        {
            var mapping = repositoryContext.ASDocMappings.Get(
                    mp => mp.EntityId == entityId && mp.EntityType.Equals(entityTypeStr));
            var entityType = SearchEntityTypeEnumExtensions.FromString(entityTypeStr);

            if (mapping == null)
            {
                throw new ArgumentException($"No existing ASDocMapping for entity {entityId} of type {entityTypeStr}");
            }
            return new DeleteRequestASDocument(entityType, entityId, mapping.DocId);
        }

        private string GetEntityText(SearchEntityType entityType, int entityId)
        {
            switch (entityType)
            {
                case SearchEntityType.CATEGORY:
                    return repositoryContext.CategoryTrans.GetByPrimaryKeys(entityId).Name;
                case SearchEntityType.PRODUCT:
                    return repositoryContext.Products.GetByPrimaryKeys(entityId).Name;
                case SearchEntityType.VENDOR:
                    return repositoryContext.Vendors.GetByPrimaryKeys(entityId).Name;
                default:
                    throw new KeyNotFoundException($"Unmapped SearchEntityType {entityType} used to get entity text");
            }
        }

    }
}