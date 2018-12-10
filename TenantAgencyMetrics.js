import React from "react";
import { Button, Card } from "reactstrap";
import { Pie, Bar } from "react-chartjs-2";
import { getGraphDataCall } from "./TenantAgencyService";
import LoadScreen from "../../shared/LoadScreen";
import { NavLink } from "react-router-dom";

class TenantAgencyMetrics extends React.Component {
  state = {
    pageLoading: true,
    //Toggle states
    showMonthlyRevenueChart: false,
    showMonthlySubChart: false,
    showNewSubsChart: false,
    showCurrentSubsChart: false,
    //Current Data
    totalSubs: 0,
    totalRevenue: 0,
    //Monthly Revenue Data
    monthlyRevenueData: {},
    //Monthly Total Subscriptions Data
    monthlyTotalSubsData: {},
    //Current New Subscription Data
    newSubsData: {},
    //Current Subscription Distribution Data
    subTypeData: {},
    //Monthly Subscription Distribuction Data
    monthlySubTypeData: {},
    //Monthly New and Cancelled Subscription Data
    monthlyNewSubData: {},
    //Sets Chart to minimum y-axis: 0, and max y-axis: 1
    percentOptions: {
      scales: {
        yAxes: [
          {
            ticks: {
              suggestedMin: 0,
              suggestedMax: 1
            }
          }
        ]
      },
      maintainAspectRatio: false
    },
    //Just sets minimum y-axis : 0
    yAxesZero: {
      scales: {
        yAxes: [
          {
            ticks: {
              suggestedMin: 0
            }
          }
        ]
      }
    }
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.getGraphData();
  };

  backToHomePage = e => {
    this.props.history.push("/admin/tenantAgencyHomepage");
  };

  getGraphData = () => {
    const req = { tenantId: this.state.tenantId };
    getGraphDataCall(req)
      .then(Response => {
        console.log(Response);
        //Current total, subscription types, and revenue
        let totalSubs = Response.data.item.pagedItems[0].currentTotalAccounts;
        let premium = Response.data.item.pagedItems[0].currentPremiums;
        let standard = Response.data.item.pagedItems[0].currentStandards;
        let premiumRev = Response.data.item.pagedItems[0].currentPremiumRevenue;
        let standardRev = Response.data.item.pagedItems[0].currentStandardRevenue;
        let totalRevenue = premiumRev + standardRev;
        //New Subscription Data
        let newSubs = Response.data.item.pagedItems[0].currentNewSubs;
        //Cancelled Subscription Data
        let cancelledSubs = Response.data.item.pagedItems[0].currentCancelledSubs;
        //Difference in Subscriptions
        let differenceInSubs = newSubs - cancelledSubs;
        //Monthly Total Subscriptions
        let janTotal = Response.data.item.pagedItems[0].janTotalSubs;
        let febTotal = Response.data.item.pagedItems[0].febTotalSubs;
        let marTotal = Response.data.item.pagedItems[0].marTotalSubs;
        let aprTotal = Response.data.item.pagedItems[0].aprTotalSubs;
        let mayTotal = Response.data.item.pagedItems[0].mayTotalSubs;
        let junTotal = Response.data.item.pagedItems[0].junTotalSubs;
        let julTotal = Response.data.item.pagedItems[0].julTotalSubs;
        let augTotal = Response.data.item.pagedItems[0].augTotalSubs;
        let septTotal = Response.data.item.pagedItems[0].septTotalSubs;
        let octTotal = Response.data.item.pagedItems[0].octTotalSubs;
        let novTotal = Response.data.item.pagedItems[0].novTotalSubs;
        let decTotal = Response.data.item.pagedItems[0].decTotalSubs;
        //Monthly Subscription Distribution Data
        let janPremium = Response.data.item.pagedItems[0].janPremium;
        let janStandard = Response.data.item.pagedItems[0].janStandard;
        let febPremium = Response.data.item.pagedItems[0].febPremium;
        let febStandard = Response.data.item.pagedItems[0].febStandard;
        let marPremium = Response.data.item.pagedItems[0].marPremium;
        let marStandard = Response.data.item.pagedItems[0].marStandard;
        let aprPremium = Response.data.item.pagedItems[0].aprPremium;
        let aprStandard = Response.data.item.pagedItems[0].aprStandard;
        let mayPremium = Response.data.item.pagedItems[0].mayPremium;
        let mayStandard = Response.data.item.pagedItems[0].mayStandard;
        let junPremium = Response.data.item.pagedItems[0].junPremium;
        let junStandard = Response.data.item.pagedItems[0].junStandard;
        let julPremium = Response.data.item.pagedItems[0].julPremium;
        let julStandard = Response.data.item.pagedItems[0].julStandard;
        let augPremium = Response.data.item.pagedItems[0].augPremium;
        let augStandard = Response.data.item.pagedItems[0].augStandard;
        let septPremium = Response.data.item.pagedItems[0].septPremium;
        let septStandard = Response.data.item.pagedItems[0].septStandard;
        let octPremium = Response.data.item.pagedItems[0].octPremium;
        let octStandard = Response.data.item.pagedItems[0].octStandard;
        let novPremium = Response.data.item.pagedItems[0].novPremium;
        let novStandard = Response.data.item.pagedItems[0].novStandard;
        let decPremium = Response.data.item.pagedItems[0].decPremium;
        let decStandard = Response.data.item.pagedItems[0].decStandard;
        //Monthly New Subscription Data
        let janNewSubs = Response.data.item.pagedItems[0].janNewSubs;
        let febNewSubs = Response.data.item.pagedItems[0].febNewSubs;
        let marNewSubs = Response.data.item.pagedItems[0].marNewSubs;
        let aprNewSubs = Response.data.item.pagedItems[0].aprNewSubs;
        let mayNewSubs = Response.data.item.pagedItems[0].mayNewSubs;
        let junNewSubs = Response.data.item.pagedItems[0].junNewSubs;
        let julNewSubs = Response.data.item.pagedItems[0].julNewSubs;
        let augNewSubs = Response.data.item.pagedItems[0].augNewSubs;
        let septNewSubs = Response.data.item.pagedItems[0].septNewSubs;
        let octNewSubs = Response.data.item.pagedItems[0].octNewSubs;
        let novNewSubs = Response.data.item.pagedItems[0].novNewSubs;
        let decNewSubs = Response.data.item.pagedItems[0].decNewSubs;
        //Monthly Cancelled Subscription Data
        let janCancelled = Response.data.item.pagedItems[0].janCancelled;
        let febCancelled = Response.data.item.pagedItems[0].febCancelled;
        let marCancelled = Response.data.item.pagedItems[0].marCancelled;
        let aprCancelled = Response.data.item.pagedItems[0].aprCancelled;
        let mayCancelled = Response.data.item.pagedItems[0].mayCancelled;
        let junCancelled = Response.data.item.pagedItems[0].junCancelled;
        let julCancelled = Response.data.item.pagedItems[0].julCancelled;
        let augCancelled = Response.data.item.pagedItems[0].augCancelled;
        let septCancelled = Response.data.item.pagedItems[0].septCancelled;
        let octCancelled = Response.data.item.pagedItems[0].octCancelled;
        let novCancelled = Response.data.item.pagedItems[0].novCancelled;
        let decCancelled = Response.data.item.pagedItems[0].decCancelled;
        //Data for Monthly Revenue Chart
        let monthlyRevenueData = {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec"
          ],
          datasets: [
            {
              type: "line",
              label: "Revenue in $",
              data: [
                10000,
                20000,
                30000,
                35000,
                32500,
                20000,
                10000,
                90000,
                50000,
                60000,
                71200,
                20000
              ],
              fill: true,
              borderColor: "#00cc66",
              pointBackgroundColor: "#00994d"
            }
          ]
        };
        //Data for Monthly Total Subscription Chart
        let monthlyTotalSubsData = {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec"
          ],
          datasets: [
            {
              label: "Total Subscriptions",
              data: [
                janTotal,
                febTotal,
                marTotal,
                aprTotal,
                mayTotal,
                junTotal,
                julTotal,
                augTotal,
                septTotal,
                octTotal,
                novTotal,
                decTotal
              ],
              backgroundColor: "purple",
              borderColor: "red",
              hoverBackgroundColor: "pink",
              hoverBorderColor: "red"
            }
          ]
        };
        //Data for Current Subscription Distribution Type
        let subTypeData = {
          labels: ["Premium", "Standard"],
          datasets: [
            {
              data: [premium, standard],
              backgroundColor: ["#ffcc00", "#6666ff"]
            }
          ]
        };
        //Data for Monthly Subscription Distribution Type
        let monthlySubTypeData = {
          labels: [
            "Jan.",
            "Feb.",
            "Mar.",
            "Apr.",
            "May",
            "Jun.",
            "Jul.",
            "Aug.",
            "Sept.",
            "Oct.",
            "Nov.",
            "Dec."
          ],
          datasets: [
            {
              label: "Standard",
              data: [
                janStandard,
                febStandard,
                marStandard,
                aprStandard,
                mayStandard,
                junStandard,
                julStandard,
                augStandard,
                septStandard,
                octStandard,
                novStandard,
                decStandard
              ],
              backgroundColor: "lightBlue",
              borderColor: "blue",
              hoverBackgroundColor: "blue",
              hoverBorderColor: "blue"
            },
            {
              label: "Premium",
              data: [
                janPremium,
                febPremium,
                marPremium,
                aprPremium,
                mayPremium,
                junPremium,
                julPremium,
                augPremium,
                septPremium,
                octPremium,
                novPremium,
                decPremium
              ],
              backgroundColor: "#ffff66",
              borderColor: "orange",
              hoverBackgroundColor: "yellow",
              hoverBorderColor: "yellow"
            }
          ]
        };
        //Data for Current New and Cancelled Subscriptions
        let newSubsData = {
          labels: ["This Month"],
          datasets: [
            {
              label: "New Subscriptions",
              data: [newSubs],
              backgroundColor: "lightGreen",
              borderColor: "green",
              hoverBackgroundColor: "green",
              hoverBorderColor: "green"
            },
            {
              label: "Cancelled Subscriptions",
              data: [cancelledSubs],
              backgroundColor: "pink",
              borderColor: "red",
              hoverBackgroundColor: "red",
              hoverBorderColor: "red"
            },
            {
              label: "Difference in Subscriptions",
              data: [differenceInSubs],
              backgroundColor: "lightBlue",
              borderColor: "blue",
              hoverBackgroundColor: "blue",
              hoverBorderColor: "blue"
            }
          ]
        };
        let monthlyNewSubData = {
          labels: [
            "Jan.",
            "Feb.",
            "Mar.",
            "Apr.",
            "May",
            "Jun.",
            "Jul.",
            "Aug.",
            "Sept.",
            "Oct.",
            "Nov.",
            "Dec."
          ],
          datasets: [
            {
              label: "New Subscriptions",
              data: [
                janNewSubs,
                febNewSubs,
                marNewSubs,
                aprNewSubs,
                mayNewSubs,
                junNewSubs,
                julNewSubs,
                augNewSubs,
                septNewSubs,
                octNewSubs,
                novNewSubs,
                decNewSubs
              ],
              backgroundColor: "lightGreen",
              borderColor: "green",
              hoverBackgroundColor: "green",
              hoverBorderColor: "green"
            },
            {
              label: "Canceled Subscriptions",
              data: [
                janCancelled,
                febCancelled,
                marCancelled,
                aprCancelled,
                mayCancelled,
                junCancelled,
                julCancelled,
                augCancelled,
                septCancelled,
                octCancelled,
                novCancelled,
                decCancelled
              ],
              backgroundColor: "pink",
              borderColor: "red",
              hoverBackgroundColor: "red",
              hoverBorderColor: "red"
            },
            {
              label: "Total Change in Subscriptions",
              data: [
                janNewSubs - janCancelled,
                febNewSubs - febCancelled,
                marNewSubs - marCancelled,
                aprNewSubs - aprCancelled,
                mayNewSubs - mayCancelled,
                junNewSubs - junCancelled,
                julNewSubs - julCancelled,
                augNewSubs - augCancelled,
                septNewSubs - septCancelled,
                octNewSubs - octCancelled,
                novNewSubs - novCancelled,
                decNewSubs - decCancelled
              ],
              backgroundColor: "lightblue",
              borderColor: "blue",
              hoverBackgroundColor: "blue",
              hoverBorderColor: "blue"
            }
          ]
        };
        //Sets all the data variables equal to state for rendering
        this.setState({
          monthlyRevenueData: monthlyRevenueData,
          monthlyTotalSubsData: monthlyTotalSubsData,
          monthlySubTypeData: monthlySubTypeData,
          monthlyNewSubData: monthlyNewSubData,
          subTypeData: subTypeData,
          totalSubs: totalSubs,
          totalRevenue: totalRevenue,
          newSubsData: newSubsData,
          pageLoading: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        {this.state.pageLoading ? (
          <LoadScreen />
        ) : (
          <div>
            <div className="text-center">
              <h1>Key Points of Information</h1>
              <Card>
                <div className="card-header">
                  <div className="card-title-wrap bar-success">
                    <h3>Key Metrics</h3>
                  </div>
                </div>
                <p className="card-text">
                  {" "}
                  Provided below are metrics that help demonstrate key points of information as they
                  relate to your account representatives and your clients through GROLO. For more
                  specific information on one of your account representatives and their accounts see
                  the
                  <NavLink to={"/admin/tenantAgencyHomepage/AgencyReps"}>
                    {" "}
                    Agency Representatives
                  </NavLink>{" "}
                  section. For more information on an individual client and their business, see the{" "}
                  <NavLink to={"/admin/tenantAgencyHomepage/ClientAccounts"}>
                    {" "}
                    Client Accounts{" "}
                  </NavLink>
                  section.
                </p>
              </Card>
              <Card>
                <div className="card-header">
                  <div className="card-title">
                    <h3>Current Subscription Revenue and Total Subscriptions</h3>
                  </div>
                </div>
                <h5>
                  Total Revenue : <span style={{ color: "green" }}>${this.state.totalRevenue}</span>
                </h5>
                <h5>
                  Total Number of Subscriptions :{" "}
                  <span style={{ color: "blue" }}>{this.state.totalSubs}</span>
                </h5>
              </Card>
              <Card>
                <div className="card-header">
                  <div className="card-title">
                    <h3>Monthly Subscription Revenue</h3>
                  </div>
                </div>
                {this.state.showMonthlyRevenueChart ? (
                  <Button
                    onClick={() => this.setState({ showMonthlyRevenueChart: false })}
                    block
                    color="primary"
                  >
                    Hide Graph
                  </Button>
                ) : (
                  <Button
                    onClick={() => this.setState({ showMonthlyRevenueChart: true })}
                    block
                    color="success"
                  >
                    Show Graph
                  </Button>
                )}
                <div>
                  {this.state.showMonthlyRevenueChart ? (
                    <Bar
                      data={this.state.monthlyRevenueData}
                      width={100}
                      height={400}
                      options={{
                        maintainAspectRatio: false
                      }}
                    />
                  ) : null}
                </div>
              </Card>
              <Card>
                <div className="card-header">
                  <div className="card-title">
                    <h3>Monthly Subscription Total</h3>
                  </div>
                </div>
                {this.state.showMonthlyTotal ? (
                  <Button
                    onClick={() => this.setState({ showMonthlyTotal: false })}
                    block
                    color="primary"
                  >
                    Hide Graph
                  </Button>
                ) : (
                  <Button
                    onClick={() => this.setState({ showMonthlyTotal: true })}
                    block
                    color="success"
                  >
                    Show Graph
                  </Button>
                )}
                <div>
                  {this.state.showMonthlyTotal ? (
                    <Bar
                      data={this.state.monthlyTotalSubsData}
                      width={100}
                      height={400}
                      options={{ maintainAspectRatio: false }}
                    />
                  ) : null}
                </div>
              </Card>
              <Card>
                <div className="card-header">
                  <div className="card-title">
                    <h3>Current Subscription Type Distribution</h3>
                  </div>
                </div>
                {this.state.showCurrentSubsChart ? (
                  <Button
                    onClick={() => this.setState({ showCurrentSubsChart: false })}
                    block
                    color="primary"
                  >
                    Hide Graph
                  </Button>
                ) : (
                  <Button
                    onClick={() => this.setState({ showCurrentSubsChart: true })}
                    block
                    color="success"
                  >
                    Show Graph
                  </Button>
                )}
                <div>
                  {this.state.showCurrentSubsChart ? (
                    <Pie
                      data={this.state.subTypeData}
                      width={100}
                      height={400}
                      options={{ maintainAspectRatio: false }}
                    />
                  ) : null}
                </div>
              </Card>
              <Card>
                <div className="card-header">
                  <div className="card-title">
                    <h3>Monthly Subscription Type Distribution</h3>
                  </div>
                </div>
                {this.state.showMonthlySubChart ? (
                  <Button
                    onClick={() => this.setState({ showMonthlySubChart: false })}
                    block
                    color="primary"
                  >
                    Hide Graph
                  </Button>
                ) : (
                  <Button
                    onClick={() => this.setState({ showMonthlySubChart: true })}
                    block
                    color="success"
                  >
                    Show Graph
                  </Button>
                )}
                <div>
                  {this.state.showMonthlySubChart ? (
                    <Bar
                      data={this.state.monthlySubTypeData}
                      width={100}
                      height={400}
                      options={this.state.percentOptions}
                    />
                  ) : null}
                </div>
              </Card>
              <Card>
                <div className="card-header">
                  <div className="card-title">
                    <h3>New and Cancelled Subscriptions this Month</h3>
                  </div>
                </div>
                {this.state.showCurrentNewSubs ? (
                  <Button
                    onClick={() => this.setState({ showCurrentNewSubs: false })}
                    block
                    color="primary"
                  >
                    Hide Graph
                  </Button>
                ) : (
                  <Button
                    onClick={() => this.setState({ showCurrentNewSubs: true })}
                    block
                    color="success"
                  >
                    Show Graph
                  </Button>
                )}
                <div>
                  {this.state.showCurrentNewSubs ? (
                    <Bar
                      data={this.state.newSubsData}
                      width={100}
                      height={400}
                      options={{ maintainAspectRatio: false }}
                    />
                  ) : null}
                </div>
              </Card>
              <Card>
                <div className="card-header">
                  <div className="card-title">
                    <h3>Monthly New and Cancelled Subscriptions</h3>
                  </div>
                </div>
                {this.state.showNewSubBar ? (
                  <Button
                    onClick={() => this.setState({ showNewSubBar: false })}
                    block
                    color="primary"
                  >
                    Hide Graph
                  </Button>
                ) : (
                  <Button
                    onClick={() => this.setState({ showNewSubBar: true })}
                    block
                    color="success"
                  >
                    Show Graph
                  </Button>
                )}
                <div>
                  {this.state.showNewSubBar ? (
                    <Bar
                      data={this.state.monthlyNewSubData}
                      width={100}
                      height={400}
                      options={{ maintainAspectRatio: false }}
                    />
                  ) : null}
                </div>
              </Card>
              <Card>
                <Button color="primary" onClick={this.backToHomePage}>
                  Back
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default TenantAgencyMetrics;
