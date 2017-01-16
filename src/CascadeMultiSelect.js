/**
 * CascadeMultiSelect Component for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
const React = require('react');
class CascadeMultiSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>uxcore-cascade-multi-select component</div>
    );
  }
}

CascadeMultiSelect.defaultProps = {
};


// http://facebook.github.io/react/docs/reusable-components.html
CascadeMultiSelect.propTypes = {
};

CascadeMultiSelect.displayName = 'CascadeMultiSelect';

module.exports = CascadeMultiSelect;
