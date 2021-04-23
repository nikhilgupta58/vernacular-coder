import CompileButton from './js/components/CompileButton';
import CompiledResult from './js/components/CompiledResult';
import InputField from './js/components/InputField';
import LanguageSelection from './js/components/LanguageSelection';
import OutputField from './js/components/OutputField';

import code from './js/codeSamples.js';

import './App.css';

import React, { Component } from 'react';

class App extends Component {
    constructor(...args) {
    super(...args);

    this.state = {
      compiledResultText: '',
      compilationError: '',
      inputLang: '',
      inputText: '',
      outputText: 'Something will go here but you have to type it first.',
      response: ''
    };

    this.compileInput = this.compileInput.bind(this);
    this.updateInputText = this.updateInputText.bind(this);
    this.updateInputLanguage = this.updateInputLanguage.bind(this);
  }

  callTranslationAPI = async() => {
    const origCode = {
      inputText: this.state.inputText,
      inputLang: this.state.inputLang
    };

    const request = {
      method: 'POST',
      body: JSON.stringify(origCode),
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch('/api/translate', request);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  compileInput() {
    this.callTranslationAPI()
      .then((res, err) => {
        const { error, translation, result } = JSON.parse(res.body[0]);
        this.setState({
          outputText: translation,
          compiledResultText: result,
          compilationError: error
        });
    });
  }

  populateInput(lang) {
    if (lang !== 'none') {
      this.setState({
        inputLang: lang,
        inputText: code[lang]
      });
    }
  }

  updateInputLanguage(event) {
    const lang = event.target.options[event.target.selectedIndex].value;
    this.setState({ inputLang: lang });
    this.populateInput(lang);
  }

  updateInputText(event) {
    this.setState({ inputText: event.target.value });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to the Python Vernacular Spectacular</h1>
        </header>
        <div className="language-input">
          <LanguageSelection onChange={this.updateInputLanguage}/>
        </div>
        <div className="input-output-holder">
          <InputField onChange={this.updateInputText} inputText={this.state.inputText} />
          <OutputField outputText={this.state.outputText} />
        </div>
        <div>
          <CompileButton onClick={this.compileInput} />
        </div>
        <div>
          <CompiledResult
              compiledResultText={this.state.compiledResultText}
              compilationError={this.state.compilationError} />
        </div>
      </div>
    );
  }
}

export default App;
