using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Threading.Tasks;
using System.IO;
using System.Linq;
using System.Text;
using Microsoft.Extensions.Logging;

namespace Backend.Common.Logging
{
    public class RequestResponseLoggingMiddleware
    {
        private readonly int MAX_CONTENT_READ = 1024;
        private readonly RequestDelegate next;
        private readonly ILogger logger;

        public RequestResponseLoggingMiddleware(RequestDelegate next, ILogger<RequestResponseLoggingMiddleware> logger)
        {
            this.next = next;
            this.logger = logger;
        }

        private bool IsContentTypeTextBased(string contentyType)
        {
            return contentyType.Contains("text") || contentyType.Contains("json") || contentyType.Contains("html");
        }

        public async Task Invoke(HttpContext context)
        {

            var buffer = new char[MAX_CONTENT_READ];
            var readCnt = 0;

            var request = context.Request;
            if (request.ContentType != null && IsContentTypeTextBased(request.ContentType))
            {
                request.EnableBuffering();
                readCnt = Math.Min(Convert.ToInt32(request.ContentLength), MAX_CONTENT_READ);
                await (new StreamReader(request.Body)).ReadAsync(buffer, 0, readCnt);
                request.Body.Position = 0;

                logger.LogInformation($"Request: {FormatRequest(request, buffer, readCnt)}");
            }

            var response = context.Response;
            var originalBody = response.Body;
            readCnt = 0;
            try
            {
                using (var memStream = new MemoryStream())
                {
                    response.Body = memStream;
                    await next(context);
                    readCnt = Math.Min((int)response.Body.Length, MAX_CONTENT_READ);
                    memStream.Position = 0;
                    await (new StreamReader(response.Body)).ReadAsync(buffer, 0, readCnt);
                    memStream.Position = 0;
                    await memStream.CopyToAsync(originalBody);
                }
            }
            finally
            {
                response.Body = originalBody;
            }

            if (readCnt > 0 && response.ContentType != null && IsContentTypeTextBased(response.ContentType))
            {
                logger.LogInformation($"Response: {FormatResponse(response, buffer, readCnt)}");
            }

        }

        private string FormatRequest(HttpRequest request, char[] body, int cnt)
        {
            return $"{request.Scheme} {request.Host}{request.Path} {request.QueryString} {new string(body, 0, cnt)}";
        }

        private string FormatResponse(HttpResponse response, char[] body, int cnt)
        {
            return $"{response.StatusCode}: {new string(body, 0, cnt)}";
        }
    }

}
