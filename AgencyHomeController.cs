using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Responses;
using Sabio.Services;
using Sabio.Services.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Sabio.Web.Controllers
{
    [RoutePrefix("api/agencyHome")]
    public class AgencyHomeController : ApiController
    {
        readonly AgencyHomeService agencyHomeService;

        public AgencyHomeController(AgencyHomeService agencyHomeService)
        {
            this.agencyHomeService = agencyHomeService;
        }

        [HttpGet, Route("agencyBusinesses/{pageIndex:int}/{pageSize:int}")]
        public HttpResponseMessage GetAll(int pageIndex, int pageSize)
        {
            int tenantId = (int)User.Identity.GetTenantId();
            PagedResponse<AgencyBusiness> pagedItemResponse = agencyHomeService.GetAll(pageIndex, pageSize, tenantId);

            return Request.CreateResponse(HttpStatusCode.OK, new ItemResponse<PagedResponse<AgencyBusiness>>
            {
                Item = pagedItemResponse
            });
        }
        [HttpGet, Route("agencyRepresentatives/{pageIndex:int}/{pageSize:int}")]
        public HttpResponseMessage GetAllReps(int pageIndex, int pageSize)
        {
            int tenantId = (int)User.Identity.GetTenantId();
            PagedResponse<AgencyRepAccount> pagedItemResponse = agencyHomeService.GetAllReps(pageIndex, pageSize, tenantId);

            return Request.CreateResponse(HttpStatusCode.OK, new ItemResponse<PagedResponse<AgencyRepAccount>>
            {
                Item = pagedItemResponse
            });
        }
        [HttpGet, Route("agencyRepresentatives/{arId:int}")]
        public HttpResponseMessage GetRepDetails(int arId)
        {
            int tenantId = (int)User.Identity.GetTenantId();
            PagedResponse<AgencyRepAccountDetails> pagedItemResponse = agencyHomeService.GetRepDetails(arId, tenantId);

            return Request.CreateResponse(HttpStatusCode.OK, new ItemResponse<PagedResponse<AgencyRepAccountDetails>>
            {
                Item = pagedItemResponse
            });
        }
        [HttpGet, Route("agencyMetrics")]
        public HttpResponseMessage GetData()
        {
            int tenantId = (int)User.Identity.GetTenantId();
            PagedResponse<MetricInfo> pagedItemResponse = agencyHomeService.GetData(tenantId);

            return Request.CreateResponse(HttpStatusCode.OK, new ItemResponse<PagedResponse<MetricInfo>>
            {
                Item = pagedItemResponse
            });
        }
    }
}