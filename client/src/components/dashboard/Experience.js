import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import { deleteExperience } from "../../actions/profileActions";

class Experience extends Component {
  onDelete(id) {
    this.props.deleteEducation(id);
  }
  render() {
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="DD/MM/YYYY">{exp.from}</Moment>
          {" - "}
          {exp.to === null ? (
            "Now"
          ) : (
            <Moment format="DD/MM/YYYY">{exp.to}</Moment>
          )}
        </td>
        <td>
          <button
            onClick={this.onDelete.bind(this, exp._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Experience</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th />
            </tr>
            {experience}
          </thead>
        </table>
      </div>
    );
  }
}

Experience.propTypes = {
  deleteEducation: PropTypes.func.isRequired
};

export default connect(null, { deleteExperience })(Experience);
