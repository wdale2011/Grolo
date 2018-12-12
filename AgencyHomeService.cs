using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class AgencyHomeService
    {
        readonly IDataProvider dataProvider;

        public AgencyHomeService(IDataProvider dataProvider)
        {
            this.dataProvider = dataProvider;
        }

        /* GetAll Business Clients */
        public PagedResponse<AgencyBusiness> GetAll(int PageIndex, int PageSize, int TenantId)
        {
            PagedResponse<AgencyBusiness> pagedItemResponse = new PagedResponse<AgencyBusiness>();
            List<AgencyBusiness> listOfAgencyBusinesses = new List<AgencyBusiness>();
            dataProvider.ExecuteCmd(
                "AgencyHome_SelectAllBusinesses",
                (parameters) =>
                {
                    parameters.AddWithValue("@PageIndex", PageIndex);
                    parameters.AddWithValue("@PageSize", PageSize);
                    parameters.AddWithValue("@TenantId", TenantId);
                },
                (reader, resultSetIndex) =>
                {
                    AgencyBusiness agencyBusiness = new AgencyBusiness
                    {
                        BusinessName = (string)reader["Name"],
                        SubscriptionLevel = (int)reader["SubscriptionLevel"],
                        RepFirstName = (string)reader["FirstName"],
                        RepLastName = (string)reader["LastName"],
                        Street = (string)reader["Street"],
                        City = (string)reader["City"],
                        State = (string)reader["State"],
                        Zip = (string)reader["Zip"],
                        PhoneNumber = (string)reader["PhoneNumber"],
                        OwnerFirstName = (string)reader["OwnerFirstName"],
                        OwnerLastName = (string)reader["OwnerLastName"],
                        StartDate = (DateTime)reader["StartDate"]

                    };

                    pagedItemResponse.TotalCount = (int)reader["TotalRows"];

                    listOfAgencyBusinesses.Add(agencyBusiness);
                }
                );

            pagedItemResponse.PagedItems = listOfAgencyBusinesses;

            return pagedItemResponse;
        }
        /* GetAll Agency Reps With Data on their Performance */
        public PagedResponse<AgencyRepAccount> GetAllReps(int PageIndex, int PageSize, int TenantId)
        {
            PagedResponse<AgencyRepAccount> pagedItemResponse = new PagedResponse<AgencyRepAccount>();
            List<AgencyRepAccount> listOfRepAccounts = new List<AgencyRepAccount>();
            dataProvider.ExecuteCmd(
                "AgencyHome_SelectAllReps",
                (parameters) =>
                {
                    parameters.AddWithValue("@PageIndex", PageIndex);
                    parameters.AddWithValue("@PageSize", PageSize);
                    parameters.AddWithValue("@TenantId", TenantId);
                },
                (reader, resultSetIndex) =>
                {
                    AgencyRepAccount agencyRepAccount = new AgencyRepAccount
                    {
                        ArId = (int)reader["Id"],
                        FirstName = (string)reader["FirstName"],
                        LastName = (string)reader["LastName"],
                        AccountsTotal = (int)reader["BusinessCount"],
                        PremiumTotal = (int)reader["Premiums"],
                        StandardTotal = (int)reader["Standards"],
                        NewAccounts = (int)reader["NewCustomers"],
                        ClosedAccounts = (int)reader["LostCustomers"],
                        AvatarUrl = reader["AvatarUrl"] as string
                    };

                    //object avatarUrlObj = reader["AvatarUrl"];
                    //if (avatarUrlObj != DBNull.Value)
                    //{
                    //    agencyRepAccount.AvatarUrl = (string)avatarUrlObj;
                    //};

                    pagedItemResponse.TotalCount = (int)reader["TotalRows"];

                    listOfRepAccounts.Add(agencyRepAccount);
                }
                );

            pagedItemResponse.PagedItems = listOfRepAccounts;

            return pagedItemResponse;
        }
        /* Get Data for an Individual Representative */
        public PagedResponse<AgencyRepAccountDetails> GetRepDetails(int ArId, int TenantId)
        {
            PagedResponse<AgencyRepAccountDetails> pagedItemResponse = new PagedResponse<AgencyRepAccountDetails>();
            List<AgencyRepAccountDetails> listOfAccountDetails = new List<AgencyRepAccountDetails>();
            dataProvider.ExecuteCmd(
                "AgencyHome_SelectRep",
                (parameters) =>
                {
                    parameters.AddWithValue("@ArId", ArId);
                    parameters.AddWithValue("@TenantId", TenantId);
                },
                (reader, resultSetIndex) =>
                {
                    AgencyRepAccountDetails accountDetails = new AgencyRepAccountDetails
                    {
                        AccountName = (string)reader["Name"],
                        SubscriptionLevel = (int)reader["SubscriptionLevel"],
                        DateCreated = (DateTime)reader["StartDate"],
                    };

                    object dateAssignedObj = reader["DateAssigned"];
                    if (dateAssignedObj != DBNull.Value)
                    {
                        dateAssignedObj = (DateTime)dateAssignedObj;
                    }

                    object dateClosedObj = reader["DateCancelled"];
                    if (dateClosedObj != DBNull.Value)
                    {
                        dateClosedObj = (DateTime)dateClosedObj;
                    }

                    pagedItemResponse.TotalCount = (int)reader["TotalRows"];

                    listOfAccountDetails.Add(accountDetails);
                }
                );

            pagedItemResponse.PagedItems = listOfAccountDetails;

            return pagedItemResponse;
        }

        /* Get Metric Data for Graphs */
        public PagedResponse<MetricInfo> GetData(int tenantId)
        {
            PagedResponse<MetricInfo> pagedItemResponse = new PagedResponse<MetricInfo>();
            List<MetricInfo> metricInfos = new List<MetricInfo>();
            MetricInfo metricInfo = new MetricInfo();

            dataProvider.ExecuteCmd(
                "AgencyHome_MetricHandler",
                (parameters) =>
                {
                    parameters.AddWithValue("@TenantId", tenantId);
                },
                (reader, resultSetIndex) =>
                {
                    switch (resultSetIndex)
                    {
                        case 0: //SubMetrics
                            metricInfo.CurrentTotalAccounts = (int)reader["TotalAccounts"];
                            metricInfo.CurrentPremiums = (int)reader["Premiums"];
                            metricInfo.CurrentStandards = (int)reader["Standards"];
                            metricInfo.CurrentPremiumRevenue = (int)reader["PremiumRevenue"];
                            metricInfo.CurrentStandardRevenue = (int)reader["StandardRevenue"];

                            metricInfos.Add(metricInfo);
                            break;
                        case 1: //NewSubs
                            metricInfo.CurrentNewSubs = (int)reader["NewSubs"];
                            break;
                        case 2: //CancelledSubs
                            metricInfo.CurrentCancelledSubs = (int)reader["CancelledSubs"];
                            break;
                        case 3: //MonthlyTotalSubs
                            metricInfo.JanTotalSubs = (int)reader["JanTotalSubs"];
                            metricInfo.FebTotalSubs = (int)reader["FebTotalSubs"];
                            metricInfo.MarTotalSubs = (int)reader["MarTotalSubs"];
                            metricInfo.AprTotalSubs = (int)reader["AprTotalSubs"];
                            metricInfo.MayTotalSubs = (int)reader["MayTotalSubs"];
                            metricInfo.JunTotalSubs = (int)reader["JunTotalSubs"];
                            metricInfo.JulTotalSubs = (int)reader["JulTotalSubs"];
                            metricInfo.AugTotalSubs = (int)reader["AugTotalSubs"];
                            metricInfo.SeptTotalSubs = (int)reader["SeptTotalSubs"];
                            metricInfo.OctTotalSubs = (int)reader["OctTotalSubs"];
                            metricInfo.NovTotalSubs = (int)reader["NovTotalSubs"];
                            metricInfo.DecTotalSubs = (int)reader["DecTotalSubs"];
                            break;
                        case 4: //MonthlySubType
                            metricInfo.JanPremium = (int)reader["JanPremium"];
                            metricInfo.JanStandard = (int)reader["JanStandard"];
                            metricInfo.FebPremium = (int)reader["FebPremium"];
                            metricInfo.FebStandard = (int)reader["FebStandard"];
                            metricInfo.AprPremium = (int)reader["AprPremium"];
                            metricInfo.AprStandard = (int)reader["AprStandard"];
                            metricInfo.MayPremium = (int)reader["MayPremium"];
                            metricInfo.MayStandard = (int)reader["MayStandard"];
                            metricInfo.JunPremium = (int)reader["JunPremium"];
                            metricInfo.JunStandard = (int)reader["JunStandard"];
                            metricInfo.JulPremium = (int)reader["JulPremium"];
                            metricInfo.JulStandard = (int)reader["JulStandard"];
                            metricInfo.AugPremium = (int)reader["AugPremium"];
                            metricInfo.AugStandard = (int)reader["AugStandard"];
                            metricInfo.SeptPremium = (int)reader["SeptPremium"];
                            metricInfo.SeptStandard = (int)reader["SeptStandard"];
                            metricInfo.OctPremium = (int)reader["OctPremium"];
                            metricInfo.OctStandard = (int)reader["OctStandard"];
                            metricInfo.NovPremium = (int)reader["NovPremium"];
                            metricInfo.NovStandard = (int)reader["NovStandard"];
                            metricInfo.DecPremium = (int)reader["DecPremium"];
                            metricInfo.DecStandard = (int)reader["DecStandard"];
                            break;
                        case 5: //MonthlyNewSubs
                            metricInfo.JanNewSubs = (int)reader["JanNewSubs"];
                            metricInfo.FebNewSubs = (int)reader["FebNewSubs"];
                            metricInfo.MarNewSubs = (int)reader["MarNewSubs"];
                            metricInfo.AprNewSubs = (int)reader["AprNewSubs"];
                            metricInfo.MayNewSubs = (int)reader["MayNewSubs"];
                            metricInfo.JunNewSubs = (int)reader["JunNewSubs"];
                            metricInfo.JulNewSubs = (int)reader["JulNewSubs"];
                            metricInfo.AugNewSubs = (int)reader["AugNewSubs"];
                            metricInfo.SeptNewSubs = (int)reader["SeptNewSubs"];
                            metricInfo.OctNewSubs = (int)reader["OctNewSubs"];
                            metricInfo.NovNewSubs = (int)reader["NovNewSubs"];
                            metricInfo.DecNewSubs = (int)reader["DecNewSubs"];
                            break;
                        case 6: //MonthlyCancelled
                            metricInfo.JanCancelled = (int)reader["JanCancelled"];
                            metricInfo.FebCancelled = (int)reader["FebCancelled"];
                            metricInfo.MarCancelled = (int)reader["MarCancelled"];
                            metricInfo.AprCancelled = (int)reader["AprCancelled"];
                            metricInfo.MayCancelled = (int)reader["MayCancelled"];
                            metricInfo.JunCancelled = (int)reader["JunCancelled"];
                            metricInfo.JulCancelled = (int)reader["JulCancelled"];
                            metricInfo.AugCancelled = (int)reader["AugCancelled"];
                            metricInfo.SeptCancelled = (int)reader["SeptCancelled"];
                            metricInfo.OctCancelled = (int)reader["OctCancelled"];
                            metricInfo.NovCancelled = (int)reader["NovCancelled"];
                            metricInfo.DecCancelled = (int)reader["DecCancelled"];
                            break;
                    }
                }
                );

            pagedItemResponse.PagedItems = metricInfos;

            return pagedItemResponse;
        }
    }
}
