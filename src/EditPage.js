import Axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

export default class EditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      full: '',
      short: this.props.short,
      editFull: '',
      errorMessage: '',
      valid: false
    };
  }

  refreshPage() {
    // window.location.reload();
    // eslint-disable-next-line no-self-assign
    window.location.href = window.location.href;
  }

  componentDidMount() {
    Axios.get('http://localhost:5000/url/' + this.state.short).then(
      response => {
        this.setState({ full: response.data.full });
      }
    );
  }

  onChange(key, event) {
    this.setState({ [key]: event.target.value });
  }

  onSubmit() {
    Axios.put('http://localhost:5000/url/' + this.state.short + '/edit', {
      full: this.state.editFull,
      short: this.state.short
    })
      .then(function () {
        Axios.get('http://localhost:5000/url/' + this.state.short);
      })
      // .then(() => {
      //   this.setState({
      //     valid: true
      //   });
      // });
      .catch(err => {
        // console.log(err.response.data);
        this.setState({
          errorMessage: err.response ? err.response.data : null
          // valid: false
        });
      });
    // .finally(() => {
    //   this.setState({
    //     valid: true
    //   });
    // });
  }

  ValidURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) {
      return false;
    } else {
      return true;
    }
  }

  checkNewFull() {
    const newUrl = this.state.editFull;
    if (!this.ValidURL(newUrl)) {
      this.setState({
        errorMessage: 'Invalid Full Url'
      });
    } else {
      this.setState({
        valid: true
      });
    }
  }

  onSubmitDelete() {
    Axios.delete('http://localhost:5000/url/' + this.state.short + '/edit', {
      short: this.state.short
    }).catch(err => {
      this.setState({ errorMessage: err.response.data });
    });
    this.refreshPage();
  }

  render() {
    return (
      <>
        {this.state.errorMessage && (
          <h3 class='alert alert-danger' role='alert'>
            {' '}
            {this.state.errorMessage}{' '}
          </h3>
        )}
        <h1 class='text-center'>Edit This Url</h1>
        <div>
          <div>Full URL: {this.state.full}</div>
          <div>
            Shortened URL: {this.state.short}
            <button
              style={{ margin: '20px' }}
              onClick={() => this.onSubmitDelete()}
            >
              <Link to={'/'}>Delete This Url</Link>
            </button>
          </div>
          <label for='test'>Edit Original URL:</label>
          <input
            style={{ margin: '10px', width: '60%' }}
            id='test'
            value={this.state.editFull}
            onChange={e => this.onChange('editFull', e)}
            placeholder='Full URL'
          ></input>
          <span> </span>
          <button
            style={{ margin: '10px', color: '#3498DB' }}
            onClick={() => {
              this.onSubmit();
              this.checkNewFull();
            }}
          >
            {(this.state.valid && <Link to={'/'}>Confirm Update</Link>) ||
              'Update URL'}
          </button>
          <br></br>
        </div>
      </>
    );
  }
}
