import React from "react";
import { connect } from "react-redux";
import { FormGroup, Card, Table, Button, Input } from "reactstrap";
import Paginator from "../../shared/Paginator";
import SearchFailure from "./CustomerAlerts/SearchFailure";
import CustomerDeleted from "./CustomerAlerts/CustomerDeleted";
import {
  getCustomerListCall,
  searchForCustomerCall,
  deleteCall,
  getBusinessListCall
} from "./CustomerService";
import CustomerLoading from "./CustomerAlerts/CustomerLoading";
import CustomerDeleteModal from "./CustomerAlerts/CustomerDeleteModal";
import "../../shared/Spinner.css";

class DisplayAllCustomers extends React.Component {
  state = {
    //Mapped Arrays
    businessList: [],
    customerList: [],
    searchResults: [],
    updateInfo: [],
    //For re-direct
    oldUrl: [""],
    //For search functions
    pageIndex: 0,
    pageSize: 1,
    totalPages: 0,
    totalCount: 0,
    searchString: "",
    businessId: "",
    //For customer table display
    currentBusiness: "",
    //For no search results alert
    noResults: false,
    //For delete customer alert
    deleted: false,
    deleteId: "",
    deleteFirstName: "",
    deleteLastName: "",
    deleteLastFour: "",
    //Loading Stuff
    searching: false,
    deleting: false,
    loading: false,
    pageLoad: true,
    modal: false,
    useModal: false,
    deleteConfirmed: false
  };

  inputHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.getBusinessList();
    this.setState({ currentBusiness: this.state.businessId });
  };

  //Modal functions
  showModal = (show, id, firstName, lastName, lastFour) => {
    this.setState({
      modal: show,
      deleteId: id,
      deleteFirstName: firstName,
      deleteLastName: lastName,
      deleteLastFour: lastFour
    });
  };

  useModal = () => {
    this.setState({ useModal: true });
  };

  onCancel = () => {
    this.setState({ modal: false, deleteConfirmed: false, deleteId: "" });
  };

  onSave = () => {
    this.setState({ modal: false, deleteConfirmed: true });
    this.deleteHandler(this.state.deleteId);
  };

  getBusinessList = () => {
    getBusinessListCall()
      .then(Response => {
        const objArray = Response.data.item.pagedItems;
        this.setState({ businessList: objArray, pageLoad: false });
      })
      .catch(Response => {
        console.log(Response);
      });
  };

  //Get list of customers
  getCustomerList = (pageIndex, deleteParam) => {
    const pageSize = 5;
    const businessId = this.businessIdHandler(deleteParam);
    const req = {
      pageIndex: pageIndex,
      pageSize: 5,
      businessId: this.props.currentBusiness
    };
    getCustomerListCall(req)
      .then(response => {
        const totalCount = response.data.item.totalCount;
        const customerList = response.data.item.pagedItems;
        const totalPages = Math.ceil(totalCount / pageSize);
        this.setState({
          customerList: customerList,
          totalCount: totalCount,
          totalPages: totalPages
        });
        if (deleteParam !== true) {
          this.setState({ currentBusiness: this.state.businessId });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  businessIdHandler = deleteParam => {
    if (deleteParam !== true) {
      return this.state.businessId.replace(/[^0-9]/g, "");
    } else {
      return this.state.currentBusiness.replace(/[^0-9]/g, "");
    }
  };

  goToPage = pageIndex => {
    this.setState(
      prev => ({ pageIndex }),
      () => {
        this.searchForCustomer(this.state.pageIndex);
      }
    );
  };

  //Search for individual customers  *Find a way to compare string to multiple SQL strings*
  searchForCustomer = pageIndex => {
    const pageSize = 5;
    const req = {
      pageIndex: pageIndex,
      pageSize: 5,
      searchString: this.state.searchString.trim(),
      businessId: this.props.currentBusiness
    };
    searchForCustomerCall(req)
      .then(Response => {
        if (Response.data.item.totalCount === 0) {
          this.setState({
            customerList: [],
            noResults: true,
            currentBusiness: this.props.currentBusiness,
            deleted: false,
            searching: false,
            loading: false
          });
        } else {
          const customerList = Response.data.item.pagedItems;
          const totalCount = Response.data.item.totalCount;
          const totalPages = Math.ceil(totalCount / pageSize);
          this.setState({
            customerList: customerList,
            totalCount: totalCount,
            totalPages: totalPages,
            noResults: false,
            currentBusiness: this.state.businessId,
            deleted: false,
            searching: false,
            loading: false
          });
        }
      })
      .catch(Error => {
        console.log(Error);
        this.setState({ searching: false, loading: false, customerList: [], currentBusiness: "" });
      });
  };

  searchHandler = () => {
    if (this.state.loading === false) {
      this.setState({ searching: true, noResults: false, deleted: false, loading: true });
      setTimeout(
        function() {
          this.searchForCustomer(0);
        }.bind(this),
        1000
      );
    }
  };

  createHandler = e => {
    const prefix = this.props.match.path;
    this.props.history.push(prefix + "/create");
  };

  updateHandler = customerId => {
    const prefix = this.props.match.path;
    this.props.history.push(prefix + "/" + customerId);
  };

  deleteConfirmation = (customerId, customerFirst, customerLast, lastFour) => {
    this.showModal(customerId, customerFirst, customerLast, lastFour);
  };

  deleteHandler = customerId => {
    if (this.state.loading === false) {
      this.setState({
        loading: true,
        deleting: true,
        delete: false
      });
      setTimeout(
        function() {
          this.deleteCustomer(customerId);
        }.bind(this),
        3000
      );
    }
  };

  deleteCustomer = customerId => {
    deleteCall(customerId)
      .then(Response => {
        console.log(Response);
        let deleteParam = true;
        this.setState({ loading: false, deleting: false, deleted: true });
        this.getCustomerList(this.state.pageIndex, deleteParam);
      })
      .catch(Response => {
        this.setState({ loading: false, deleting: false });
        console.log(Response);
      });
  };

  render() {
    const customerList = this.state.customerList;
    return (
      <div>
        {this.state.pageLoad === true ? (
          <CustomerLoading style={{ justifyContent: "center" }} />
        ) : null}
        {this.state.pageLoad === true ? null : (
          <div className="container-fluid">
            <CustomerDeleteModal
              modal={this.state.modal}
              toggle={b => this.showModal(false)}
              onCancel={this.onCancel}
              onSave={this.onSave}
              id={this.state.deleteId}
              firstName={this.state.deleteFirstName}
              lastName={this.state.deleteLastName}
              lastFour={this.state.deleteLastFour}
            />
            <Card className="row col-xs-12 box-shadow-2 px-4 py-4">
              <h2>Customer Search</h2>
              <br />
              <div>
                <h5>Search</h5>
                <FormGroup>
                  <Input
                    name="searchString"
                    type="text"
                    value={this.state.searchString}
                    onChange={this.inputHandler}
                  />
                  <br />
                  {this.state.searching ? (
                    <div className="_miSpinnerL" />
                  ) : (
                    <Button
                      className="box-shadow-2"
                      block
                      color="primary"
                      onClick={this.searchHandler}
                    >
                      Search
                    </Button>
                  )}
                </FormGroup>
              </div>
            </Card>
            <div>
              <div className="row">
                <div>
                  <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                    <div className="card-header">
                      <div className="card-title-wrap bar-info">
                        <h4 className="card-title">
                          List of {this.state.currentBusiness} Customers:
                        </h4>
                        <br />
                        {this.state.searching ? <div className="_miSpinnerL" /> : null}
                        {this.state.deleting ? <div className="_miSpinnerL" /> : null}
                        <br />
                        {this.state.noResults ? <SearchFailure /> : null}
                        {this.state.deleted ? (
                          <CustomerDeleted
                            id={this.state.deleteId}
                            firstName={this.state.deleteFirstName}
                            lastName={this.state.deleteLastName}
                            lastFour={this.state.deleteLastFour}
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="card-body collapse show">
                      <div className="card-block card-dashboard">
                        <Table className="table table-striped table-boardered multi-ordering">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>Address</th>
                              <th>Phone Number</th>
                              <th>Email</th>
                              <th>Credits Available</th>
                              <th>Total Credits Used</th>
                              {/* <th>Modify Customer</th> */}{" "}
                              {/*Update the SQL stored procedures and axios code for DELETE and Edit functionalities*/}
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.searching
                              ? null
                              : customerList.map((customerList, index) => (
                                  <tr
                                    key={index}
                                    style={
                                      this.state.deleteId === customerList.id
                                        ? { background: "#ff5558" }
                                        : null
                                    }
                                  >
                                    <td>{customerList.id}</td>
                                    <td>{customerList.firstName}</td>
                                    <td>{customerList.lastName}</td>
                                    <td>
                                      {customerList.street}, {customerList.city},{" "}
                                      {customerList.state}, {customerList.zip}
                                    </td>
                                    <td>{customerList.phoneNumber}</td>
                                    <td>{customerList.email}</td>
                                    <td>{customerList.creditsAvailable}</td>
                                    <td>{customerList.totalCreditsUsed}</td>
                                    <td>
                                      {/* {this.state.deleting ? (
                                        <div className="_miSpinnerM" />
                                      ) : (
                                        <Button
                                          className="box-shadow-2"
                                          color="primary"
                                          size="md"
                                          onClick={e => this.updateHandler(customerList.id)}
                                          block
                                        >
                                          Edit
                                        </Button>
                                      )} */}
                                      {/* {this.state.deleting ? (
                                        <div className="_miSpinnerM" />
                                      ) : (
                                        <Button
                                          className="box-shadow-2"
                                          color="danger"
                                          size="md"
                                          onClick={e =>
                                            this.showModal(
                                              true,
                                              customerList.id,
                                              customerList.firstName,
                                              customerList.lastName
                                            )
                                          }
                                          block
                                        >
                                          Delete
                                        </Button>
                                      )} */}
                                    </td>
                                  </tr>
                                ))}
                          </tbody>
                        </Table>
                        <Paginator
                          totalPages={this.state.totalPages}
                          currentPage={this.state.pageIndex}
                          totalCount={this.state.totalCount}
                          goTo={this.goToPage}
                          style={{ marginTop: "16px" }}
                          className="m-2"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    currentBusiness: state.currentBusiness,
    user: state.user
  };
}

export default connect(mapStateToProps)(DisplayAllCustomers);
