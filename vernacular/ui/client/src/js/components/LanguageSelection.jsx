import React, { PureComponent } from 'react';

export default class LanguageSelection extends PureComponent {
  render() {
    return (
      <div className="language-input">
        <p>Sample code in:</p>
        <select onChange={this.props.onChange}>
          <option value="none">Select</option>
          <option value="hi">हिन्दी</option>
          <option value="es">Español</option>
          <option value="vn">Tiếng Việt</option>
        </select>
      </div>
    );
  }
}
