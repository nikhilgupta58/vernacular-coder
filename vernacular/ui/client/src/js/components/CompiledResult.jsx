import React, { PureComponent } from 'react';

export default class CommpiledResult extends PureComponent {
  render() {
    return (
      <textarea
          className="output-field"
          rows="10"
          cols="100"
          disabled
          placeholder="There will be something here once you click Compile"
          value={this.props.compilationError
            ? this.props.compilationError
            : this.props.compiledResultText} />
    );
  }
}
