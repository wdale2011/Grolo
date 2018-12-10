import React from "react";
import { Alert } from "reactstrap";

//Takes color as a STRING prop. Takes reactstrap colors (success, info, danger, ect.) or regular ones ("red", "#ffffff")

const SearchError = props => {
  return (
    <div>
      <Alert color={props.color}>No search results found</Alert>
    </div>
  );
};
export default SearchError;
