import Axios from 'axios';
import React from 'react';
import EditPage from './EditPage';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

const HOST = 'https://haoyu-yang-zhe-li-a3-backend.herokuapp.com/url/';
export default class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: [],
      _id: '',
      full: '',
      short: '',
      errorMessage: '',
      valid: false
    };
  }

  componentDidMount() {
    Axios.get(HOST).then(response => {
      this.setState({ url: response.data });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.url !== this.state.url) {
      Axios.get(HOST).then(response => {
        this.setState({ url: response.data });
      });
    }
  }

  onChange(key, event) {
    this.setState({ [key]: event.target.value });
  }

  onEditChange(key, event) {
    this.setState({ [key]: event.target.value });
  }

  onSubmit() {
    Axios.post(HOST, {
      _id: this.state.urlId,
      full: this.state.urlFull,
      short: this.state.urlShort
    })
      .then(function () {
        return Axios.get(HOST);
      })
      .then(response => {
        this.setState({ url: response.data });
      })
      .catch(err => {
        console.log(err.response.data);
        this.setState({ errorMessage: err.response.data });
        setInterval(this.refreshPage(), 60000);
      })
      .finally(() =>
        this.setState({
          urlId: '',
          urlFull: '',
          urlShort: '',
          urlEdit: ''
        })
      );
  }

  editValidation() {
    const allShort = this.state.url.map(item => item.short);
    if (!allShort.includes(this.state.urlEdit)) {
      this.setState({
        errorMessage: 'Invalid Shortened Url'
      });
      setInterval(this.refreshPage(), 60000);
    } else {
      this.setState({
        valid: true
      });
    }
  }

  refreshPage() {
    // window.location.reload();
    // eslint-disable-next-line no-self-assign
    window.location.href = window.location.href;
  }

  render() {
    return (
      <>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={MainPage}>
              {this.state.errorMessage && (
                <h3 class='alert alert-danger' role='alert'>
                  {' '}
                  {this.state.errorMessage}{' '}
                </h3>
              )}
              <h1 class='text-center'>URL Shortener</h1>
              <div>
                <div class='d-flex justify-content-center'>
                  <table class='table table-sm'>
                    <thead class='thead-dark'>
                      <tr>
                        <th scope='col'>Orginal URL</th>
                        <th scope='col'>Shortened URL</th>
                      </tr>
                    </thead>
                    {this.state.url.map(item => (
                      <tr>
                        <th scope='row'>{item.full}</th>
                        <td>
                          <a
                            rel={'external'}
                            // eslint-disable-next-line react/jsx-no-target-blank
                            target='_blank'
                            href={item.full}
                          >
                            {HOST + item.short}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
                <br></br>
                <label style={{ margin: '5px' }} for='full'>
                  Enter a Full URL:
                </label>
                <input
                  style={{ margin: '5px', width: '80%' }}
                  id='full'
                  value={this.state.urlFull}
                  onChange={e => this.onChange('urlFull', e)}
                ></input>
                <br></br>
                <label style={{ margin: '5px' }} for='short'>
                  Customized Shortened URL:
                </label>
                <input
                  style={{ margin: '5px' }}
                  id='short'
                  value={this.state.urlShort}
                  onChange={e => this.onChange('urlShort', e)}
                  placeholder='Optional'
                ></input>
                <br></br>
                <button
                  style={{ marginLeft: '55px' }}
                  class='btn btn-primary'
                  type='submit'
                  onClick={() => this.onSubmit()}
                >
                  Generate Shortened URL
                </button>
                <br></br>
                <br></br>
                <br></br>
              </div>
              <div>
                <p>
                  If you want to edit or delete a URL, please entered the{' '}
                  <strong>SHORTENED</strong> URL below:
                </p>
                <label for='edit'></label>
                <input
                  id='edit'
                  value={this.state.urlEdit}
                  onChange={e => this.onEditChange('urlEdit', e)}
                ></input>
                <span> </span>
                <button
                  style={{ margin: '5px' }}
                  class='btn btn-primary'
                  type='submit'
                  onClick={() => this.editValidation()}
                >
                  {(this.state.valid && (
                    <Link
                      to={'/' + this.state.urlEdit + '/edit'}
                      style={{ color: '#FFF' }}
                    >
                      Click again to edit
                    </Link>
                  )) ||
                    ' EditURL'}
                </button>
                <span> </span>
                <button
                  style={{ margin: '5px' }}
                  class='btn btn-primary'
                  type='submit'
                  onClick={() => this.refreshPage()}
                >
                  <Link to={'/'} style={{ color: '#FFF' }}>
                    Click to refresh the page
                  </Link>
                </button>
              </div>
            </Route>
            <Route
              path={'/' + this.state.urlEdit + '/edit'}
              component={EditPage}
            >
              <EditPage short={this.state.urlEdit} />
            </Route>
          </Switch>
        </BrowserRouter>
      </>
    );
  }
}
