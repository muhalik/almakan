import React, { Component } from 'react';
import Carosuel from '../components/Carosuel'
import axios from 'axios'
import MuhalikConfig from '../sdk/almakan.config'
import { StyleSheet, View } from 'react-native';
import Padding from '../constants/Padding';
import Flats from '../components/CardCarosuel';
import Layout from '../components/Layout';
import CustomStatusBar from '../components/CustomStatusBar';
import HomeCateggories from '../components/HomeCateggories';
import OnlyProducts from '../components/FlatsInfiniteScroll';

import data from '../sdk/testData'

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      new_arrival_products: [],
      top_ranking_products: [],
    }
  }

  componentDidMount() {
    this.getNewArrivalFlats()
  }

  async getNewArrivalFlats() {
    const curentComponent = this
    const new_arival_url = MuhalikConfig.PATH + `/products/new-arrivals`
    await axios({
      method: 'GET',
      url: new_arival_url,
      params: { page: '1', limit: '12' },
    }).then((res) => {
      curentComponent.setState({
        new_arrival_products: res.data.data.docs,
        top_ranking_products: res.data.data.docs
      })
    }).catch(err => {
      console.log('New arrival products fetching error:', err)
    })
  }

  render() {
    return (
      <Layout navigation={this.props.navigation}>
        <CustomStatusBar />
        <View style={{ height: 5 }} />
        <Carosuel navigation data={this.props.sliders_list} {...this.props} />
        <View style={{ height: 10 }} />
        <Flats data={this.state.new_arrival_products} type={"New Arrival"} {...this.props} />
        <View style={{ height: 15 }} />
        <Flats data={this.state.new_arrival_products} type={"Top Ranking"} {...this.props} />
        <View style={{ height: 15 }} />
        <OnlyProducts {...this.props} />
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  body_container: {
    marginHorizontal: Padding.page_horizontal,
    marginVertical: Padding.page_horizontal,
  },
})
export default HomeScreen;