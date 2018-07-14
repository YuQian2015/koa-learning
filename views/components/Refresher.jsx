import React from 'react';
import ReactDOM from 'react-dom';
import PullToRefresh from "rmc-pull-to-refresh";

export default class Refresher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        activate: <div className="pull active">
          <div>
            <i className="hd-unfold"></i>
          </div>释放加载</div>,
        deactivate: <div className="pull">
          <div>
            <i className="hd-unfold"></i>
          </div>继续下拉</div>,
        release: <div className="loader">加载中...</div>,
        finish: <div className="pull">
            <div>
              <i className="hd-unfold"></i>
            </div>继续下拉</div>
      },
      loadMoreConfig: {
        activate: "释放加载",
        deactivate: "上滑加载更多",
        release: <div className="loader">加载中...</div>,
        finish: "上滑加载更多"
      },
      dir: "down"
    }
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  handleRefresh() {
    this.props.onRefresh().then(result => {
      this.setState({refreshing: false});
    }).catch(error => {
      this.setState({refreshing: false});
    });
  }

  handleLoadMore() {
    this.props.onLoadMore().then(result => {
      this.setState({refreshing: false});
    }).catch(error => {
      this.setState({refreshing: false});
    });
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this.refs.refresher);
    const child = node.children[0];
    if (node) {
      node.addEventListener('scroll', () => {
        console.log(child.offsetHeight == node.offsetHeight + node.scrollTop);
        console.log(child);
        if (node.scrollTop) {
          this.setState({dir: "up"})
        } else {
          this.setState({dir: "down"})
        }
      });
    }
  }

  componentWillUnmount() {
    const node = ReactDOM.findDOMNode(this.refs.refresher);
    node.removeEventListener('scroll', () => {});
  }

  render() {
    let {dir} = this.state;
    return (<PullToRefresh ref="refresher" direction={dir} distanceToRefresh={60} indicator={dir == "down"
        ? this.state.config
        : this.state.loadMoreConfig} refreshing={this.state.refreshing} prefixCls="refresher" onRefresh={() => {
        if (dir == "down") {
          this.handleRefresh()
        } else {
          this.handleLoadMore()
        }
      }}>

      {this.props.children}
    </PullToRefresh>)
  }
}

// direction:	pull direction, can be up or down            String  down
// className:	additional css class of root dom node        String	-
// damping:	pull damping, suggest less than 200	           number  100
