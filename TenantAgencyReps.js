import React from "react";
import { getRepListCall, getRepDetailsCall } from "./TenantAgencyService";
import { Button, Card, Table, Collapse } from "reactstrap";
import Paginator from "../../shared/Paginator";
import LoadScreen from "../../shared/LoadScreen";
import { NavLink } from "react-router-dom";
import "./TenantAgency.css";
import avatar from "../../shared/default-avatar.png";

class TenantAgencyReps extends React.Component {
  state = {
    //For mapping information onto tables
    repList: [],
    repAccountsList: [],
    loading: true,
    //Pagination & Routing Props
    pageIndex: 0,
    pageSize: 5,
    totalCount: 1,
    totalPages: 1,
    //For collapsable table
    showCollapsed: false,
    lowerDisplayLimit: -1,
    upperDisplayLimit: 100,
    asyncHelper: false
  };

  getRepList = (pageIndex, pageSize, tenantId) => {
    const req = { pageIndex, pageSize, tenantId };
    getRepListCall(req)
      .then(Response => {
        console.log(Response);
        const representativeList = Response.data.item.pagedItems;
        const totalCount = Response.data.item.totalCount;
        const totalPages = Math.ceil(totalCount / pageSize);
        this.setState({
          repList: representativeList,
          totalCount: totalCount,
          totalPages: totalPages,
          loading: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  getRepDetails = (arId, tenantId) => {
    const req = { arId, tenantId };
    getRepDetailsCall(req)
      .then(Response => {
        console.log(Response);
        const repAccountsList = Response.data.item.pagedItems;
        this.setState({ repAccountsList: repAccountsList });
      })
      .catch(error => {
        console.log(error);
      });
  };

  closeCollapsedTable = () => {
    this.setState({
      asyncHelper: false,
      showCollapsed: !this.state.showCollapsed,
      lowerDisplayLimit: -1,
      upperDisplayLimit: 100
    });
  };

  parseDate = date => {
    if (date !== "0001-01-01T00:00:00") {
      let year = date.match(/\d{4}/);
      let month = date.match(/(?<=\d{4}-\d{2}-)\d{2}/);
      let day = date.match(/(?<=\d{4}-)\d{2}/);
      return day + "-" + month + "-" + year;
    } else {
      return "-";
    }
  };

  goToPage = pageIndex => {
    this.setState(
      prev => ({ pageIndex }),
      () => {
        this.getRepList(this.state.pageIndex, this.state.pageSize, this.state.tenantId);
      }
    );
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.getRepList(this.state.pageIndex, this.state.pageSize, this.state.tenantId);
  };

  backToHomePage = e => {
    this.props.history.push("/admin/tenantAgencyHomepage");
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          <LoadScreen />
        ) : (
          <div className="text-center">
            <h1>Account Representatives Information</h1>
            <Card>
              <div className="card-header">
                <div className="card-title-wrap bar-primary">
                  <h3>Account Representatives</h3>
                </div>
              </div>
              <p className="card-text">
                {" "}
                The following is a complete listing of your account representantives associated with
                your various client accounts through GROLO. To view a complete overview of an
                individual account rep click on his or her profile row. For further information on
                an individual client see the{" "}
                <NavLink to={"/admin/tenantAgencyHomepage/ClientAccounts"}>
                  {" "}
                  Client Accounts{" "}
                </NavLink>{" "}
                page. For more information on subscription revenue and other aggregated metrics see
                the <NavLink to={"/admin/tenantAgencyHomepage/KeyMetrics"}>
                  {" "}
                  Key Metrics{" "}
                </NavLink>{" "}
                section also accessible through the dashboard.
              </p>
            </Card>
            <Card>
              <NavLink to={"/admin/businessagencyrep"} style={{ fontSize: 23 }}>
                <i className="fa fa-user-plus" aria-hidden="true" style={{ color: "blue" }} />{" "}
                Assign Business Account Representatives
              </NavLink>
            </Card>
            <Card>
              <div className="row">
                <div className="col-sm-12">
                  <Card>
                    <div className="card-body">
                      <div className="card-block">
                        <Table responsive hover>
                          <thead>
                            <tr>
                              <th>Representative Name</th>
                              <th># of Accounts</th>
                              <th>Types of Subscriptions</th>
                              <th>New Subscriptions</th>
                              <th>Accounts closed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.repList.map((repList, index) => (
                              <tr
                                id={repList.arId}
                                key={index}
                                className={
                                  (index >= this.state.lowerDisplayLimit) &
                                  (index <= this.state.upperDisplayLimit)
                                    ? null
                                    : "hidden"
                                }
                                onClick={e => {
                                  this.state.showCollapsed
                                    ? this.closeCollapsedTable()
                                    : this.getRepDetails(
                                        this.state.repList[index].arId,
                                        this.state.tenantId
                                      );
                                  if (this.state.asyncHelper === false) {
                                    this.setState({
                                      showCollapsed: !this.state.showCollapsed,
                                      lowerDisplayLimit: index,
                                      upperDisplayLimit: index,
                                      asyncHelper: true
                                    });
                                  }
                                }}
                              >
                                {this.state.hide}
                                <td>
                                  <span className="avatar avatar-xs">
                                    <img
                                      src={
                                        repList.avatarUrl !== null &&
                                        repList.avatarUrl !== "google.com" &&
                                        repList.avatarUrl !== "123"
                                          ? repList.avatarUrl
                                          : avatar
                                      }
                                      alt="avatar"
                                    />
                                  </span>
                                  <br />
                                  <span>
                                    {repList.firstName} {repList.lastName}
                                  </span>
                                </td>
                                <td>{repList.premiumTotal + repList.standardTotal}</td>
                                <td>
                                  {repList.premiumTotal} Platinum{" "}
                                  <i
                                    className="fa fa-star"
                                    aria-hidden="true"
                                    style={{ color: "silver" }}
                                    alt="subStars"
                                  />
                                  <br />
                                  {repList.standardTotal} Gold{" "}
                                  <i
                                    className="fa fa-star"
                                    aria-hidden="true"
                                    style={{ color: "gold" }}
                                  />
                                </td>
                                <td
                                  style={repList.newAccounts !== 0 ? { color: "green" } : null}
                                  alt="avatar"
                                >
                                  {repList.newAccounts}
                                </td>
                                <td style={repList.closedAccounts !== 0 ? { color: "red" } : null}>
                                  {repList.closedAccounts}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        <Collapse isOpen={this.state.showCollapsed}>
                          <Table responsive>
                            <thead>
                              <tr style={{ backgroundColor: "white" }}>
                                <th>#</th>
                                <th>Account Name</th>
                                <th>Subscription Level</th>
                                <th>Date Created</th>
                                <th>Date Assigned to Rep.</th>
                                <th>Date Closed</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.repAccountsList.map((repAccount, index) => (
                                <tr
                                  key={index}
                                  style={index % 2 === 0 ? { backgroundColor: "#DBDBDC" } : null}
                                >
                                  <th>{index + 1}</th>
                                  <th>{repAccount.accountName}</th>
                                  <th>
                                    {repAccount.subscriptionLevel === 3 ? "Premium" : "Standard"}
                                  </th>
                                  <th>{this.parseDate(repAccount.dateCreated)}</th>
                                  <th>{this.parseDate(repAccount.dateAssigned)}</th>
                                  <th>{this.parseDate(repAccount.dateClosed)}</th>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Collapse>
                      </div>
                    </div>
                    {this.state.showCollapsed ? null : (
                      <Paginator
                        totalPages={this.state.totalPages}
                        currentPage={this.state.pageIndex}
                        totalCount={this.state.totalCount}
                        goTo={this.goToPage}
                        style={{ marginTop: "16px" }}
                        className="m-2"
                      />
                    )}
                  </Card>
                </div>
              </div>
            </Card>
            <Card>
              <Button color="primary" onClick={this.backToHomePage}>
                Back
              </Button>
            </Card>
          </div>
        )}
      </div>
    );
  }
}
export default TenantAgencyReps;
