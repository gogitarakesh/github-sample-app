import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import {
  Layout,
  Input,
  List,
  Avatar,
  Icon,
  Card,
  Select,
  Affix,
  Row,
  Col,
  message,
  Tag
} from "antd";
import { apiUrl } from "../config";
import moment from "moment";
import "./Results.css";
const { Header, Content } = Layout;
const Option = Select.Option;
const Search = Input.Search;
const IconText = ({ type, text }) => (
  <span>
    <Icon
      type={type}
      style={{
        marginRight: 8
      }}
    />
    {text}
  </span>
);
export class Results extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: "",
      repositories: [],
      activePage: 1,
      totalItemsCount: 30,
      isMini: false,
      itemsPerPage: 10,
      loading: true,
      sortValue: ""
    };
  }
  componentDidMount() {
    const path = this.props.location.search;
    const value = path.slice(
      path.indexOf("?q=") + 3,
      path.includes("&p") ? path.indexOf("&p=") : path.length
    );
    const pageNo = path.includes("&p")
      ? parseInt(path.slice(path.indexOf("&p=") + 3, path.length))
      : 0;
    this.onSearch(value, pageNo);
  }
  onSearch(value, pageNo) {
    if (!value) {
      message.error("Please enter a valid search text");
    } else {
      axios
        .get(
          `${apiUrl}search/repositories?q=${value}&page=${pageNo}&per_page=${
          this.state.itemsPerPage
          }`
        )
        .then(res => {
          this.setState({
            repositories: res.data.items,
            totalItemsCount: res.data.total_count <= 1000 ? res.data.total_count : 1000,
            isMini: true,
            visible: false,
            searchTerm: value,
            activePage: pageNo,
            loading: false
          });
        }, error => { message.error(error.message); });
    }
  }
  handleSortChange(e) {
    this.setState({
      sortValue: e
    });
    if (e === "match") {
      this.onSearch(this.state.searchTerm, 1);
    } else {
      axios
        .get(
          `${apiUrl}search/repositories?q=${
          this.state.searchTerm
          }&page=1&per_page=${this.state.itemsPerPage}&sort=${
          this.state.sortValue
          }&order=desc`
        )
        .then(res => {
          this.setState({
            repositories: res.data.items,
            totalItemsCount: res.data.total_count <= 1000 ? res.data.total_count : 1000,
            isMini: true,
            visible: false,
            activePage: 1,
            loading: false
          });
        }, (error) => { message.error(error.message); });
    }
  }
  handlePageChange(pageNumber) {
    this.props.history.push(
      `/search?q=${this.state.searchTerm}&p=${pageNumber}`
    );
    axios
      .get(
        `${apiUrl}search/repositories?q=${
        this.state.searchTerm
        }&page=${pageNumber}&per_page=${this.state.itemsPerPage}`
      )
      .then(res => {
        this.setState({
          repositories: res.data.items,
          totalItemsCount: res.data.total_count <= 1000 ? res.data.total_count : 1000
        });
      }, error => { message.error(error.message); });
    this.setState({
      activePage: pageNumber
    });
  }
  goToRepo(owner, repoName) {
    this.props.history.push(`/repos/${owner}/${repoName}`);
  }
  render() {
    return (
      <div>
        <Layout>
          <Affix>
            <Header>
              <Row>
                <Col span={8}>
                  <Link
                    to="/"
                    style={{
                      color: "#e6e6e6",
                      fontSize: "large"
                    }}
                  >
                    GitHub
                  </Link>
                </Col>
                <Col span={8} offset={8}>
                  <Search
                    placeholder={this.state.searchTerm}
                    enterButton="Search"
                    size="large"
                    onSearch={value => {
                      if (value) {
                        this.props.history.push(`/search?q=${value}&p=1`);
                        this.onSearch(value, 1);
                      }
                    }}
                  />
                </Col>
              </Row>
              <div
                style={{
                  display: "flex"
                }}
              />
            </Header>
          </Affix>
          <Content
            style={{
              pdadding: "0 50px",
              height: "95vh"
            }}
          >
            <Layout
              style={{
                padding: "24px 0",
                background: "#fff"
              }}
            >
              <Card loading={this.state.loading}>
                <Content
                  style={{
                    padding: "0 24px",
                    minHeight: 280
                  }}>
                  <Select
                    defaultValue="Filter by"
                    style={{
                      width: 120,
                      float: "right"
                    }}
                    onChange={this.handleSortChange.bind(this)}>
                    <Option value="match">Best Match</Option>
                    <Option value="stars"> Most Stars</Option>
                    <Option value="forks"> Most Forks</Option>
                  </Select>
                  <div
                    style={{
                      paddingTop: 50
                    }}>
                    <List
                      itemLayout="vertical"
                      size="middle"
                      bordered="false"
                      pagination={{
                        onChange: page => {
                          this.handlePageChange(page);
                        },
                        pageSize: this.state.itemsPerPage,
                        total: this.state.totalItemsCount,
                        current: this.state.activePage
                      }}
                      dataSource={this.state.repositories}
                      renderItem={item => (
                        <List.Item
                          key={item.full_name}
                          actions={[
                            <IconText
                              type="star"
                              text={item.stargazers_count}
                            />,
                            <IconText type="eye" text={item.watchers} />,
                            <IconText type="fork" text={item.forks} />
                          ]}
                          extra={
                            <img
                              width={100}
                              alt="logo"
                              src={item.owner.avatar_url}
                            />
                          }>
                          <List.Item.Meta
                            avatar={<Avatar src={item.owner.avatar_url} />}
                            title={
                              <a
                                onClick={this.goToRepo.bind(
                                  this,
                                  item.owner.login,
                                  item.name
                                )}
                              >
                                {item.full_name}
                              </a>
                            }
                            description={item.description}
                          />
                          <Tag>{item.language}</Tag>
                          <small>
                            Updated {moment(item.updated_at).fromNow()}
                          </small>
                        </List.Item>
                      )}
                    />
                  </div>
                </Content>
              </Card>
            </Layout>
          </Content>
        </Layout>
      </div>
    );
  }
}
export default withRouter(Results);
