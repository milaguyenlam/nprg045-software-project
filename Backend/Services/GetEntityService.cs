using Backend.Repositories;
using Backend.Models.Database;
using System.Collections.Generic;
using System.Linq.Expressions;
using System;

namespace Backend.Services
{

    public interface IGetEntityService<T>
    {
        IEnumerable<T> GetAll();
        T GetById(int id);
    }

    public class GetEntityService<T> : IGetEntityService<T> where T : class
    {
        private readonly IEntityRepository<T> entityRepository;

        protected IEntityRepository<T> EntityRepository
        {
            get { return entityRepository; }
        }

        public GetEntityService(IEntityRepository<T> entityRepository)
        {
            this.entityRepository = entityRepository;
        }

        public virtual IEnumerable<T> GetAll()
        {
            return EntityRepository.GetAll();
        }

        public virtual T GetById(int id)
        {
            return EntityRepository.GetByPrimaryKeys(id);
        }

    }

}
