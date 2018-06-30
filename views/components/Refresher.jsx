import React from 'react';
import PullToRefresh from "rmc-pull-to-refresh";

export default class Refresher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        activate: <div className="pull active"><div><i className="hd-unfold"></i></div>释放加载</div>,
        deactivate: <div className="pull"><div><i className="hd-unfold"></i></div>继续下拉</div>,
        release: <div className="loader">加载中...</div>,
        finish: <div className="pull"><div><i className="hd-unfold"></i></div>继续下拉</div>
      }
    }
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  handleRefresh() {
    this.props.onRefresh().then(result => {
      this.setState({refreshing: false});
    }).catch(error => {
      this.setState({refreshing: false});
    });
  }
  render() {
    return (<PullToRefresh
      direction="down"
      distanceToRefresh={60}
      indicator={this.state.config}
      refreshing={this.state.refreshing}
      prefixCls="refresher"
      onRefresh={() => {
        this.handleRefresh()
      }}>

      {this.props.children}
    </PullToRefresh>)
  }
}

// direction:	pull direction, can be up or down            String  down
// className:	additional css class of root dom node        String	-
// damping:	pull damping, suggest less than 200	           number  100
