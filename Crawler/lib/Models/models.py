# generated by datamodel-codegen:
#   filename:  crawler-schema.json
#   timestamp: 2021-02-09T20:53:18+00:00

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class Producer(BaseModel):
    Name: str
    ThumbnailPath: Optional[str] = None


class Category(BaseModel):
    Name: str


class Product(BaseModel):
    Name: str
    Producer: Optional[Producer] = Field(None, title='Producer')
    Categories: List[Category]
    Description: Optional[str] = None
    EAN: Optional[str] = None
    PicturePath: Optional[str] = None


class Vendor(BaseModel):
    Name: str
    ThumbnailPath: Optional[str] = None


class Geolocation(BaseModel):
    Latitude: float
    Longitude: float


class ContactDetails(BaseModel):
    Geolocation: Geolocation = Field(..., title='Geolocation')
    Email: Optional[str] = None
    Street: Optional[str] = None
    City: Optional[str] = None
    PostCode: Optional[str] = None
    Phone: Optional[str] = None
    Ico: Optional[str] = None
    Country: Optional[str] = None


class Store(BaseModel):
    Vendor: Vendor = Field(..., title='Vendor')
    ContactDetails: ContactDetails = Field(..., title='ContactDetails')
    OpeningHours: Optional[str] = None


class Offer(BaseModel):
    Price: float
    Product: Product = Field(..., title='Product')
    Store: Store = Field(..., title='Store')
    FromDate: Optional[str] = None
    ToDate: Optional[str] = None
    Description: Optional[str] = None
    DiscountRate: Optional[float] = None
    InStockCount: Optional[int] = None
    Source: str
    ScrapeTime: Optional[str] = None
    IsTaxed: Optional[bool] = None
