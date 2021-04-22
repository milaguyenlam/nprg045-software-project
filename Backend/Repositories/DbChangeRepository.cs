using System;
using Backend.Models.Database;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Backend.Repositories
{
    public interface IDbChangeRepository
    {
        IEnumerable<DbChange> GetInserts();
        IEnumerable<DbChange> GetUpdates();
        IEnumerable<DbChange> GetDeletes();
        void Delete(Expression<Func<DbChange, bool>> where);
    }

    public class DbChangeRepository : EntityRepository<DbChange>, IDbChangeRepository
    {
        public DbChangeRepository(SPriceContext dbContext) : base(dbContext)
        { }

        public IEnumerable<DbChange> GetInserts()
        {
            return GetMany(dbc => dbc.Operation.Equals(DbChangeOperation.CREATE.RawString()));
        }

        public IEnumerable<DbChange> GetDeletes()
        {
            return GetMany(dbc => dbc.Operation.Equals(DbChangeOperation.DELETE.RawString()));
        }

        public IEnumerable<DbChange> GetUpdates()
        {
            return GetMany(dbc => dbc.Operation.Equals(DbChangeOperation.UPDATE.RawString()));
        }
    }
}