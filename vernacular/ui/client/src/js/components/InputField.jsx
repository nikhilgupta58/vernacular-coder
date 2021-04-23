import React, { PureComponent } from 'react';

export default class InputField extends PureComponent {
  render() {
    return (
      <textarea rows="20" cols="200" placeholder="Type code here" onChange={this.props.onChange} value={this.props.inputText} />
    );
  }
}
