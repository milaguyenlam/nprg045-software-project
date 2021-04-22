using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Backend.Models.Database;


namespace Backend.Repositories
{
    public interface IEntityRepository<T> where T : class
    {
        // Marks an entity as new
        void Add(T entity);
        // Inform an entity that is has been changed, push the changes
        void Update(T entity);
        // Marks an entity to be removed
        void Delete(T entity);
        void Delete(Expression<Func<T, bool>> where);
        // Fast find object based on primary key
        T GetByPrimaryKeys(params object[] keyValues);
        // Get a first matching entity using where lambda
        T Get(Expression<Func<T, bool>> where);
        // Gets all entities using where lambda
        IQueryable<T> GetMany(Expression<Func<T, bool>> where);
        // Gets all entities
        IQueryable<T> GetAll();
    }

    public class EntityRepository<T> : IEntityRepository<T> where T : class
    {
        protected readonly DbContext dbContext;
        protected readonly DbSet<T> dbSet;

        public EntityRepository(SPriceContext dbContext)
        {
            this.dbContext = dbContext;
            dbSet = dbContext.Set<T>();
        }

        public virtual void Add(T entity)
        {
            var entry = dbContext.Entry(entity);
            if (entry.State == EntityState.Detached)
                dbSet.Add(entity);
        }

        public virtual void Update(T entity)
        {
            var entry = dbContext.Entry(entity);
            if (entry.State == EntityState.Detached)
                dbSet.Attach(entity);
            entry.State = EntityState.Modified;
        }

        public virtual void Delete(T entity)
        {
            var entry = dbContext.Entry(entity);
            if (entry.State == EntityState.Detached)
                dbSet.Attach(entity);
            dbSet.Remove(entity);
        }

        public virtual void Delete(Expression<Func<T, bool>> where)
        {
            IEnumerable<T> objects = dbSet.Where<T>(where).AsEnumerable();
            foreach (T obj in objects)
                Delete(obj);
        }

        public virtual IQueryable<T> GetAll()
        {
            return dbSet.AsQueryable<T>();
        }

        public virtual IQueryable<T> GetMany(Expression<Func<T, bool>> where)
        {
            return dbSet.Where<T>(where).AsQueryable();
        }

        public virtual T Get(Expression<Func<T, bool>> where)
        {
            return dbSet.Where<T>(where).FirstOrDefault<T>();
        }

        public virtual T GetByPrimaryKeys(params object[] keyValues)
        {
            return dbSet.Find(keyValues);
        }

    }
}
