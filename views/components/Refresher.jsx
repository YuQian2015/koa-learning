import React from 'react';
import PullToRefresh from "rmc-pull-to-refresh";

export default class Refresher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        activate: <div className="pull active">释放加载</div>,
        deactivate: <div className="pull">继续下拉</div>,
        release: <div className="loader">加载中...</div>,
        finish: "刷新成功"
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
