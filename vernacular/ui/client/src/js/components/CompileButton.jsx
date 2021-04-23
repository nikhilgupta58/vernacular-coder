import React, { PureComponent } from 'react';

export default class CompileButton extends PureComponent {
  render() {
    return (
      <button onClick={() => this.props.onClick()}>Compile</button>
    );
  }
}
