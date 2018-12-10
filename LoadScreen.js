import React from "react";
import ReactLoading from "react-loading";

// Tie this component to State and use conditional rendering to show this loader instead of your page contents until everything is done loading.
// For example: {this.state.loading ? <LoadScreen /> : Everything Else You're Rendering}
class LoadScreen extends React.Component {
  render() {
    return (
      <div>
        <h1 className="text-center" style={{ color: "grey", fontSize: "300%" }}>
          Loading
        </h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ReactLoading type="bubbles" color="grey" height={"25%"} width={"25%"} />
        </div>
      </div>
    );
  }
}
export default LoadScreen;
