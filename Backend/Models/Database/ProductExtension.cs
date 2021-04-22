namespace Backend.Models.Database
{
    public partial class Product
    {
        public override bool Equals(object obj)
        {
            return obj is Product product &&
                   Name == product.Name;
        }

        public override int GetHashCode()
        {
            return Name.GetHashCode();
        }
    }
}