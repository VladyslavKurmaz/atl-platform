import React from 'react';

export default class Footer extends React.Component {
  render() {
    return (
      <footer className="mt-auto bg-light pb-2 text-right">
        <small className="text-secondary pr-2">{this.props.version}</small>
      </footer>
    );
  }
}
