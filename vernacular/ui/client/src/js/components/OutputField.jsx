import React, { PureComponent } from 'react';

export default class OutputField extends PureComponent {
  render() {
    return (
      <textarea
          className="output-field"
          rows="20"
          cols="200"
          disabled
          value={this.props.outputText} />
    );
  }
}
