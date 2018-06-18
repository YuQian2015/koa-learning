import React from 'react';
import {Carousel} from 'react-responsive-carousel';

import {withRouter} from "react-router-dom";
import LocalDB from 'local-db';

const welcomeCollection = new LocalDB('welcome');

import PageContainer from '../container/PageContainer.jsx';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

import welcome1 from '../assest/images/welcome/welcome1.jpg';
import welcome2 from '../assest/images/welcome/welcome2.jpg';
import welcome3 from '../assest/images/welcome/welcome3.jpg';
import welcome4 from '../assest/images/welcome/welcome4.jpg';

// 滚动图片
// https://www.npmjs.com/package/react-responsive-carousel

// 本地储存
// https://www.npmjs.com/package/local-db

class ImageCarousel extends React.Component {
  render() {
    return (<Carousel showArrows={false} showStatus={false} showThumbs={false}>
      <div>
        <img src={welcome1}></img>
        <p className="legend">1</p>
      </div>
      <div>
        <img src={welcome2}></img>
        <p className="legend">2</p>
      </div>
      <div>
        <img src={welcome3}></img>
        <p className="legend">3</p>
      </div>
      <div>
        <img src={welcome4}></img>
        <p className="legend">4</p>
      </div>
    </Carousel>);
  }
}

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    }
  }

  componentWillMount() {}

  componentDidMount() {
    const first = welcomeCollection.query({});
    if (first.length) {
      welcomeCollection.update(first[0], {visitTime: new Date().getTime()});
      this.props.history.replace("/home");
      return;
    }
    welcomeCollection.insert({visitTime: new Date().getTime()});
    this.setState({show: true});
  }

  render() {
    let {show} = this.state;
    let welcome = (<div className="WelcomePage">
      {
        show
          ? <ImageCarousel/>
          : null
      }
    </div>);
    return welcome
  }
}

export default withRouter(WelcomePage);
