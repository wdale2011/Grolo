import React from "react";
import { connect } from "react-redux";
import { Card, Input, Label, Button, FormGroup, FormFeedback } from "reactstrap";
import ImageUploader from "../../shared/ImageUploader";
import LoadScreen from "../../shared/LoadScreen";
import { getTenantById, updateTenant } from "../../services/tenant.service";
import { NotificationManager } from "react-notifications";
import "../../shared/Spinner.css";

class TenantAgencyEdit extends React.Component {
  state = {
    id: "",
    ownerId: "",
    appUserIdLocal: "",
    companyName: "",
    websiteUrl: "",
    description: "",
    imageUrl: "",
    pageLoading: false,
    submitLoading: false,
    //For validations
    companyNameInvalid: false,
    websiteUrlInvalid: false,
    descriptionInvalid: false
  };

  imageUploaderRef = React.createRef();

  componentDidMount = e => {
    this.getUpdateData();
  };

  backToHomePage = e => {
    this.props.history.push("/admin/tenantAgencyHomepage");
  };

  getUpdateData = () => {
    getTenantById(this.props.user.tenantId)
      .then(Response => {
        console.log(Response);
        this.setState({
          companyName: Response.data.item.companyName,
          websiteUrl: Response.data.item.websiteUrl,
          description: Response.data.item.description,
          imageUrl: Response.data.item.imageUrl,
          //For later UPDATE PUT
          id: Response.data.item.id,
          ownerId: Response.data.item.ownerId,
          appUserIdLocal: Response.data.item.appUserId,
          //End load screen
          pageLoading: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  updateAgencyHandler = e => {
    this.setState({ submitLoading: true });
    this.updateAgency();
  };

  invalidHandler = e => {
    const nameOfstate = e.target.name + "Invalid";
    if (e.target.value === "") {
      this.setState({ [nameOfstate]: true });
      console.log("I ran!");
    } else {
      this.setState({ [nameOfstate]: false });
      console.log("Didn't change nothin");
    }
  };

  updateAgency = () => {
    const req = {
      id: this.state.id,
      companyName: this.state.companyName,
      websiteURL: this.state.websiteUrl,
      ownerId: this.state.ownerId,
      description: this.state.description,
      appUserId: this.state.appUserIdLocal,
      imageUrl: this.state.imageUrl
    };
    updateTenant(req)
      .then(Response => {
        console.log(Response);
        this.setState({ submitLoading: false });
        NotificationManager.success("Successfully updated your profile!");
      })
      .catch(error => {
        console.log(error);
        this.setState({ submitLoading: false });
        NotificationManager.error("Cannot update your profile. Check the fields and try again.");
      });
  };

  inputHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div>
        {this.state.pageLoading ? (
          <LoadScreen />
        ) : (
          <div>
            <h1>Edit Agency Information</h1>
            <Card>
              <FormGroup>
                <Label>Agency Name</Label>
                <Input
                  type="text"
                  name="companyName"
                  value={this.state.companyName}
                  onChange={this.inputHandler}
                  onBlur={this.invalidHandler}
                  invalid={this.state.companyNameInvalid}
                />
                <FormFeedback>Please enter a name for your agency</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label>Website URL</Label>
                <Input
                  type="text"
                  name="websiteUrl"
                  value={this.state.websiteUrl}
                  onChange={this.inputHandler}
                  onBlur={this.invalidHandler}
                  invalid={this.state.websiteUrlInvalid}
                />
                <FormFeedback>Please enter a website Url for your agency</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label>Business Description</Label>
                <Input
                  type="textarea"
                  name="description"
                  value={this.state.description}
                  onChange={this.inputHandler}
                  onBlur={this.invalidHandler}
                  invalid={this.state.descriptionInvalid}
                />
                <FormFeedback>
                  Please enter a short description of your agency for clients
                </FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label>Business Profile Logo</Label>
                <br />
                <img src={this.state.imageUrl} alt="Your profile picture is loading..." />
                <br />
                <ImageUploader
                  ref={this.imageUploaderRef}
                  onComplete={url => this.setState({ imageUrl: url })}
                />
              </FormGroup>
              <FormGroup>
                {this.state.submitLoading ? (
                  <div className="_miSpinnerL" />
                ) : (
                  <Button color="success" onClick={this.updateAgencyHandler}>
                    Update Profile <icon className="fa fa-thumbs-o-up  mr-2" />
                  </Button>
                )}
              </FormGroup>
            </Card>
            <br />
            <Card>
              <Button color="primary" onClick={this.backToHomePage} block>
                Back
              </Button>
            </Card>
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

export default connect(mapStateToProps)(TenantAgencyEdit);
