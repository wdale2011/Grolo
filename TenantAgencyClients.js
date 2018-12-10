import React from "react";
import { Table, Card, Button } from "reactstrap";
import { getClientListCall } from "./TenantAgencyService";
import Paginator from "../../shared/Paginator";
import LoadScreen from "../../shared/LoadScreen";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

class TenantAgencyClients extends React.Component {
  state = {
    pageIndex: 0,
    pageSize: 5,
    totalCount: 1,
    totalPages: 1,
    clientList: [],
    pageLoading: true
  };

  getClientList = (pageIndex, pageSize, tenantId) => {
    const req = { pageIndex, pageSize, tenantId };
    getClientListCall(req)
      .then(Response => {
        console.log(Response);
        const businessList = Response.data.item.pagedItems;
        const totalCount = Response.data.item.totalCount;
        const totalPages = Math.ceil(totalCount / pageSize);
        this.setState({
          clientList: businessList,
          totalCount: totalCount,
          totalPages: totalPages,
          pageLoading: false
        });
      })
      .catch(Error => {
        console.log(Error);
      });
  };

  backToHomePage = e => {
    this.props.history.push("/admin/tenantAgencyHomepage");
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.getClientList(this.state.pageIndex, this.state.pageSize, this.props.user.tenantId);
  };

  goToPage = pageIndex => {
    this.setState(
      prev => ({ pageIndex }),
      () => {
        this.getClientList(this.state.pageIndex, this.state.pageSize, this.props.user.tenantId);
      }
    );
  };

  parseStartDate = startDate => {
    let year = startDate.match(/\d{4}/);
    let month = startDate.match(/(?<=\d{4}-\d{2}-)\d{2}/);
    let day = startDate.match(/(?<=\d{4}-)\d{2}/);
    return day + "-" + month + "-" + year;
  };

  render() {
    return (
      <div>
        {this.state.pageLoading ? (
          <LoadScreen />
        ) : (
          <div>
            {this.state.pageloading ? (
              <LoadScreen />
            ) : (
              <div className="container-fluid">
                <div className="col-12">
                  <div className="text-center">
                    <br />
                    <h1>Client Information</h1>
                    <Card>
                      <div className="card-header">
                        <div className="card-title-wrap bar-warning">
                          <h3>Overview of Clients</h3>
                        </div>
                      </div>
                      <p className="card-text">
                        {" "}
                        The following is a complete overview of your clients subscribed through
                        GROLO. For additional information on the subscription level see the{" "}
                        <NavLink to={"/admin/tenantAgencyHomepage/KeyMetrics"}>
                          {" "}
                          Key Metrics{" "}
                        </NavLink>{" "}
                        section. For more information on your sales representatives and their
                        accounts see the{" "}
                        <NavLink to={"/admin/tenantAgencyHomepage/AgencyReps"}>
                          {" "}
                          Account Representatives{" "}
                        </NavLink>{" "}
                        section. To add new clients or search for existing ones click the "add
                        client business" link below.
                      </p>
                    </Card>
                    <Card>
                      <NavLink to="/admin/businessContainer" style={{ fontSize: 23 }}>
                        <i
                          className="fa fa-building"
                          aria-hidden="true"
                          style={{ color: "blue" }}
                          alt="newBusiness"
                        />
                        <span style={{ fontWeight: "bold" }}>+</span> Manage Business Clients
                      </NavLink>
                    </Card>
                    <div>
                      <Card>
                        <Table striped borderless responsive>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Business Name</th>
                              <th>Subscription Level</th>
                              <th>Account Rep.</th>
                              <th>Address</th>
                              <th>Contact Number</th>
                              <th>Business Owner</th>
                              <th>Customer Since</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.clientList.map((clientList, index) => (
                              <tr key={index + 1}>
                                <td>{index + 1}</td>
                                <td>{clientList.businessName}</td>
                                <td>
                                  {clientList.subscriptionLevel === 3 ? "Premium" : "Standard"}
                                </td>
                                <td>
                                  {clientList.repFirstName} {clientList.repLastName}
                                </td>
                                <td>
                                  {clientList.street}, {clientList.city}, {clientList.state},
                                  {clientList.zip}
                                </td>
                                <td>{clientList.phoneNumber}</td>
                                <td>
                                  {clientList.ownerFirstName} {clientList.ownerLastName}
                                </td>
                                <td>{this.parseStartDate(clientList.startDate)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card>
                      <Paginator
                        totalPages={this.state.totalPages}
                        currentPage={this.state.pageIndex}
                        totalCount={this.state.totalCount}
                        goTo={this.goToPage}
                        style={{ marginTop: "16px" }}
                        className="m-2"
                      />
                      <Card>
                        <Button
                          className="box-shadow-2"
                          color="primary"
                          onClick={this.backToHomePage}
                        >
                          Back
                        </Button>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(TenantAgencyClients);
