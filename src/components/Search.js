import { Layout, Row, Col, Input, message } from "antd";
import React, { Component } from "react";
const SearchInput = Input.Search;
const { Content } = Layout;
export class Search extends Component {
  state = {};
  onSearch(value) {
    if (!value) {
      message.error('Please enter a valid text');
    } else {
      this.props.router.history.push(`/search?q=${value}&p=1`);
    }
  }
  render() {
    return (
      <div>
        <Content
          style={{
            padding: "0 50px",
            marginTop: 84,
            alignItems: "center",
            height: "90vh"
          }}
        >
          <div style={{ background: "#fff", padding: 24, minHeight: 380, paddingTop: '8em' }}>
            <Row type="flex" justify="space-around" align="middle">
              <Col span={8}>
                Search more than 87M repositories
                  <SearchInput
                  placeholder="Search GitHub"
                  enterButton="Search"
                  size="large"
                  onSearch={value => {
                    this.onSearch(value);
                  }}
                />
              </Col>
            </Row>
          </div>
        </Content>
      </div >
    );
  }
}
export default Search;
