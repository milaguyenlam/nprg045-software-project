import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ProducerDto = {
  __typename?: 'ProducerDTO';
  name: Scalars['String'];
  thumbnailPath?: Maybe<Scalars['String']>;
};

export type CategoryDto = {
  __typename?: 'CategoryDTO';
  id: Scalars['Int'];
  name: Scalars['String'];
  picturePath?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['Int']>;
  containsProducts: Scalars['Boolean'];
};

export type ActiveOfferDto = {
  __typename?: 'ActiveOfferDTO';
  id: Scalars['Int'];
  fromDate: Scalars['String'];
  toDate: Scalars['String'];
  price: Scalars['Float'];
  discountRate?: Maybe<Scalars['Float']>;
  inStockCount?: Maybe<Scalars['Int']>;
  isTaxed?: Maybe<Scalars['Boolean']>;
  product: ProductDto;
  store: StoreDto;
  description?: Maybe<Scalars['String']>;
};

export type StoreDto = {
  __typename?: 'StoreDTO';
  vendor: VendorDto;
  openingHours?: Maybe<Scalars['String']>;
  contactDetails: ContactDetailsDto;
};

export type VendorDto = {
  __typename?: 'VendorDTO';
  id: Scalars['Int'];
  name: Scalars['String'];
  thumbnailPath?: Maybe<Scalars['String']>;
  containsProducts: Scalars['Boolean'];
};

export type ProductDto = {
  __typename?: 'ProductDTO';
  id: Scalars['Int'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  picturePath?: Maybe<Scalars['String']>;
  categories: Array<CategoryDto>;
  ean?: Maybe<Scalars['String']>;
  producer?: Maybe<ProducerDto>;
  activeOffers: Array<ActiveOfferDto>;
};

export type ContactDetailsDto = {
  __typename?: 'ContactDetailsDTO';
  phone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postCode?: Maybe<Scalars['String']>;
  geolocation?: Maybe<GeolocationDto>;
  ico?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
};

export type GeolocationDto = {
  __typename?: 'GeolocationDTO';
  longitude: Scalars['Float'];
  latitude: Scalars['Float'];
};

export type SearchResultDto = {
  __typename?: 'SearchResultDTO';
  vendors: Array<VendorDto>;
  categories: Array<CategoryDto>;
  products: Array<ProductDto>;
};

export type RegisterFormInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  status: Scalars['Boolean'];
  message: Scalars['String'];
  token?: Maybe<Scalars['String']>;
};

export type UserDto = {
  __typename?: 'UserDTO';
  username: Scalars['String'];
  email: Scalars['String'];
};

export enum FilterType {
  All = 'ALL',
  Vendor = 'VENDOR',
  Category = 'CATEGORY'
}

export enum ShoppingListItemState {
  New = 'NEW',
  Done = 'DONE'
}

export type ShoppingListItemDto = {
  __typename?: 'ShoppingListItemDTO';
  id: Scalars['Int'];
  state: ShoppingListItemState;
  activeOffer: ActiveOfferDto;
  quantity: Scalars['Int'];
};

export type ShoppingListDto = {
  __typename?: 'ShoppingListDTO';
  id: Scalars['Int'];
  closeTime?: Maybe<Scalars['String']>;
};

export type FavouriteListItemDto = {
  __typename?: 'FavouriteListItemDTO';
  id: Scalars['Int'];
  product: ProductDto;
};

export type ShoppingListItemAddInput = {
  activeOfferId: Scalars['Int'];
  quantity: Scalars['Int'];
};

export type ShoppingListItemUpdateInput = {
  id: Scalars['Int'];
  quantity?: Maybe<Scalars['Int']>;
  state?: Maybe<ShoppingListItemState>;
};

export type Query = {
  __typename?: 'Query';
  activeProducts: Array<ProductDto>;
  product?: Maybe<ProductDto>;
  vendors: Array<VendorDto>;
  searchResult: SearchResultDto;
  authenticate: AuthResponse;
  currentUser: UserDto;
  topLevelCategories: Array<CategoryDto>;
  subCategories: Array<CategoryDto>;
  categories: Array<CategoryDto>;
  shoppingListItems: Array<ShoppingListItemDto>;
  shoppingLists: Array<ShoppingListDto>;
  favouriteList: Array<FavouriteListItemDto>;
};


export type QueryActiveProductsArgs = {
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  vendorId?: Maybe<Scalars['Int']>;
  categoryIds?: Maybe<Array<Scalars['Int']>>;
  filterType: FilterType;
};


export type QueryProductArgs = {
  id: Scalars['Int'];
};


export type QuerySearchResultArgs = {
  text: Scalars['String'];
};


export type QueryAuthenticateArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type QuerySubCategoriesArgs = {
  categoryId: Scalars['Int'];
};


export type QueryCategoriesArgs = {
  productId: Scalars['Int'];
};


export type QueryShoppingListItemsArgs = {
  listId?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  register: AuthResponse;
  addToShoppingList: ShoppingListItemDto;
  updateShoppingListItem: ShoppingListItemDto;
  removeFromShoppingList: ShoppingListItemDto;
  removeShoppingList: ShoppingListDto;
  archiveShoppingList: ShoppingListDto;
  addToFavouriteList: FavouriteListItemDto;
  removeFromFavouriteList: FavouriteListItemDto;
};


export type MutationRegisterArgs = {
  form: RegisterFormInput;
};


export type MutationAddToShoppingListArgs = {
  item: ShoppingListItemAddInput;
};


export type MutationUpdateShoppingListItemArgs = {
  item: ShoppingListItemUpdateInput;
};


export type MutationRemoveFromShoppingListArgs = {
  itemId: Scalars['Int'];
};


export type MutationRemoveShoppingListArgs = {
  shoppingListId: Scalars['Int'];
};


export type MutationAddToFavouriteListArgs = {
  productId: Scalars['Int'];
};


export type MutationRemoveFromFavouriteListArgs = {
  productId: Scalars['Int'];
};

export type AddToFavouriteListVariables = Exact<{
  productId: Scalars['Int'];
}>;


export type AddToFavouriteList = (
  { __typename?: 'Mutation' }
  & { addToFavouriteList: (
    { __typename?: 'FavouriteListItemDTO' }
    & FavouriteListItem_AddToFavouriteList
  ) }
);

export type FavouriteListItem_AddToFavouriteList = (
  { __typename?: 'FavouriteListItemDTO' }
  & Pick<FavouriteListItemDto, 'id'>
  & { product: (
    { __typename?: 'ProductDTO' }
    & Product_AddToFavouriteList
  ) }
);

export type Product_AddToFavouriteList = (
  { __typename?: 'ProductDTO' }
  & Pick<ProductDto, 'id' | 'picturePath' | 'name'>
  & { activeOffers: Array<(
    { __typename?: 'ActiveOfferDTO' }
    & ActiveOffer_AddToFavouriteList
  )> }
);

export type ActiveOffer_AddToFavouriteList = (
  { __typename?: 'ActiveOfferDTO' }
  & Pick<ActiveOfferDto, 'price' | 'discountRate'>
);

export type AddToShoppingListVariables = Exact<{
  item: ShoppingListItemAddInput;
}>;


export type AddToShoppingList = (
  { __typename?: 'Mutation' }
  & { addToShoppingList: (
    { __typename?: 'ShoppingListItemDTO' }
    & ShoppingListItem_AddToShoppingList
  ) }
);

export type ShoppingListItem_AddToShoppingList = (
  { __typename?: 'ShoppingListItemDTO' }
  & Pick<ShoppingListItemDto, 'id' | 'quantity'>
  & { activeOffer: (
    { __typename?: 'ActiveOfferDTO' }
    & ActiveOffer_AddToShoppingList
  ) }
);

export type ActiveOffer_AddToShoppingList = (
  { __typename?: 'ActiveOfferDTO' }
  & Pick<ActiveOfferDto, 'price' | 'discountRate' | 'description'>
  & { product: (
    { __typename?: 'ProductDTO' }
    & Product_AddToShoppingList
  ) }
);

export type Product_AddToShoppingList = (
  { __typename?: 'ProductDTO' }
  & Pick<ProductDto, 'id' | 'picturePath' | 'name'>
);

export type ArchiveShoppingListVariables = Exact<{ [key: string]: never; }>;


export type ArchiveShoppingList = (
  { __typename?: 'Mutation' }
  & { archiveShoppingList: (
    { __typename?: 'ShoppingListDTO' }
    & ShoppingList_ArchiveShoppingList
  ) }
);

export type ShoppingList_ArchiveShoppingList = (
  { __typename?: 'ShoppingListDTO' }
  & Pick<ShoppingListDto, 'id'>
);

export type AuthenticateVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type Authenticate = (
  { __typename?: 'Query' }
  & { authenticate: (
    { __typename?: 'AuthResponse' }
    & AuthResponse_Authenticate
  ) }
);

export type AuthResponse_Authenticate = (
  { __typename?: 'AuthResponse' }
  & Pick<AuthResponse, 'status' | 'message' | 'token'>
);

export type GetActiveProductsVariables = Exact<{
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  categoryIds?: Maybe<Array<Scalars['Int']>>;
  vendorId?: Maybe<Scalars['Int']>;
  filterType: FilterType;
}>;


export type GetActiveProducts = (
  { __typename?: 'Query' }
  & { activeProducts: Array<(
    { __typename?: 'ProductDTO' }
    & Product_GetActiveProducts
  )> }
);

export type Product_GetActiveProducts = (
  { __typename?: 'ProductDTO' }
  & Pick<ProductDto, 'id' | 'name' | 'picturePath'>
  & { activeOffers: Array<(
    { __typename?: 'ActiveOfferDTO' }
    & ActiveOffer_GetActiveProducts
  )> }
);

export type ActiveOffer_GetActiveProducts = (
  { __typename?: 'ActiveOfferDTO' }
  & Pick<ActiveOfferDto, 'id' | 'price' | 'discountRate' | 'description' | 'fromDate' | 'toDate'>
  & { store: (
    { __typename?: 'StoreDTO' }
    & Store_GetActiveProducts
  ) }
);

export type Store_GetActiveProducts = (
  { __typename?: 'StoreDTO' }
  & { vendor: (
    { __typename?: 'VendorDTO' }
    & Vendor_GetActiveProducts
  ) }
);

export type Vendor_GetActiveProducts = (
  { __typename?: 'VendorDTO' }
  & Pick<VendorDto, 'name' | 'thumbnailPath'>
);

export type GetCurrentUserVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUser = (
  { __typename?: 'Query' }
  & { currentUser: (
    { __typename?: 'UserDTO' }
    & User_GetCurrentUser
  ) }
);

export type User_GetCurrentUser = (
  { __typename?: 'UserDTO' }
  & Pick<UserDto, 'username' | 'email'>
);

export type GetFavouriteListVariables = Exact<{ [key: string]: never; }>;


export type GetFavouriteList = (
  { __typename?: 'Query' }
  & { favouriteList: Array<(
    { __typename?: 'FavouriteListItemDTO' }
    & FavouriteListItem_GetFavouriteList
  )> }
);

export type FavouriteListItem_GetFavouriteList = (
  { __typename?: 'FavouriteListItemDTO' }
  & Pick<FavouriteListItemDto, 'id'>
  & { product: (
    { __typename?: 'ProductDTO' }
    & Product_GetFavouriteList
  ) }
);

export type Product_GetFavouriteList = (
  { __typename?: 'ProductDTO' }
  & Pick<ProductDto, 'id' | 'picturePath' | 'name'>
  & { activeOffers: Array<(
    { __typename?: 'ActiveOfferDTO' }
    & ActiveOffer_GetFavouriteList
  )> }
);

export type ActiveOffer_GetFavouriteList = (
  { __typename?: 'ActiveOfferDTO' }
  & Pick<ActiveOfferDto, 'id' | 'price' | 'discountRate' | 'toDate' | 'description'>
  & { store: (
    { __typename?: 'StoreDTO' }
    & Store_GetFavouriteList
  ) }
);

export type Store_GetFavouriteList = (
  { __typename?: 'StoreDTO' }
  & { vendor: (
    { __typename?: 'VendorDTO' }
    & Vendor_GetFavouriteList
  ) }
);

export type Vendor_GetFavouriteList = (
  { __typename?: 'VendorDTO' }
  & Pick<VendorDto, 'name' | 'thumbnailPath'>
);

export type GetProductVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetProduct = (
  { __typename?: 'Query' }
  & { product?: Maybe<(
    { __typename?: 'ProductDTO' }
    & Product_GetProduct
  )> }
);

export type Product_GetProduct = (
  { __typename?: 'ProductDTO' }
  & Pick<ProductDto, 'id' | 'name' | 'description' | 'picturePath'>
  & { categories: Array<(
    { __typename?: 'CategoryDTO' }
    & Category_GetProduct
  )>, activeOffers: Array<(
    { __typename?: 'ActiveOfferDTO' }
    & ActiveOffer_GetProduct
  )> }
);

export type Category_GetProduct = (
  { __typename?: 'CategoryDTO' }
  & Pick<CategoryDto, 'id' | 'name'>
);

export type ActiveOffer_GetProduct = (
  { __typename?: 'ActiveOfferDTO' }
  & Pick<ActiveOfferDto, 'id' | 'toDate' | 'price' | 'discountRate' | 'inStockCount' | 'description'>
  & { store: (
    { __typename?: 'StoreDTO' }
    & Store_GetProduct
  ) }
);

export type Store_GetProduct = (
  { __typename?: 'StoreDTO' }
  & { vendor: (
    { __typename?: 'VendorDTO' }
    & Vendor_GetProduct
  ) }
);

export type Vendor_GetProduct = (
  { __typename?: 'VendorDTO' }
  & Pick<VendorDto, 'id' | 'name' | 'thumbnailPath'>
);

export type GetSearchResultVariables = Exact<{
  text: Scalars['String'];
}>;


export type GetSearchResult = (
  { __typename?: 'Query' }
  & { searchResult: (
    { __typename?: 'SearchResultDTO' }
    & SearchResult_GetSearchResult
  ) }
);

export type SearchResult_GetSearchResult = (
  { __typename?: 'SearchResultDTO' }
  & { products: Array<(
    { __typename?: 'ProductDTO' }
    & Product_GetSearchResult
  )>, categories: Array<(
    { __typename?: 'CategoryDTO' }
    & Category_GetSearchResult
  )>, vendors: Array<(
    { __typename?: 'VendorDTO' }
    & Vendor_GetSearchResult
  )> }
);

export type Product_GetSearchResult = (
  { __typename?: 'ProductDTO' }
  & Pick<ProductDto, 'id' | 'name' | 'picturePath'>
);

export type Category_GetSearchResult = (
  { __typename?: 'CategoryDTO' }
  & Pick<CategoryDto, 'id' | 'parentId' | 'name' | 'picturePath'>
);

export type Vendor_GetSearchResult = (
  { __typename?: 'VendorDTO' }
  & Pick<VendorDto, 'id' | 'name' | 'thumbnailPath'>
);

export type GetSelectionItemsVariables = Exact<{ [key: string]: never; }>;


export type GetSelectionItems = (
  { __typename?: 'Query' }
  & { topLevelCategories: Array<(
    { __typename?: 'CategoryDTO' }
    & Category_GetSelectionItems
  )>, vendors: Array<(
    { __typename?: 'VendorDTO' }
    & Vendor_GetSelectionItems
  )> }
);

export type Vendor_GetSelectionItems = (
  { __typename?: 'VendorDTO' }
  & Pick<VendorDto, 'id' | 'name' | 'thumbnailPath' | 'containsProducts'>
);

export type Category_GetSelectionItems = (
  { __typename?: 'CategoryDTO' }
  & Pick<CategoryDto, 'id' | 'name' | 'picturePath' | 'containsProducts'>
);

export type GetShoppingListItemsVariables = Exact<{
  listId?: Maybe<Scalars['Int']>;
}>;


export type GetShoppingListItems = (
  { __typename?: 'Query' }
  & { shoppingListItems: Array<(
    { __typename?: 'ShoppingListItemDTO' }
    & ShoppingListItem_GetShoppingListItems
  )> }
);

export type ShoppingListItem_GetShoppingListItems = (
  { __typename?: 'ShoppingListItemDTO' }
  & Pick<ShoppingListItemDto, 'id' | 'quantity' | 'state'>
  & { activeOffer: (
    { __typename?: 'ActiveOfferDTO' }
    & ActiveOffer_GetShoppingListItems
  ) }
);

export type ActiveOffer_GetShoppingListItems = (
  { __typename?: 'ActiveOfferDTO' }
  & Pick<ActiveOfferDto, 'id' | 'toDate' | 'price' | 'discountRate' | 'inStockCount'>
  & { product: (
    { __typename?: 'ProductDTO' }
    & Product_GetShoppingListItems
  ) }
);

export type Product_GetShoppingListItems = (
  { __typename?: 'ProductDTO' }
  & Pick<ProductDto, 'id' | 'name' | 'picturePath'>
);

export type GetShoppingListsVariables = Exact<{ [key: string]: never; }>;


export type GetShoppingLists = (
  { __typename?: 'Query' }
  & { shoppingLists: Array<(
    { __typename?: 'ShoppingListDTO' }
    & ShoppingList_GetShoppingLists
  )> }
);

export type ShoppingList_GetShoppingLists = (
  { __typename?: 'ShoppingListDTO' }
  & Pick<ShoppingListDto, 'id' | 'closeTime'>
);

export type GetSubCategoriesVariables = Exact<{
  categoryId: Scalars['Int'];
}>;


export type GetSubCategories = (
  { __typename?: 'Query' }
  & { subCategories: Array<(
    { __typename?: 'CategoryDTO' }
    & Category_GetSubCategories
  )> }
);

export type Category_GetSubCategories = (
  { __typename?: 'CategoryDTO' }
  & Pick<CategoryDto, 'id' | 'name' | 'picturePath' | 'containsProducts'>
);

export type RegisterVariables = Exact<{
  registerForm: RegisterFormInput;
}>;


export type Register = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'AuthResponse' }
    & AuthResponse_Register
  ) }
);

export type AuthResponse_Register = (
  { __typename?: 'AuthResponse' }
  & Pick<AuthResponse, 'status' | 'message' | 'token'>
);

export type RemoveFromFavouriteListVariables = Exact<{
  productId: Scalars['Int'];
}>;


export type RemoveFromFavouriteList = (
  { __typename?: 'Mutation' }
  & { removeFromFavouriteList: (
    { __typename?: 'FavouriteListItemDTO' }
    & FavouriteListItem_RemoveToFavouriteList
  ) }
);

export type FavouriteListItem_RemoveToFavouriteList = (
  { __typename?: 'FavouriteListItemDTO' }
  & Pick<FavouriteListItemDto, 'id'>
);

export type RemoveFromShoppingListVariables = Exact<{
  itemId: Scalars['Int'];
}>;


export type RemoveFromShoppingList = (
  { __typename?: 'Mutation' }
  & { removeFromShoppingList: (
    { __typename?: 'ShoppingListItemDTO' }
    & ShoppingListItem_RemoveFromShoppingList
  ) }
);

export type ShoppingListItem_RemoveFromShoppingList = (
  { __typename?: 'ShoppingListItemDTO' }
  & Pick<ShoppingListItemDto, 'id'>
);

export type RemoveShoppingListVariables = Exact<{
  shoppingListId: Scalars['Int'];
}>;


export type RemoveShoppingList = (
  { __typename?: 'Mutation' }
  & { removeShoppingList: (
    { __typename?: 'ShoppingListDTO' }
    & ShoppingList_RemoveShoppingList
  ) }
);

export type ShoppingList_RemoveShoppingList = (
  { __typename?: 'ShoppingListDTO' }
  & Pick<ShoppingListDto, 'id'>
);

export type UpdateShoppingListItemVariables = Exact<{
  item: ShoppingListItemUpdateInput;
}>;


export type UpdateShoppingListItem = (
  { __typename?: 'Mutation' }
  & { updateShoppingListItem: (
    { __typename?: 'ShoppingListItemDTO' }
    & ShoppingListItem_UpdateShoppingListItem
  ) }
);

export type ShoppingListItem_UpdateShoppingListItem = (
  { __typename?: 'ShoppingListItemDTO' }
  & Pick<ShoppingListItemDto, 'id' | 'quantity'>
);

export const ActiveOffer_AddToFavouriteList = gql`
    fragment ActiveOffer_AddToFavouriteList on ActiveOfferDTO {
  price
  discountRate
}
    `;
export const Product_AddToFavouriteList = gql`
    fragment Product_AddToFavouriteList on ProductDTO {
  id
  picturePath
  name
  activeOffers {
    ...ActiveOffer_AddToFavouriteList
  }
}
    ${ActiveOffer_AddToFavouriteList}`;
export const FavouriteListItem_AddToFavouriteList = gql`
    fragment FavouriteListItem_AddToFavouriteList on FavouriteListItemDTO {
  id
  product {
    ...Product_AddToFavouriteList
  }
}
    ${Product_AddToFavouriteList}`;
export const Product_AddToShoppingList = gql`
    fragment Product_AddToShoppingList on ProductDTO {
  id
  picturePath
  name
}
    `;
export const ActiveOffer_AddToShoppingList = gql`
    fragment ActiveOffer_AddToShoppingList on ActiveOfferDTO {
  price
  discountRate
  description
  product {
    ...Product_AddToShoppingList
  }
}
    ${Product_AddToShoppingList}`;
export const ShoppingListItem_AddToShoppingList = gql`
    fragment ShoppingListItem_AddToShoppingList on ShoppingListItemDTO {
  id
  activeOffer {
    ...ActiveOffer_AddToShoppingList
  }
  quantity
}
    ${ActiveOffer_AddToShoppingList}`;
export const ShoppingList_ArchiveShoppingList = gql`
    fragment ShoppingList_ArchiveShoppingList on ShoppingListDTO {
  id
}
    `;
export const AuthResponse_Authenticate = gql`
    fragment AuthResponse_Authenticate on AuthResponse {
  status
  message
  token
}
    `;
export const Vendor_GetActiveProducts = gql`
    fragment Vendor_GetActiveProducts on VendorDTO {
  name
  thumbnailPath
}
    `;
export const Store_GetActiveProducts = gql`
    fragment Store_GetActiveProducts on StoreDTO {
  vendor {
    ...Vendor_GetActiveProducts
  }
}
    ${Vendor_GetActiveProducts}`;
export const ActiveOffer_GetActiveProducts = gql`
    fragment ActiveOffer_GetActiveProducts on ActiveOfferDTO {
  id
  price
  discountRate
  description
  fromDate
  toDate
  store {
    ...Store_GetActiveProducts
  }
}
    ${Store_GetActiveProducts}`;
export const Product_GetActiveProducts = gql`
    fragment Product_GetActiveProducts on ProductDTO {
  id
  name
  picturePath
  activeOffers {
    ...ActiveOffer_GetActiveProducts
  }
}
    ${ActiveOffer_GetActiveProducts}`;
export const User_GetCurrentUser = gql`
    fragment User_GetCurrentUser on UserDTO {
  username
  email
}
    `;
export const Vendor_GetFavouriteList = gql`
    fragment Vendor_GetFavouriteList on VendorDTO {
  name
  thumbnailPath
}
    `;
export const Store_GetFavouriteList = gql`
    fragment Store_GetFavouriteList on StoreDTO {
  vendor {
    ...Vendor_GetFavouriteList
  }
}
    ${Vendor_GetFavouriteList}`;
export const ActiveOffer_GetFavouriteList = gql`
    fragment ActiveOffer_GetFavouriteList on ActiveOfferDTO {
  id
  price
  discountRate
  toDate
  description
  store {
    ...Store_GetFavouriteList
  }
}
    ${Store_GetFavouriteList}`;
export const Product_GetFavouriteList = gql`
    fragment Product_GetFavouriteList on ProductDTO {
  id
  picturePath
  name
  activeOffers {
    ...ActiveOffer_GetFavouriteList
  }
}
    ${ActiveOffer_GetFavouriteList}`;
export const FavouriteListItem_GetFavouriteList = gql`
    fragment FavouriteListItem_GetFavouriteList on FavouriteListItemDTO {
  id
  product {
    ...Product_GetFavouriteList
  }
}
    ${Product_GetFavouriteList}`;
export const Category_GetProduct = gql`
    fragment Category_GetProduct on CategoryDTO {
  id
  name
}
    `;
export const Vendor_GetProduct = gql`
    fragment Vendor_GetProduct on VendorDTO {
  id
  name
  thumbnailPath
}
    `;
export const Store_GetProduct = gql`
    fragment Store_GetProduct on StoreDTO {
  vendor {
    ...Vendor_GetProduct
  }
}
    ${Vendor_GetProduct}`;
export const ActiveOffer_GetProduct = gql`
    fragment ActiveOffer_GetProduct on ActiveOfferDTO {
  id
  toDate
  price
  discountRate
  inStockCount
  store {
    ...Store_GetProduct
  }
  description
}
    ${Store_GetProduct}`;
export const Product_GetProduct = gql`
    fragment Product_GetProduct on ProductDTO {
  id
  name
  description
  picturePath
  categories {
    ...Category_GetProduct
  }
  activeOffers {
    ...ActiveOffer_GetProduct
  }
}
    ${Category_GetProduct}
${ActiveOffer_GetProduct}`;
export const Product_GetSearchResult = gql`
    fragment Product_GetSearchResult on ProductDTO {
  id
  name
  picturePath
}
    `;
export const Category_GetSearchResult = gql`
    fragment Category_GetSearchResult on CategoryDTO {
  id
  parentId
  name
  picturePath
}
    `;
export const Vendor_GetSearchResult = gql`
    fragment Vendor_GetSearchResult on VendorDTO {
  id
  name
  thumbnailPath
}
    `;
export const SearchResult_GetSearchResult = gql`
    fragment SearchResult_GetSearchResult on SearchResultDTO {
  products {
    ...Product_GetSearchResult
  }
  categories {
    ...Category_GetSearchResult
  }
  vendors {
    ...Vendor_GetSearchResult
  }
}
    ${Product_GetSearchResult}
${Category_GetSearchResult}
${Vendor_GetSearchResult}`;
export const Vendor_GetSelectionItems = gql`
    fragment Vendor_GetSelectionItems on VendorDTO {
  id
  name
  thumbnailPath
  containsProducts
}
    `;
export const Category_GetSelectionItems = gql`
    fragment Category_GetSelectionItems on CategoryDTO {
  id
  name
  picturePath
  containsProducts
}
    `;
export const Product_GetShoppingListItems = gql`
    fragment Product_GetShoppingListItems on ProductDTO {
  id
  name
  picturePath
}
    `;
export const ActiveOffer_GetShoppingListItems = gql`
    fragment ActiveOffer_GetShoppingListItems on ActiveOfferDTO {
  id
  toDate
  price
  discountRate
  inStockCount
  product {
    ...Product_GetShoppingListItems
  }
}
    ${Product_GetShoppingListItems}`;
export const ShoppingListItem_GetShoppingListItems = gql`
    fragment ShoppingListItem_GetShoppingListItems on ShoppingListItemDTO {
  id
  quantity
  state
  activeOffer {
    ...ActiveOffer_GetShoppingListItems
  }
}
    ${ActiveOffer_GetShoppingListItems}`;
export const ShoppingList_GetShoppingLists = gql`
    fragment ShoppingList_GetShoppingLists on ShoppingListDTO {
  id
  closeTime
}
    `;
export const Category_GetSubCategories = gql`
    fragment Category_GetSubCategories on CategoryDTO {
  id
  name
  picturePath
  containsProducts
}
    `;
export const AuthResponse_Register = gql`
    fragment AuthResponse_Register on AuthResponse {
  status
  message
  token
}
    `;
export const FavouriteListItem_RemoveToFavouriteList = gql`
    fragment FavouriteListItem_RemoveToFavouriteList on FavouriteListItemDTO {
  id
}
    `;
export const ShoppingListItem_RemoveFromShoppingList = gql`
    fragment ShoppingListItem_RemoveFromShoppingList on ShoppingListItemDTO {
  id
}
    `;
export const ShoppingList_RemoveShoppingList = gql`
    fragment ShoppingList_RemoveShoppingList on ShoppingListDTO {
  id
}
    `;
export const ShoppingListItem_UpdateShoppingListItem = gql`
    fragment ShoppingListItem_UpdateShoppingListItem on ShoppingListItemDTO {
  id
  quantity
}
    `;
export const AddToFavouriteListDocument = gql`
    mutation AddToFavouriteList($productId: Int!) {
  addToFavouriteList(productId: $productId) {
    ...FavouriteListItem_AddToFavouriteList
  }
}
    ${FavouriteListItem_AddToFavouriteList}`;
export type AddToFavouriteListMutationFn = Apollo.MutationFunction<AddToFavouriteList, AddToFavouriteListVariables>;

/**
 * __useAddToFavouriteList__
 *
 * To run a mutation, you first call `useAddToFavouriteList` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddToFavouriteList` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addToFavouriteList, { data, loading, error }] = useAddToFavouriteList({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useAddToFavouriteList(baseOptions?: Apollo.MutationHookOptions<AddToFavouriteList, AddToFavouriteListVariables>) {
        return Apollo.useMutation<AddToFavouriteList, AddToFavouriteListVariables>(AddToFavouriteListDocument, baseOptions);
      }
export type AddToFavouriteListHookResult = ReturnType<typeof useAddToFavouriteList>;
export type AddToFavouriteListMutationResult = Apollo.MutationResult<AddToFavouriteList>;
export type AddToFavouriteListMutationOptions = Apollo.BaseMutationOptions<AddToFavouriteList, AddToFavouriteListVariables>;
export const AddToShoppingListDocument = gql`
    mutation AddToShoppingList($item: ShoppingListItemAddInput!) {
  addToShoppingList(item: $item) {
    ...ShoppingListItem_AddToShoppingList
  }
}
    ${ShoppingListItem_AddToShoppingList}`;
export type AddToShoppingListMutationFn = Apollo.MutationFunction<AddToShoppingList, AddToShoppingListVariables>;

/**
 * __useAddToShoppingList__
 *
 * To run a mutation, you first call `useAddToShoppingList` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddToShoppingList` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addToShoppingList, { data, loading, error }] = useAddToShoppingList({
 *   variables: {
 *      item: // value for 'item'
 *   },
 * });
 */
export function useAddToShoppingList(baseOptions?: Apollo.MutationHookOptions<AddToShoppingList, AddToShoppingListVariables>) {
        return Apollo.useMutation<AddToShoppingList, AddToShoppingListVariables>(AddToShoppingListDocument, baseOptions);
      }
export type AddToShoppingListHookResult = ReturnType<typeof useAddToShoppingList>;
export type AddToShoppingListMutationResult = Apollo.MutationResult<AddToShoppingList>;
export type AddToShoppingListMutationOptions = Apollo.BaseMutationOptions<AddToShoppingList, AddToShoppingListVariables>;
export const ArchiveShoppingListDocument = gql`
    mutation ArchiveShoppingList {
  archiveShoppingList {
    ...ShoppingList_ArchiveShoppingList
  }
}
    ${ShoppingList_ArchiveShoppingList}`;
export type ArchiveShoppingListMutationFn = Apollo.MutationFunction<ArchiveShoppingList, ArchiveShoppingListVariables>;

/**
 * __useArchiveShoppingList__
 *
 * To run a mutation, you first call `useArchiveShoppingList` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveShoppingList` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveShoppingList, { data, loading, error }] = useArchiveShoppingList({
 *   variables: {
 *   },
 * });
 */
export function useArchiveShoppingList(baseOptions?: Apollo.MutationHookOptions<ArchiveShoppingList, ArchiveShoppingListVariables>) {
        return Apollo.useMutation<ArchiveShoppingList, ArchiveShoppingListVariables>(ArchiveShoppingListDocument, baseOptions);
      }
export type ArchiveShoppingListHookResult = ReturnType<typeof useArchiveShoppingList>;
export type ArchiveShoppingListMutationResult = Apollo.MutationResult<ArchiveShoppingList>;
export type ArchiveShoppingListMutationOptions = Apollo.BaseMutationOptions<ArchiveShoppingList, ArchiveShoppingListVariables>;
export const AuthenticateDocument = gql`
    query Authenticate($email: String!, $password: String!) {
  authenticate(email: $email, password: $password) {
    ...AuthResponse_Authenticate
  }
}
    ${AuthResponse_Authenticate}`;

/**
 * __useAuthenticate__
 *
 * To run a query within a React component, call `useAuthenticate` and pass it any options that fit your needs.
 * When your component renders, `useAuthenticate` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuthenticate({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useAuthenticate(baseOptions: Apollo.QueryHookOptions<Authenticate, AuthenticateVariables>) {
        return Apollo.useQuery<Authenticate, AuthenticateVariables>(AuthenticateDocument, baseOptions);
      }
export function useAuthenticateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Authenticate, AuthenticateVariables>) {
          return Apollo.useLazyQuery<Authenticate, AuthenticateVariables>(AuthenticateDocument, baseOptions);
        }
export type AuthenticateHookResult = ReturnType<typeof useAuthenticate>;
export type AuthenticateLazyQueryHookResult = ReturnType<typeof useAuthenticateLazyQuery>;
export type AuthenticateQueryResult = Apollo.QueryResult<Authenticate, AuthenticateVariables>;
export const GetActiveProductsDocument = gql`
    query GetActiveProducts($offset: Int!, $limit: Int!, $categoryIds: [Int!], $vendorId: Int, $filterType: FilterType!) {
  activeProducts(
    offset: $offset
    limit: $limit
    categoryIds: $categoryIds
    vendorId: $vendorId
    filterType: $filterType
  ) {
    ...Product_GetActiveProducts
  }
}
    ${Product_GetActiveProducts}`;

/**
 * __useGetActiveProducts__
 *
 * To run a query within a React component, call `useGetActiveProducts` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveProducts` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveProducts({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      categoryIds: // value for 'categoryIds'
 *      vendorId: // value for 'vendorId'
 *      filterType: // value for 'filterType'
 *   },
 * });
 */
export function useGetActiveProducts(baseOptions: Apollo.QueryHookOptions<GetActiveProducts, GetActiveProductsVariables>) {
        return Apollo.useQuery<GetActiveProducts, GetActiveProductsVariables>(GetActiveProductsDocument, baseOptions);
      }
export function useGetActiveProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActiveProducts, GetActiveProductsVariables>) {
          return Apollo.useLazyQuery<GetActiveProducts, GetActiveProductsVariables>(GetActiveProductsDocument, baseOptions);
        }
export type GetActiveProductsHookResult = ReturnType<typeof useGetActiveProducts>;
export type GetActiveProductsLazyQueryHookResult = ReturnType<typeof useGetActiveProductsLazyQuery>;
export type GetActiveProductsQueryResult = Apollo.QueryResult<GetActiveProducts, GetActiveProductsVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  currentUser {
    ...User_GetCurrentUser
  }
}
    ${User_GetCurrentUser}`;

/**
 * __useGetCurrentUser__
 *
 * To run a query within a React component, call `useGetCurrentUser` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUser` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUser({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUser(baseOptions?: Apollo.QueryHookOptions<GetCurrentUser, GetCurrentUserVariables>) {
        return Apollo.useQuery<GetCurrentUser, GetCurrentUserVariables>(GetCurrentUserDocument, baseOptions);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUser, GetCurrentUserVariables>) {
          return Apollo.useLazyQuery<GetCurrentUser, GetCurrentUserVariables>(GetCurrentUserDocument, baseOptions);
        }
export type GetCurrentUserHookResult = ReturnType<typeof useGetCurrentUser>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUser, GetCurrentUserVariables>;
export const GetFavouriteListDocument = gql`
    query GetFavouriteList {
  favouriteList {
    ...FavouriteListItem_GetFavouriteList
  }
}
    ${FavouriteListItem_GetFavouriteList}`;

/**
 * __useGetFavouriteList__
 *
 * To run a query within a React component, call `useGetFavouriteList` and pass it any options that fit your needs.
 * When your component renders, `useGetFavouriteList` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFavouriteList({
 *   variables: {
 *   },
 * });
 */
export function useGetFavouriteList(baseOptions?: Apollo.QueryHookOptions<GetFavouriteList, GetFavouriteListVariables>) {
        return Apollo.useQuery<GetFavouriteList, GetFavouriteListVariables>(GetFavouriteListDocument, baseOptions);
      }
export function useGetFavouriteListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFavouriteList, GetFavouriteListVariables>) {
          return Apollo.useLazyQuery<GetFavouriteList, GetFavouriteListVariables>(GetFavouriteListDocument, baseOptions);
        }
export type GetFavouriteListHookResult = ReturnType<typeof useGetFavouriteList>;
export type GetFavouriteListLazyQueryHookResult = ReturnType<typeof useGetFavouriteListLazyQuery>;
export type GetFavouriteListQueryResult = Apollo.QueryResult<GetFavouriteList, GetFavouriteListVariables>;
export const GetProductDocument = gql`
    query GetProduct($id: Int!) {
  product(id: $id) {
    ...Product_GetProduct
  }
}
    ${Product_GetProduct}`;

/**
 * __useGetProduct__
 *
 * To run a query within a React component, call `useGetProduct` and pass it any options that fit your needs.
 * When your component renders, `useGetProduct` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProduct({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProduct(baseOptions: Apollo.QueryHookOptions<GetProduct, GetProductVariables>) {
        return Apollo.useQuery<GetProduct, GetProductVariables>(GetProductDocument, baseOptions);
      }
export function useGetProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProduct, GetProductVariables>) {
          return Apollo.useLazyQuery<GetProduct, GetProductVariables>(GetProductDocument, baseOptions);
        }
export type GetProductHookResult = ReturnType<typeof useGetProduct>;
export type GetProductLazyQueryHookResult = ReturnType<typeof useGetProductLazyQuery>;
export type GetProductQueryResult = Apollo.QueryResult<GetProduct, GetProductVariables>;
export const GetSearchResultDocument = gql`
    query GetSearchResult($text: String!) {
  searchResult(text: $text) {
    ...SearchResult_GetSearchResult
  }
}
    ${SearchResult_GetSearchResult}`;

/**
 * __useGetSearchResult__
 *
 * To run a query within a React component, call `useGetSearchResult` and pass it any options that fit your needs.
 * When your component renders, `useGetSearchResult` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSearchResult({
 *   variables: {
 *      text: // value for 'text'
 *   },
 * });
 */
export function useGetSearchResult(baseOptions: Apollo.QueryHookOptions<GetSearchResult, GetSearchResultVariables>) {
        return Apollo.useQuery<GetSearchResult, GetSearchResultVariables>(GetSearchResultDocument, baseOptions);
      }
export function useGetSearchResultLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSearchResult, GetSearchResultVariables>) {
          return Apollo.useLazyQuery<GetSearchResult, GetSearchResultVariables>(GetSearchResultDocument, baseOptions);
        }
export type GetSearchResultHookResult = ReturnType<typeof useGetSearchResult>;
export type GetSearchResultLazyQueryHookResult = ReturnType<typeof useGetSearchResultLazyQuery>;
export type GetSearchResultQueryResult = Apollo.QueryResult<GetSearchResult, GetSearchResultVariables>;
export const GetSelectionItemsDocument = gql`
    query GetSelectionItems {
  topLevelCategories {
    ...Category_GetSelectionItems
  }
  vendors {
    ...Vendor_GetSelectionItems
  }
}
    ${Category_GetSelectionItems}
${Vendor_GetSelectionItems}`;

/**
 * __useGetSelectionItems__
 *
 * To run a query within a React component, call `useGetSelectionItems` and pass it any options that fit your needs.
 * When your component renders, `useGetSelectionItems` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSelectionItems({
 *   variables: {
 *   },
 * });
 */
export function useGetSelectionItems(baseOptions?: Apollo.QueryHookOptions<GetSelectionItems, GetSelectionItemsVariables>) {
        return Apollo.useQuery<GetSelectionItems, GetSelectionItemsVariables>(GetSelectionItemsDocument, baseOptions);
      }
export function useGetSelectionItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSelectionItems, GetSelectionItemsVariables>) {
          return Apollo.useLazyQuery<GetSelectionItems, GetSelectionItemsVariables>(GetSelectionItemsDocument, baseOptions);
        }
export type GetSelectionItemsHookResult = ReturnType<typeof useGetSelectionItems>;
export type GetSelectionItemsLazyQueryHookResult = ReturnType<typeof useGetSelectionItemsLazyQuery>;
export type GetSelectionItemsQueryResult = Apollo.QueryResult<GetSelectionItems, GetSelectionItemsVariables>;
export const GetShoppingListItemsDocument = gql`
    query GetShoppingListItems($listId: Int) {
  shoppingListItems(listId: $listId) {
    ...ShoppingListItem_GetShoppingListItems
  }
}
    ${ShoppingListItem_GetShoppingListItems}`;

/**
 * __useGetShoppingListItems__
 *
 * To run a query within a React component, call `useGetShoppingListItems` and pass it any options that fit your needs.
 * When your component renders, `useGetShoppingListItems` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetShoppingListItems({
 *   variables: {
 *      listId: // value for 'listId'
 *   },
 * });
 */
export function useGetShoppingListItems(baseOptions?: Apollo.QueryHookOptions<GetShoppingListItems, GetShoppingListItemsVariables>) {
        return Apollo.useQuery<GetShoppingListItems, GetShoppingListItemsVariables>(GetShoppingListItemsDocument, baseOptions);
      }
export function useGetShoppingListItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShoppingListItems, GetShoppingListItemsVariables>) {
          return Apollo.useLazyQuery<GetShoppingListItems, GetShoppingListItemsVariables>(GetShoppingListItemsDocument, baseOptions);
        }
export type GetShoppingListItemsHookResult = ReturnType<typeof useGetShoppingListItems>;
export type GetShoppingListItemsLazyQueryHookResult = ReturnType<typeof useGetShoppingListItemsLazyQuery>;
export type GetShoppingListItemsQueryResult = Apollo.QueryResult<GetShoppingListItems, GetShoppingListItemsVariables>;
export const GetShoppingListsDocument = gql`
    query GetShoppingLists {
  shoppingLists {
    ...ShoppingList_GetShoppingLists
  }
}
    ${ShoppingList_GetShoppingLists}`;

/**
 * __useGetShoppingLists__
 *
 * To run a query within a React component, call `useGetShoppingLists` and pass it any options that fit your needs.
 * When your component renders, `useGetShoppingLists` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetShoppingLists({
 *   variables: {
 *   },
 * });
 */
export function useGetShoppingLists(baseOptions?: Apollo.QueryHookOptions<GetShoppingLists, GetShoppingListsVariables>) {
        return Apollo.useQuery<GetShoppingLists, GetShoppingListsVariables>(GetShoppingListsDocument, baseOptions);
      }
export function useGetShoppingListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShoppingLists, GetShoppingListsVariables>) {
          return Apollo.useLazyQuery<GetShoppingLists, GetShoppingListsVariables>(GetShoppingListsDocument, baseOptions);
        }
export type GetShoppingListsHookResult = ReturnType<typeof useGetShoppingLists>;
export type GetShoppingListsLazyQueryHookResult = ReturnType<typeof useGetShoppingListsLazyQuery>;
export type GetShoppingListsQueryResult = Apollo.QueryResult<GetShoppingLists, GetShoppingListsVariables>;
export const GetSubCategoriesDocument = gql`
    query GetSubCategories($categoryId: Int!) {
  subCategories(categoryId: $categoryId) {
    ...Category_GetSubCategories
  }
}
    ${Category_GetSubCategories}`;

/**
 * __useGetSubCategories__
 *
 * To run a query within a React component, call `useGetSubCategories` and pass it any options that fit your needs.
 * When your component renders, `useGetSubCategories` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSubCategories({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *   },
 * });
 */
export function useGetSubCategories(baseOptions: Apollo.QueryHookOptions<GetSubCategories, GetSubCategoriesVariables>) {
        return Apollo.useQuery<GetSubCategories, GetSubCategoriesVariables>(GetSubCategoriesDocument, baseOptions);
      }
export function useGetSubCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSubCategories, GetSubCategoriesVariables>) {
          return Apollo.useLazyQuery<GetSubCategories, GetSubCategoriesVariables>(GetSubCategoriesDocument, baseOptions);
        }
export type GetSubCategoriesHookResult = ReturnType<typeof useGetSubCategories>;
export type GetSubCategoriesLazyQueryHookResult = ReturnType<typeof useGetSubCategoriesLazyQuery>;
export type GetSubCategoriesQueryResult = Apollo.QueryResult<GetSubCategories, GetSubCategoriesVariables>;
export const RegisterDocument = gql`
    mutation Register($registerForm: RegisterFormInput!) {
  register(form: $registerForm) {
    ...AuthResponse_Register
  }
}
    ${AuthResponse_Register}`;
export type RegisterMutationFn = Apollo.MutationFunction<Register, RegisterVariables>;

/**
 * __useRegister__
 *
 * To run a mutation, you first call `useRegister` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegister` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [register, { data, loading, error }] = useRegister({
 *   variables: {
 *      registerForm: // value for 'registerForm'
 *   },
 * });
 */
export function useRegister(baseOptions?: Apollo.MutationHookOptions<Register, RegisterVariables>) {
        return Apollo.useMutation<Register, RegisterVariables>(RegisterDocument, baseOptions);
      }
export type RegisterHookResult = ReturnType<typeof useRegister>;
export type RegisterMutationResult = Apollo.MutationResult<Register>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<Register, RegisterVariables>;
export const RemoveFromFavouriteListDocument = gql`
    mutation RemoveFromFavouriteList($productId: Int!) {
  removeFromFavouriteList(productId: $productId) {
    ...FavouriteListItem_RemoveToFavouriteList
  }
}
    ${FavouriteListItem_RemoveToFavouriteList}`;
export type RemoveFromFavouriteListMutationFn = Apollo.MutationFunction<RemoveFromFavouriteList, RemoveFromFavouriteListVariables>;

/**
 * __useRemoveFromFavouriteList__
 *
 * To run a mutation, you first call `useRemoveFromFavouriteList` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFromFavouriteList` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFromFavouriteList, { data, loading, error }] = useRemoveFromFavouriteList({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useRemoveFromFavouriteList(baseOptions?: Apollo.MutationHookOptions<RemoveFromFavouriteList, RemoveFromFavouriteListVariables>) {
        return Apollo.useMutation<RemoveFromFavouriteList, RemoveFromFavouriteListVariables>(RemoveFromFavouriteListDocument, baseOptions);
      }
export type RemoveFromFavouriteListHookResult = ReturnType<typeof useRemoveFromFavouriteList>;
export type RemoveFromFavouriteListMutationResult = Apollo.MutationResult<RemoveFromFavouriteList>;
export type RemoveFromFavouriteListMutationOptions = Apollo.BaseMutationOptions<RemoveFromFavouriteList, RemoveFromFavouriteListVariables>;
export const RemoveFromShoppingListDocument = gql`
    mutation RemoveFromShoppingList($itemId: Int!) {
  removeFromShoppingList(itemId: $itemId) {
    ...ShoppingListItem_RemoveFromShoppingList
  }
}
    ${ShoppingListItem_RemoveFromShoppingList}`;
export type RemoveFromShoppingListMutationFn = Apollo.MutationFunction<RemoveFromShoppingList, RemoveFromShoppingListVariables>;

/**
 * __useRemoveFromShoppingList__
 *
 * To run a mutation, you first call `useRemoveFromShoppingList` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFromShoppingList` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFromShoppingList, { data, loading, error }] = useRemoveFromShoppingList({
 *   variables: {
 *      itemId: // value for 'itemId'
 *   },
 * });
 */
export function useRemoveFromShoppingList(baseOptions?: Apollo.MutationHookOptions<RemoveFromShoppingList, RemoveFromShoppingListVariables>) {
        return Apollo.useMutation<RemoveFromShoppingList, RemoveFromShoppingListVariables>(RemoveFromShoppingListDocument, baseOptions);
      }
export type RemoveFromShoppingListHookResult = ReturnType<typeof useRemoveFromShoppingList>;
export type RemoveFromShoppingListMutationResult = Apollo.MutationResult<RemoveFromShoppingList>;
export type RemoveFromShoppingListMutationOptions = Apollo.BaseMutationOptions<RemoveFromShoppingList, RemoveFromShoppingListVariables>;
export const RemoveShoppingListDocument = gql`
    mutation RemoveShoppingList($shoppingListId: Int!) {
  removeShoppingList(shoppingListId: $shoppingListId) {
    ...ShoppingList_RemoveShoppingList
  }
}
    ${ShoppingList_RemoveShoppingList}`;
export type RemoveShoppingListMutationFn = Apollo.MutationFunction<RemoveShoppingList, RemoveShoppingListVariables>;

/**
 * __useRemoveShoppingList__
 *
 * To run a mutation, you first call `useRemoveShoppingList` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveShoppingList` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeShoppingList, { data, loading, error }] = useRemoveShoppingList({
 *   variables: {
 *      shoppingListId: // value for 'shoppingListId'
 *   },
 * });
 */
export function useRemoveShoppingList(baseOptions?: Apollo.MutationHookOptions<RemoveShoppingList, RemoveShoppingListVariables>) {
        return Apollo.useMutation<RemoveShoppingList, RemoveShoppingListVariables>(RemoveShoppingListDocument, baseOptions);
      }
export type RemoveShoppingListHookResult = ReturnType<typeof useRemoveShoppingList>;
export type RemoveShoppingListMutationResult = Apollo.MutationResult<RemoveShoppingList>;
export type RemoveShoppingListMutationOptions = Apollo.BaseMutationOptions<RemoveShoppingList, RemoveShoppingListVariables>;
export const UpdateShoppingListItemDocument = gql`
    mutation UpdateShoppingListItem($item: ShoppingListItemUpdateInput!) {
  updateShoppingListItem(item: $item) {
    ...ShoppingListItem_UpdateShoppingListItem
  }
}
    ${ShoppingListItem_UpdateShoppingListItem}`;
export type UpdateShoppingListItemMutationFn = Apollo.MutationFunction<UpdateShoppingListItem, UpdateShoppingListItemVariables>;

/**
 * __useUpdateShoppingListItem__
 *
 * To run a mutation, you first call `useUpdateShoppingListItem` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShoppingListItem` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShoppingListItem, { data, loading, error }] = useUpdateShoppingListItem({
 *   variables: {
 *      item: // value for 'item'
 *   },
 * });
 */
export function useUpdateShoppingListItem(baseOptions?: Apollo.MutationHookOptions<UpdateShoppingListItem, UpdateShoppingListItemVariables>) {
        return Apollo.useMutation<UpdateShoppingListItem, UpdateShoppingListItemVariables>(UpdateShoppingListItemDocument, baseOptions);
      }
export type UpdateShoppingListItemHookResult = ReturnType<typeof useUpdateShoppingListItem>;
export type UpdateShoppingListItemMutationResult = Apollo.MutationResult<UpdateShoppingListItem>;
export type UpdateShoppingListItemMutationOptions = Apollo.BaseMutationOptions<UpdateShoppingListItem, UpdateShoppingListItemVariables>;