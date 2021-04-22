namespace Backend.Models.Database
{

    public enum ShoppingListState
    {
        NORMAL = 0,
        SOFT_DELETED = 1
    }

    public partial class ShoppingList
    {
        public void SetState(ShoppingListState stateEn)
        {
            State = (int)stateEn;
        }

        public ShoppingListState GetState()
        {
            return (ShoppingListState)State;
        }
    }
}