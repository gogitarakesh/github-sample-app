import { Card, List, Avatar, Tag, Tabs, Icon, Layout, message } from "antd";
import React, { Component } from "react";
import { Button } from "antd/lib/radio";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { apiUrl } from "../config";
import { Charts } from "./Charts";
const TabPane = Tabs.TabPane;
const { Header, Content } = Layout;
export class Repo extends Component {
  pathname = this.props.location.pathname.slice(7, this.props.location.pathname.length);
  state = {
    loading: true,
    path: this.pathname,
    commits: [],
    statsData: [],
    chartsData: [
      { day: 'Monday', commits: 0 },
      { day: 'Tuesday', commits: 0 },
      { day: 'Wednesday', commits: 0 },
      { day: 'Thursday', commits: 0 },
      { day: 'Friday', commits: 0 },
      { day: 'Saturday', commits: 0 },
      { day: 'Sunday', commits: 0 },
    ]
  };

  handleClick = () => {
    this.setState({ loading: !this.state.loading });
  };
  async loadData() {
    try {
      const res = await fetch(`${apiUrl}repos/${this.state.path}/stats/commit_activity`);
      const blocks = await res.json();
      if (res.status === 200) {
        this.setState({
          statsData: blocks[blocks.length - 2].days,
        });
        this.state.chartsData.forEach((element, index) => {
          element.commits = this.state.statsData[index];
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  componentDidMount() {
    this.loadData();
    this.loadData();
    axios.get(`${apiUrl}repos/${this.state.path}/commits`).then(res => {
      this.setState({
        commits: res.data,
        loading: false
      });
    }, error => { message.error(error.message) });
  }
  backToResults() {
    this.props.history.goBack();
  }

  render() {
    return (
      <div>
        <Layout>
          <Header>
            <Link
              to="/"
              style={{
                color: "#e6e6e6",
                fontSize: "large"
              }}
            >
              GitHub
                  </Link>
          </Header>
          <Content
            style={{
              padding: "20px 0",
              height: "95vh"
            }}
          >
            <Card
              loading={this.state.loading}
              title={<div style={{ fontSize: "large" }}>{this.state.path}</div>}
              extra={
                <Button onClick={this.backToResults.bind(this)}>
                  Back to results
            </Button>
              }
            >
              <Tabs type="card">
                <TabPane
                  tab={
                    <span>
                      <Icon type="clock-circle" />Commits
                </span>
                  }
                  key="1"
                >
                  <List
                    itemLayout="horizontal"
                    size="middle"
                    bordered="true"
                    pagination="false"
                    dataSource={this.state.commits}
                    renderItem={item => (
                      <List.Item key={item.full_name}>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              src={
                                item.committer ? item.committer.avatar_url : false
                              }
                            />
                          }
                          title={item.commit.message.split("\n")[0]}
                          description={moment(item.commit.committer.date).fromNow()}
                        />
                        {item.commit.verification.verified ? (
                          <Tag color="#87d068">Verified</Tag>
                        ) : (
                            false
                          )}
                        {/* <Button onClick={this.goToRepo.bind(this, item.full_name)}>Check Repo</Button> */}
                      </List.Item>
                    )}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <Icon type="bar-chart" />Insights
                </span>
                  }
                  key="2"
                >
                  <Charts chartsData={this.state.chartsData} path={this.state.path} />
                </TabPane>
              </Tabs>
            </Card>
          </Content>
        </Layout>
      </div>
    );
  }
}
export default Repo;
