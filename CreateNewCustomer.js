import React from "react";
import CreateSuccess from "./CustomerAlerts/CreateSuccess";
import CreateFailure from "./CustomerAlerts/CreateFailure";
import UpdateSuccess from "./CustomerAlerts/UpdateSuccess";
import UpdateFailure from "./CustomerAlerts/UpdateFailure";
import CustomerLoading from "./CustomerAlerts/CustomerLoading";
import { connect } from "react-redux";
import { Button, Form, FormGroup, FormFeedback, Input, Label } from "reactstrap";
import {
  addCustomerCall,
  editData,
  updateCustomerCall,
  getBusinessListCall
} from "./CustomerService";
import LoadCircleGreen from "./CustomerAlerts/CustomerLoaderGreen";
import LoadCircleRed from "./CustomerAlerts/CustomerLoaderRed";

class CreateNewCustomer extends React.Component {
  state = {
    //Inputs
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phoneNumber: "",
    email: "",
    businessId: "",
    businessList: [],
    //Alerts
    editMode: false,
    alertSuccess: false,
    alertFailure: false,
    updateSuccess: false,
    updateFailure: false,
    showModal: false,
    submit: false,
    clear: false,
    loading: false,
    pageLoad: true,
    //Validation
    firstNameInvalid: false,
    lastNameInvalid: false,
    streetInvalid: false,
    cityInvalid: false,
    stateInvalid: false,
    zipInvalid: false,
    phoneNumberInvalid: false,
    emailInvalid: false,
    businessIdInvalid: false,
    //Error Messages
    firstNameMessage: "Please enter a first name",
    lastNameMessage: "Please enter a last name",
    zipMessage: "Please enter a zip code",
    emailMessage: "Please enter an email address",
    phoneNumberMessage: "Please enter a phone number",
    streetMessage: "Please enter a street address"
  };

  inputHandler = e => {
    const regexName = /(^[a-zA-Z-]*$)/; //Only letters and '-'s
    const regexStreet = /^[a-zA-Z0-9\s.,;#-&]*$/; // Only letters, numbers, and limited special characters
    const regexCity = /^[a-zA-Z\s-]*$/; //Only letters, spaces, and dashes
    const regexZip = /^[0-9\s-+]*$/; //Only numbers, spaces, and dashes
    const regexPhone = /^[0-9()\-+]*$/; //Only numbers, (), dashes, and +
    const regexEmail = /^\S*$/; //No spaces allowed
    switch (e.target.name) {
      case "firstName":
        if (e.target.value === "" || regexName.test(e.target.value)) {
          this.setState({ firstName: e.target.value });
        }
        break;

      case "lastName":
        if (e.target.value === "" || regexName.test(e.target.value)) {
          this.setState({ lastName: e.target.value });
        }
        break;

      case "street":
        if (e.target.value === "" || regexStreet.test(e.target.value)) {
          this.setState({ street: e.target.value });
        }
        break;

      case "city":
        if (e.target.value === "" || regexCity.test(e.target.value)) {
          this.setState({ city: e.target.value });
        }
        break;

      case "zip":
        if (e.target.value === "" || regexZip.test(e.target.value)) {
          this.setState({ zip: e.target.value });
        }
        break;

      case "phoneNumber":
        if (e.target.value === "" || regexPhone.test(e.target.value)) {
          this.setState({
            phoneNumber: e.target.value
          });
        }
        break;

      case "email":
        if (e.target.value === "" || regexEmail.test(e.target.value)) {
          this.setState({
            email: e.target.value
          });
        }
        break;

      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  invalidHandler = e => {
    const nameOfstate = e.target.name + "Invalid";
    if (e.target.value === undefined) {
      this.setState({ [nameOfstate]: true });
    } else {
      this.setState({ [nameOfstate]: false });
    }
  };

  validationErrorHandler = e => {
    let totalErrors = 0;
    if (this.firstNameValidation() === false) {
      totalErrors = totalErrors + 1;
    }
    if (this.lastNameValidation() === false) {
      totalErrors = totalErrors + 1;
    }

    if (this.phoneNumberValidation() === false) {
      totalErrors = totalErrors + 1;
    }
    if (this.emailValidation() === false) {
      totalErrors = totalErrors + 1;
    }
    if (this.streetValidation() === false) {
      totalErrors = totalErrors + 1;
    }
    if (this.cityValidation() === false) {
      totalErrors = totalErrors + 1;
    }
    if (this.stateValidation() === false) {
      totalErrors = totalErrors + 1;
    }
    if (this.zipValidation() === false) {
      totalErrors = totalErrors + 1;
    }
    if (this.businessIdValidation() === false) {
      totalErrors = totalErrors + 1;
    }
    return totalErrors;
  };

  firstNameValidation = e => {
    const regexDashes = /([-])\1+/;
    if (this.state.firstName === "") {
      this.setState({ firstNameInvalid: true, firstNameMessage: "Please enter a first name" });
      return false;
    } else if (regexDashes.test(this.state.firstName)) {
      this.setState({
        firstNameInvalid: true,
        firstNameMessage: "Cannot contain consecutive '-'s"
      });
      return false;
    } else {
      return true;
    }
  };
  lastNameValidation = e => {
    const regexDashes = /([-])\1+/;
    if (this.state.lastName === "") {
      this.setState({ lastNameInvalid: true, lastNameMessage: "Please enter a last name" });
      return false;
    } else if (regexDashes.test(this.state.lastName)) {
      this.setState({ lastNameInvalid: true, lastNameMessage: "Cannot contain consecutive '-'s" });
      return false;
    } else {
      return true;
    }
  };
  phoneNumberValidation = e => {
    const phoneRegexFormat = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    if (this.state.phoneNumber === "") {
      this.setState({
        phoneNumberInvalid: true,
        phoneNumberMessage: "Please enter a phone number"
      });
      return false;
    } else if (!phoneRegexFormat.test(this.state.phoneNumber)) {
      this.setState({ phoneNumberInvalid: true, phoneNumberMessage: "Phone number is invalid" });
      return false;
    } else {
      return true;
    }
  };
  emailValidation = e => {
    const regexEmail2 = /@/;
    if (this.state.email === "") {
      this.setState({ emailInvalid: true, emailMessage: "Please enter an email address" });
      return false;
    } else if (!regexEmail2.test(this.state.email)) {
      this.setState({ emailInvalid: true, emailMessage: "Email address must include an '@'" });
      return false;
    } else {
      return true;
    }
  };
  streetValidation = e => {
    const regexStreet2 = /([0-9]{1,}\s[a-zA-Z]{1,})|([a-zA-Z]{1,}\s[0-9]{1,})/;
    if (this.state.street === "") {
      this.setState({ streetInvalid: true, streetMessage: "Please enter a street address" });
      return false;
    } else if (!regexStreet2.test(this.state.street)) {
      this.setState({
        streetInvalid: true,
        streetMessage: "Street address needs numbers and letters with appropriate spacing"
      });
      return false;
    } else {
      return true;
    }
  };
  cityValidation = e => {
    if (this.state.city === "") {
      this.setState({ cityInvalid: true });
      return false;
    } else {
      return true;
    }
  };
  stateValidation = e => {
    if (this.state.state === "") {
      this.setState({ stateInvalid: true });
      return false;
    } else {
      return true;
    }
  };
  zipValidation = e => {
    const regexZipFormat = /^\d{5}(?:[+-\s]\d{4})?$/;
    if (this.state.zip === "") {
      this.setState({ zipInvalid: true, zipMessage: "Please enter a zip code" });
      return false;
    } else if (this.state.zip.toString().length < 5) {
      this.setState({ zipInvalid: true, zipMessage: "Must contain at least 5 numbers" });
      return false;
    } else if (!regexZipFormat.test(this.state.zip)) {
      this.setState({
        zipInvalid: true,
        zipMessage: "Zip code must be five digits|  or  |five + 4 seperated by space, -, or +"
      });
      return false;
    } else {
      return true;
    }
  };

  businessIdValidation = e => {
    if (this.state.businessId === "") {
      this.setState({ businessIdInvalid: true });
      return false;
    } else {
      return true;
    }
  };

  clearForm = () => {
    this.setState({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      businessId: "",
      loading: false,
      clear: false
    });
  };

  redirectBack = e => {
    this.props.history.push("/admin/customer");
  };

  showLoader = e => {
    this.setState({ showModal: true });
  };

  hideLoader = e => {
    this.setState({ showModal: false });
  };

  addCustomerHandler = e => {
    if (this.state.loading === false) {
      this.setState({ submit: true, loading: true });
      setTimeout(
        function() {
          this.addCustomer();
        }.bind(this),
        100
      );
    }
  };

  clearFormHandler = e => {
    if (this.state.loading === false) {
      this.setState({ clear: true, loading: true });
      setTimeout(
        function() {
          this.clearForm();
        }.bind(this),
        500
      );
    }
  };

  //Create new customer in database
  addCustomer = e => {
    let totalErrors = this.validationErrorHandler();
    if (totalErrors === 0) {
      //Remove double spaces
      let firstName = this.state.firstName.replace(/ +(?= )/g, "");
      let lastName = this.state.lastName.replace(/ +(?= )/g, "");
      let street = this.state.street.replace(/ +(?= )/g, "");
      let city = this.state.city.replace(/ +(?= )/g, "");
      let state = this.state.state.replace(/ +(?= )/g, "");
      let zip = this.state.zip.replace(/ +(?= )/g, "");
      let phoneNumber = this.state.phoneNumber.replace(/ +(?= )/g, "");
      let email = this.state.email.replace(/ +(?= )/g, "");
      let businessId = this.props.currentBusiness;
      //Removes spaces from email
      let email2 = email.replace(/ /g, "");
      //Trims off extra whitespace from the end
      let firstNameTrimmed = firstName.trim();
      let lastNameTrimmed = lastName.trim();
      let streetTrimmed = street.trim();
      let cityTrimmed = city.trim();
      let stateTrimmed = state.trim();
      let zipTrimmed = zip.trim();
      let phoneNumberTrimmed = phoneNumber.trim();
      let emailTrimmed = email2.trim();
      let businessIdTrimmed = this.props.currentBusiness;

      const req = {
        firstName: firstNameTrimmed,
        lastName: lastNameTrimmed,
        street: streetTrimmed,
        city: cityTrimmed,
        state: stateTrimmed,
        zip: zipTrimmed,
        phoneNumber: phoneNumberTrimmed,
        email: emailTrimmed,
        customerBusinessId: businessIdTrimmed
      };
      addCustomerCall(req)
        .then(Response => {
          console.log(Response);
          this.clearForm();
          this.setState({
            loading: false,
            submit: false,
            alertFailure: false,
            alertSuccess: true
          });
          window.scrollTo(0, 0);
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false, submit: false, alertSuccess: false, alertFailure: true });
          window.scrollTo(0, 0);
        });
    } else {
      this.setState({ loading: false, submit: false, alertSuccess: false, alertFailure: true });
      window.scroll(0, 0);
    }
  };
  //Fill in form from edit button
  componentDidMount = () => {
    window.scrollTo(0, 0);
    const { customerId } = this.props.match.params;
    this.getBusinessList();
    if (customerId !== undefined) {
      editData(customerId)
        .then(Data => {
          let firstName = Data.data.item.firstName.trim();
          let lastName = Data.data.item.lastName.trim();
          let street = Data.data.item.street.trim();
          let city = Data.data.item.city.trim();
          let state = Data.data.item.state.trim();
          let zip = Data.data.item.zip.trim();
          let phoneNumber = Data.data.item.phoneNumber.trim();
          let email = Data.data.item.email.trim();

          let business = Data.data.item.customerBusinessId; //Get ID Number
          let array = this.state.businessList; //Get the array
          let arrayIndex = array.map(list => list.id).indexOf(business); //Match ID Number
          let arrayName = "";

          let fullBusiness = business + " " + arrayName;

          this.setState({
            firstName: firstName,
            lastName: lastName,
            street: street,
            city: city,
            state: state,
            zip: zip,
            phoneNumber: phoneNumber,
            email: email,
            customerBusinessId: fullBusiness,
            editMode: true,
            pageLoad: false
          });
        })
        .catch(Response => {
          console.log(Response);
          this.setState({ pageLoad: false });
        });
    } else {
      this.setState({ pageLoad: false });
    }
  };
  //Updates the customer information in database
  updateCustomer = e => {
    let totalErrors = this.validationErrorHandler();
    const { customerId } = this.props.match.params;
    if (customerId !== undefined && totalErrors === 0) {
      //Removes double spacing
      let firstName = this.state.firstName.replace(/ +(?= )/g, "");
      let lastName = this.state.lastName.replace(/ +(?= )/g, "");
      let street = this.state.street.replace(/ +(?= )/g, "");
      let city = this.state.city.replace(/ +(?= )/g, "");
      let state = this.state.state.replace(/ +(?= )/g, "");
      let zip = this.state.zip.replace(/ +(?= )/g, "");
      let phoneNumber = this.state.phoneNumber.replace(/ +(?= )/g, "");
      let email = this.state.email.replace(/ +(?= )/g, "");
      let businessId = this.props.currentBusiness;
      //Removes all spacing
      let email2 = email.replace(/ /g, "");
      //Removes spacing at the end
      let firstNameTrimmed = firstName.trim();
      let lastNameTrimmed = lastName.trim();
      let streetTrimmed = street.trim();
      let cityTrimmed = city.trim();
      let stateTrimmed = state.trim();
      let zipTrimmed = zip.trim();
      let phoneNumberTrimmed = phoneNumber.trim();
      let emailTrimmed = email2.trim();
      let businessIdTrimmed = this.props.currentBusiness;
      const req = {
        id: customerId,
        firstName: firstNameTrimmed,
        lastName: lastNameTrimmed,
        street: streetTrimmed,
        city: cityTrimmed,
        state: stateTrimmed,
        zip: zipTrimmed,
        phoneNumber: phoneNumberTrimmed,
        email: emailTrimmed,
        businessId: businessIdTrimmed
      };
      updateCustomerCall(req)
        .then(Response => {
          console.log(Response);
          this.setState({ updateFailure: false });
          this.setState({ updateSuccess: true });
          window.scrollTo(0, 0);
        })
        .catch(Response => {
          console.log(Response);
          this.setState({ updateSuccess: false });
          this.setState({ updateFailure: true });
          window.scrollTo(0, 0);
        });
    }
  };

  getBusinessList = () => {
    getBusinessListCall()
      .then(Response => {
        console.log(Response.data.item.pagedItems);
        const objArray = Response.data.item.pagedItems;
        this.setState({ businessList: objArray });
      })
      .catch(Response => {
        console.log(Response.data.item.pagedItems);
      });
  };

  makeDropdown = x => {
    return <option>{x}</option>;
  };

  render() {
    const listOfStates = [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY",
      "American Samoa -AS",
      "DC",
      "Federated States of Micronesia -FM",
      "Guam -GU",
      "Marshall Islands -MH",
      "Northern Mariana Islands -MP",
      "Palau -PW",
      "Puerto Rico -PR",
      "Virgin Islands -VI"
    ];
    return (
      <div>
        {this.state.pageLoad ? (
          <CustomerLoading />
        ) : (
          <div>
            <div>{this.state.alertSuccess ? <CreateSuccess /> : null}</div>
            <div>{this.state.alertFailure ? <CreateFailure /> : null}</div>
            <div>{this.state.updateSuccess ? <UpdateSuccess /> : null}</div>
            <div>{this.state.updateFailure ? <UpdateFailure /> : null}</div>
            <div className="container-fluid" style={{ backgroundColor: "#04b9b6" }}>
              <div className="col row">
                <h1
                  className="content-header text-center col-md-12"
                  style={{ color: "white", fontSize: "250%" }}
                >
                  {this.state.editMode ? "Update" : "Add"} Customer
                </h1>
                <div className="col row">
                  <div className="card-header text-center col-md-6">
                    <div className="card px-4 py-8 box-shadow-4">
                      <br />
                      <div className="card-body">
                        <h2 className="card-title">Profile Information</h2>
                        <Form>
                          <FormGroup>
                            <div>
                              <Label for="firstName">First Name</Label>
                              <Input
                                invalid={this.state.firstNameInvalid}
                                type="text"
                                name="firstName"
                                label="First Name"
                                maxLength="50"
                                value={this.state.firstName}
                                onChange={this.inputHandler}
                                onBlur={this.invalidHandler}
                              />
                              <FormFeedback>{this.state.firstNameMessage}</FormFeedback>
                            </div>
                          </FormGroup>
                          <FormGroup>
                            <div>
                              <Label for="lastName">Last Name</Label>
                              <Input
                                invalid={this.state.lastNameInvalid}
                                type="text"
                                name="lastName"
                                label="Last Name"
                                maxLength="50"
                                value={this.state.lastName}
                                onChange={this.inputHandler}
                                onBlur={this.invalidHandler}
                              />
                              <FormFeedback>{this.state.lastNameMessage}</FormFeedback>
                            </div>
                          </FormGroup>
                          <FormGroup />
                        </Form>
                      </div>
                      <div />
                    </div>
                  </div>
                  <div className="card-header text-center col-md-6">
                    <div className="card px-4 py-4 box-shadow-4">
                      <h2 className="card-title">Contact Information</h2>
                      <Form>
                        <FormGroup>
                          <Label for="street">Street Address</Label>
                          <Input
                            invalid={this.state.streetInvalid}
                            type="text"
                            name="street"
                            label="street"
                            maxLength="100"
                            value={this.state.street}
                            onChange={this.inputHandler}
                            onBlur={this.invalidHandler}
                          />
                          <FormFeedback>{this.state.streetMessage}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                          <Label for="city">City</Label>
                          <Input
                            invalid={this.state.cityInvalid}
                            type="text"
                            name="city"
                            label="city"
                            maxLength="50"
                            value={this.state.city}
                            onChange={this.inputHandler}
                            onBlur={this.invalidHandler}
                          />
                          <FormFeedback>Please enter a city</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                          <Label for="state">State</Label>
                          <Input
                            invalid={this.state.stateInvalid}
                            type="select"
                            name="state"
                            label="state"
                            value={this.state.state}
                            onChange={this.inputHandler}
                            onBlur={this.invalidHandler}
                          >
                            <option>Select a state</option>
                            {listOfStates.map((state, index) => (
                              <option key={index}>{state}</option>
                            ))}
                          </Input>
                          <FormFeedback>Please select a state for the address</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                          <Label for="zip">Zip</Label>
                          <Input
                            invalid={this.state.zipInvalid}
                            type="text"
                            name="zip"
                            value={this.state.zip}
                            onChange={this.inputHandler}
                            onBlur={this.invalidHandler}
                            maxLength="10"
                          />
                          <FormFeedback>{this.state.zipMessage}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                          <Label for="phoneNumber">Phone Number</Label>
                          <Input
                            invalid={this.state.phoneNumberInvalid}
                            type="text"
                            name="phoneNumber"
                            value={this.state.phoneNumber}
                            onChange={this.inputHandler}
                            onBlur={this.invalidHandler}
                            maxLength="20"
                          />
                          <FormFeedback>{this.state.phoneNumberMessage}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                          <Label for="email">Email</Label>
                          <Input
                            invalid={this.state.emailInvalid}
                            type="email"
                            name="email"
                            value={this.state.email}
                            onChange={this.inputHandler}
                            onBlur={this.invalidHandler}
                            maxLength="100"
                          />
                          <FormFeedback>{this.state.emailMessage}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                          {this.state.submit ? (
                            <LoadCircleGreen />
                          ) : (
                            <Button
                              className="box-shadow-2"
                              onClick={
                                this.state.editMode ? this.updateCustomer : this.addCustomerHandler
                              }
                              color="success"
                              size="lg"
                              block
                            >
                              {this.state.editMode ? "Update" : "Create"}
                            </Button>
                          )}
                        </FormGroup>
                        <FormGroup>
                          {this.state.clear ? (
                            <LoadCircleRed />
                          ) : (
                            <Button
                              className="box-shadow-2"
                              onClick={this.clearFormHandler}
                              color="danger"
                              size="lg"
                              block
                            >
                              Clear
                            </Button>
                          )}
                        </FormGroup>
                        <FormGroup>
                          <div>
                            <Button
                              className="box-shadow-2"
                              onClick={this.redirectBack}
                              color="primary"
                              size="lg"
                              block
                            >
                              Back
                            </Button>
                          </div>
                        </FormGroup>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div />
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

export default connect(mapStateToProps)(CreateNewCustomer);
