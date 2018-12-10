import React from "react";
import { NavLink } from "react-router-dom";
import { Card } from "reactstrap";
import { getTenantById } from "../../services/tenant.service";
import { connect } from "react-redux";

class TenantDashboard extends React.Component {
  state = {
    companyName: "",
    companyLogo: ""
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.getAgencyInfo();
  };

  getAgencyInfo = () => {
    getTenantById(this.props.user.tenantId)
      .then(Response => {
        console.log(Response);
        this.setState({
          companyName: Response.data.item.companyName,
          companyLogo: Response.data.item.imageUrl
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const prefix = this.props.match.path;
    return (
      <div>
        <div className="text-center">
          <br />
          <h1> Welcome {this.state.companyName}!</h1>
          <br />
          {this.state.companyLogo === null ? null : (
            <img alt="companyLogo" src={this.state.companyLogo} />
          )}
          <br />
          <div>
            <Card>
              <NavLink to={prefix + "/AgencyEdit"} style={{ fontSize: 40 }}>
                <i
                  className="fa fa-pencil"
                  aria-hidden="true"
                  style={{ color: "blue", fontSize: 30 }}
                />{" "}
                Edit your Agency Profile
              </NavLink>
            </Card>
            <Card>
              <NavLink to={prefix + "/AgencyReps"} style={{ fontSize: 40 }}>
                <i
                  className="fa fa-user"
                  aria-hidden="true"
                  style={{ color: "blue", fontSize: 30 }}
                />{" "}
                Agency Representatives
              </NavLink>
            </Card>
            <Card>
              <NavLink to={prefix + "/ClientAccounts"} style={{ fontSize: 40 }}>
                <i
                  className="fa fa-building"
                  aria-hidden="true"
                  style={{ color: "blue", fontSize: 30 }}
                  alt="newBusiness"
                />{" "}
                Client Accounts
              </NavLink>
            </Card>
            <Card>
              <NavLink to={prefix + "/KeyMetrics"} style={{ fontSize: 40 }}>
                <i
                  className="fa fa-area-chart"
                  aria-hidden="true"
                  style={{ color: "blue", fontSize: 30 }}
                  alt="businessRep"
                />{" "}
                Key Metrics
              </NavLink>
            </Card>
            <Card>
              <NavLink to={"/admin/appuser/userlist"} style={{ fontSize: 40 }}>
                <i
                  className="fa fa-users"
                  aria-hidden="true"
                  style={{ color: "blue", fontSize: 30 }}
                  alt="businessRep"
                />{" "}
                Assign User Roles
              </NavLink>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(TenantDashboard);
