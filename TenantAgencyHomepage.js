import React from "react";
import { Route } from "react-router-dom";
import TenantDashboard from "./TenantDashboard";
import TenantAgencyReps from "./TenantAgencyReps";
import TenantAgencyClients from "./TenantAgencyClients";
import TenantAgencyMetrics from "./TenantAgencyMetrics";
import TenantAgencyEdit from "./TenantAgencyEdit";

function TenantAgencyHomepage(props) {
  const prefix = props.match.path;
  return (
    <React.Fragment>
      <Route exact path={prefix} component={TenantDashboard} />
      <Route exact path={prefix + "/AgencyReps"} component={TenantAgencyReps} />
      <Route exact path={prefix + "/ClientAccounts"} component={TenantAgencyClients} />
      <Route exact path={prefix + "/KeyMetrics"} component={TenantAgencyMetrics} />
      <Route exact path={prefix + "/AgencyEdit"} component={TenantAgencyEdit} />
    </React.Fragment>
  );
}

export default TenantAgencyHomepage;
