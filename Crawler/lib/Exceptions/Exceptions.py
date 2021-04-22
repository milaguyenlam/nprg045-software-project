


class LoadingBaseDataError(Exception):
    pass

class ProductScrapeError(Exception):
    pass

class FailedSessionInit(Exception):
    pass

class ProcessPagesError(Exception): # should it inherit from ProductScrapeError?
    pass

class GetFirstPageError(ProcessPagesError):
    pass

class GetPageCountError(ProcessPagesError):
    pass

# --------------- GET PAGE EXCEPTIONS ---------------
class GetPageError(Exception):
    pass
class FailedToBuildPage(GetPageError):
    pass

# --------------- PARSING EXCEPTIONS ---------------
class ParsePageError(ProductScrapeError):
    pass

class ProductInfoError(ParsePageError):
    pass

class ProductPageParseError(ParsePageError):
    pass

# --------------- GET SOURCE EXCEPTIONS ---------------
class GetSourceError(OSError, Exception):
    pass

class MaxRetriesReached(GetSourceError):
    pass

class BadResponse(GetSourceError):
    pass
