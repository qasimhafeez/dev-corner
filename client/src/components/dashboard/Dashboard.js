import React, { Component } from "react";
import { Link } from "react-router-dom";
// Connecting to Redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
// Load actions
import { getCurrentProfile } from "../../actions/profileActions";
// Import Spinner
import Spinner from "../common/Spinner";

class Dashboard extends Component {
  // Component lifecycle
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboadContent;
    if (profile === null || loading) {
      dashboadContent = <Spinner />;
    } else {
      // Check if user has profile
      if (Object.keys(profile).length > 0) {
        dashboadContent = <h4>Display Profile</h4>;
      } else {
        // User has no profile
        dashboadContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You don't have profile.</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboadContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
