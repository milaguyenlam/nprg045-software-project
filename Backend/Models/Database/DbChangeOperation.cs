using System.Collections.Generic;

namespace Backend.Models.Database
{
    public enum DbChangeOperation
    {
        CREATE = 'C',
        UPDATE = 'U',
        DELETE = 'D'
    }

    public static class DbChangeOperationEnumExtensions
    {
        public static string RawString(this DbChangeOperation op)
        {
            switch (op)
            {
                case DbChangeOperation.CREATE:
                    return "C";
                case DbChangeOperation.DELETE:
                    return "D";
                case DbChangeOperation.UPDATE:
                    return "U";
                default:
                    throw new KeyNotFoundException($"Nonmapped DbChangeOperation field used: {op.ToString()}");
            }
        }
    }

}