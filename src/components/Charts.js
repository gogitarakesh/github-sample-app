import React, { Component } from "react";
import { Spin } from "antd";
import * as Recharts from 'recharts';
const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = Recharts;
export class Charts extends Component {
  constructor() {
    super();
    this.state = {
      loading: true
    }
  }

  componentDidMount() {

    this.setState({
      loading: false
    })
  }
  render() {
    return (
      <div>
        {!this.state.loading ?
          <div>
            <div style={{ fontSize: "medium", paddingBottom: "20px" }}>
              Frequency of commits last week
          </div>
            <BarChart width={700} height={300} data={this.props.chartsData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="commits" fill="#82ca9d" />
            </BarChart>
          </div>
          :
          <div style={{ textAlign: "center", alignItems: "center" }}>
            <Spin />
          </div>
        }
      </div>
    );
  }
}
export default Charts;
