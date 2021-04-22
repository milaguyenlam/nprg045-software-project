using Backend.Models.AppSearch;
using Backend.Models.Database;

namespace Backend.Repositories
{



    public interface IASDocMappingRepository : IEntityRepository<AsDocMapping>
    {
        bool TryMapTo<T>(string docId, IEntityRepository<T> repo, SearchEntityType searchEntityType, out T entity) where T : class;
    }

    public class ASDocMappingRepository : EntityRepository<AsDocMapping>, IASDocMappingRepository
    {
        public ASDocMappingRepository(SPriceContext dbContext) : base(dbContext)
        {
        }

        public bool TryMapTo<T>(string docId, IEntityRepository<T> repo, SearchEntityType searchEntityType, out T entity) where T : class
        {
            entity = default(T);
            var mapping = GetByPrimaryKeys(docId);
            if (mapping == null || SearchEntityTypeEnumExtensions.FromString(mapping.EntityType) != searchEntityType)
            {
                return false;
            }
            return (entity = repo.GetByPrimaryKeys(mapping.EntityId)) != null;
        }
    }
}