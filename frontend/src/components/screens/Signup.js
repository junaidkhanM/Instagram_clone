import React from "react";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formData: [] };
  }

  render() {
    return (
      <div className="mycard">
        <div className="row card auth-card">
          <h2>Instagram</h2>
          <form action="/signup" method="post" className="col s12">
            <div className="row">
              <div className="input-field col s6">
                <input
                  placeholder="First Name"
                  id="first_name"
                  type="text"
                  className="validate"
                />
              </div>
              <div className="input-field col s6">
                <input
                  placeholder="Last Name"
                  id="last_name"
                  type="text"
                  className="validate"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input
                  placeholder="email@email.com"
                  id="email"
                  type="email"
                  className="validate"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input
                  placeholder="password"
                  id="password"
                  type="password"
                  className="validate"
                />
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <button
                  className="btn-block btn waves-effect waves-light #2196f3 blue"
                  type="submit"
                  name="action"
                >
                  Submit
                  <i className="material-icons right">send</i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;
