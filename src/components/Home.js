import React, { Component } from "react";
import { Search } from "./Search";
import { Layout } from "antd";
import "./Home.css"
const { Header } = Layout;
export class Home extends Component {
  render() {
    return (
      <div>
        <Layout>
          <Header style={{
            position: "fixed", zIndex: 1, width: "100%", color: '#e6e6e6', fontSize: 'large'
          }}>
            <div className="logo">
              GitHub
            </div>
          </Header>
          <Search router={this.props} />{" "}
        </Layout>
      </div>
    );
  }
}

export default Home;
