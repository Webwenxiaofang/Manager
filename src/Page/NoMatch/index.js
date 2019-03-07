import React, { Component } from 'react';

class NoMatch extends Component {
  state = {
    loading: false,
  }
  componentDidMount() {
    let url = {
      pathname: '',
      search: '',
    }
    if (this.props.location.realPathname && this.props.location.realPathname.length > 0) {
      url.pathname = this.props.location.realPathname;
      url.search = this.props.location.search;
      this.props.history.replace(url);
    }

  }



  render() {
    return (
      <div >
        404

      </div>
    );
  }
}

export default NoMatch;
