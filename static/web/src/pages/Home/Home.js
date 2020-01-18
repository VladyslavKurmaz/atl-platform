import React from 'react';
import './Home.css';

export default class Home extends React.Component {
  render() {
    return (
      <div className="jumbotron bg-light border-0 rounded-0 pb-4 mb-0" style={{height: '50%'}}>
        <div className="container-fluid">
          <div className="row">
            <div className="offset-sm-2 col-sm-8">
              <p className="pb-4">
                Ready to use react template with navbar, sticky footer and simple routing.
                Skeleton contains SonarQube configuration file, Jenkinsfile for PR/PUSH builds,
                Dockerfile for quick start with Nginx.
              </p>
            </div>
          </div>
          <div className="row">
aaa
          </div>
        </div>
      </div>
    );
  }
}