import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import axios from 'axios'
import MuhalikConfig from './sdk/almakan.config'
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import Colors from './constants/Colors';
import LoginScreen from './screens/LoginSignup/LoginScreen';
import SignupScreen from './screens/LoginSignup/SignupScreen';
const Stack = createStackNavigator();
import { I18Provider, LOCALES } from './i18n'
import React, { Component } from 'react';
import { getTokenFromStorage, checkTokenExpAuth } from './sdk/authentication-service';
import ResetPasswordScreen from './screens/LoginSignup/ResetPasswordScreen';
import AddressScreen from './screens/Account/AddressScreen';
import ChangePictureScreen from './screens/Account/ChangePictureScreen';
import PersonelInfoScreen from './screens/Account/PersonelInfoScreen';
import { AsyncStorage } from 'react-native';
import 'intl';
import OrdersScreen from './screens/OrdersScreen';
import FlatsScreen from './screens/FlatsScreen';
import ShowAppartmentScreen from './screens/ShowAppartmentScreen';
import SearchScreen from './screens/SearchScreen';
import WishlistScreen from './screens/Account/WishlistScreen';

import intlEN from 'react-intl/locale-data/en';
import intlAR from 'react-intl/locale-data/ar';
import { addLocaleData } from 'react-intl'
import TermsConditionsScreen from './screens/TermsConditionsScreen';
import PrivacyStatementScreen from './screens/PrivacyStatementScreen';
import UploadDataScreen from './screens/Seller/UploadDataScreen';
import MessagesScreen from './screens/Seller/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import CustomersScreen from './screens/Admin/CustomersScreen';
import SellersScreen from './screens/Admin/SellersScreen';
import SoldOutScreen from './screens/SoldOutScreen';
import SliderScreen from './screens/Admin/SliderScreen';
import CustomerChatScreen from './screens/Chat/CustomerChatScreen';
import SellerChatScreen from './screens/Chat/SellerChatScreen';
import AdminInventoryScreen from './screens/Admin/AdminInventoryScreen';
import SellerInventoryScreen from './screens/Seller/SellerInventoryScreen';
import PlaceOrderSCreen from './screens/Order/PlaceOrderSCreen';
import CompletedOrders from './screens/Order/CompletedOrders';
import ProgressOrders from './screens/Order/ProgressOrders';
import ViewOrder from './screens/Order/ViewOrder';
import EditInstallment from './screens/Order/EditInstallment';
addLocaleData([...intlEN, ...intlAR])

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: LOCALES.ENGLISH,
      currLang: 'en',
      token: null,
      user: {
        _id: null, role: '', mobile: '', full_name: '', gender: '', countary: '', city: '', address: '',
        email: '', shop_name: '', shop_category: '', shop_address: '', avatar: '', status: ''
      },
      isNetwork: true,
      sliders_list: []
    }
  }

  isLoadingComplete
  unmounted = true
  CancelToken = axios.CancelToken
  source = this.CancelToken.source()

  async componentDidMount() {
    // const lang = await AsyncStorage.getItem('lang')
    this.loadUser()
    this.getSlidersList()
  }

  async loadUser() {
    const _decoded_token = await checkTokenExpAuth()
    if (_decoded_token != null) {
      this.setState({ user: _decoded_token })
      this.getUser(_decoded_token._id)
      const _token = await getTokenFromStorage()
      this.setState({ token: _token })
    }
  }

  async getUser(id) {
    const currentComponent = this
    const user_url = MuhalikConfig.PATH + `/users/user-by-id/${id}`;
    await axios.get(user_url).then((res) => {
      currentComponent.setState({ user: res.data.data[0] })
    }).catch((err) => {
      console.log('get user error:', err)
    })
  }

  async getSlidersList() {
    const curentComponent = this
    const url = MuhalikConfig.PATH + '/sliders/';
    await axios.get(url).then((res) => {
      curentComponent.setState({ sliders_list: res.data.data.docs })
    }).catch((err) => {
      console.log('slider list fatching error: ', err)
    })
  }

  logout() {
    this.setState({
      user: {
        _id: null, role: '', mobile: '', full_name: '', gender: '', countary: '', city: '', address: '',
        email: '', shop_name: '', shop_category: '', shop_address: '', avatar: '', status: ''
      },
      token: null
    })
  }

  render() {
    return (
      <I18Provider locale={this.state.locale}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
          <NavigationContainer
            linking={LinkingConfiguration}
            screenProps={{
            }}
          >
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: Colors.primary_color },
                headerTintColor: Colors.primary_text_color,
                headerTitleAlign: 'center',
              }}
            >

              {/* Home , Categories, Cart , Account */}
              <Stack.Screen name="Root" options={{ headerShown: false }}>
                {props =>
                  <BottomTabNavigator {...props}
                    user={this.state.user}
                    logout={this.logout.bind(this)}
                    sliders_list={this.state.sliders_list}
                    token={this.state.token}
                    reloadUser={() => this.getUser(this.state.user._id)}
                    isNetwork={this.state.isNetwork}
                  />
                }
              </Stack.Screen>










              {/* Admin Screen Stack */}
              <Stack.Screen name="Sold Out">
                {props =>
                  <SoldOutScreen {...props}
                    user={this.state.user}
                    token={this.state.token}
                  />
                }
              </Stack.Screen>
              <Stack.Screen name="Sellers">
                {props =>
                  <SellersScreen {...props}
                    user={this.state.user}
                    token={this.state.token}
                  />
                }
              </Stack.Screen>
              <Stack.Screen name="Customers">
                {props =>
                  <CustomersScreen {...props}
                    user={this.state.user}
                    token={this.state.token}
                  />
                }
              </Stack.Screen>
              <Stack.Screen name="Slider">
                {props =>
                  <SliderScreen {...props}
                    token={this.state.token}
                    sliders_list={this.state.sliders_list}
                    reloadSliders={() => this.getSlidersList}
                  />
                }
              </Stack.Screen>
              <Stack.Screen name="AdminInventory">
                {props =>
                  <AdminInventoryScreen {...props}
                    token={this.state.token}
                  />
                }
              </Stack.Screen>





              {/* Seller Screen Stack */}
              <Stack.Screen name="Upload Data">
                {props =>
                  <UploadDataScreen {...props}
                    user={this.state.user}
                    token={this.state.token}
                  />
                }
              </Stack.Screen>
              <Stack.Screen name="Inventory">
                {props =>
                  <SellerInventoryScreen {...props}
                    user={this.state.user}
                    token={this.state.token}
                  />
                }
              </Stack.Screen>
              <Stack.Screen name="Messages">
                {props =>
                  <MessagesScreen {...props}
                    user={this.state.user}
                  />
                }
              </Stack.Screen>


              {/* Home Stack */}
              {/* Products Screen */}
              <Stack.Screen name="FlatsScreen" options={{ headerShown: false }}>
                {props =>
                  <FlatsScreen {...props}
                    currLang={this.state.currLang}
                  />
                }
              </Stack.Screen>
              {/* Show Products Screen */}
              <Stack.Screen name="ShowAppartment" options={{ headerShown: false }}>
                {props =>
                  <ShowAppartmentScreen {...props}
                    user={this.state.user}
                    token={this.state.token}
                    reloadUser={() => this.getUser(this.state.user._id)}
                  />
                }
              </Stack.Screen>
              {/* Search Screen */}
              <Stack.Screen name="Search" options={{ headerShown: false }}>
                {props =>
                  <SearchScreen {...props}
                  />
                }
              </Stack.Screen>

              {/* Chat */}
              <Stack.Screen name="Chat">
                {props =>
                  <ChatScreen {...props}
                    user={this.state.user}
                  />
                }
              </Stack.Screen>




              {/* Account Stack */}
              {/* Login Screen */}
              <Stack.Screen name="Login" options={{ headerShown: false, headerBackground: 'blue' }}>
                {props =>
                  <LoginScreen {...props}
                    reloadUser={this.loadUser.bind(this)}
                  />
                }
              </Stack.Screen>
              {/* Reset Password Screen*/}
              <Stack.Screen name="Reset Password" options={{ headerShown: false }}>
                {props => <ResetPasswordScreen {...props}
                  user={this.state.user}
                />}
              </Stack.Screen>
              {/* Signup Screen*/}
              <Stack.Screen name="Signup" options={{ headerShown: false }}>
                {props =>
                  <SignupScreen {...props}
                    user={this.state.user}
                  />
                }
              </Stack.Screen>
              {/* Terms & Conditions Screen*/}
              <Stack.Screen name="Terms & Conditions">
                {props =>
                  <TermsConditionsScreen {...props}
                  />
                }
              </Stack.Screen>
              {/* PrivacyStatement Screen*/}
              <Stack.Screen name="Privacy Statement">
                {props =>
                  <PrivacyStatementScreen {...props}
                  />
                }
              </Stack.Screen>
              {/* Personel Info Screen */}
              <Stack.Screen name="Personel Info">
                {props =>
                  <PersonelInfoScreen {...props}
                    token={this.state.token}
                    user={this.state.user}
                    reloadUser={() => this.getUser(this.state.user._id)}
                    currLang={this.state.currLang}
                  />
                }
              </Stack.Screen>
              {/* My Address Screen */}
              <Stack.Screen name="My Address">
                {props =>
                  <AddressScreen {...props}
                    token={this.state.token}
                    user={this.state.user}
                    reloadUser={() => this.getUser(this.state.user._id)}
                    currLang={this.state.currLang}
                  />
                }
              </Stack.Screen>
              {/* Change Picture SCreen */}
              <Stack.Screen name="Change Picture">
                {props =>
                  <ChangePictureScreen {...props}
                    token={this.state.token}
                    user={this.state.user}
                    reloadUser={() => this.getUser(this.state.user._id)}
                    currLang={this.state.currLang}
                  />
                }
              </Stack.Screen>
              {/* Orders Screen*/}
              <Stack.Screen name="Orders">
                {props =>
                  <OrdersScreen {...props}
                    token={this.state.token}
                    user={this.state.user}
                  />
                }
              </Stack.Screen>
              {/* Wishlist Screen*/}
              <Stack.Screen name="My Wishlist">
                {props =>
                  <WishlistScreen {...props}
                    token={this.state.token}
                    user={this.state.user}
                    reloadUser={() => this.getUser(this.state.user._id)}
                  />
                }
              </Stack.Screen>









              {/* Order STack */}
              <Stack.Screen name="Place Order">
                {props =>
                  <PlaceOrderSCreen {...props}
                    token={this.state.token}
                    user={this.state.user}
                    reloadUser={() => this.getUser(this.state.user._id)}
                  />
                }
              </Stack.Screen>
              <Stack.Screen name="Progress Orders">
                {props =>
                  <ProgressOrders {...props}
                    token={this.state.token}
                    user={this.state.user}
                  />
                }
              </Stack.Screen>
              <Stack.Screen name="Completed Orders">
                {props =>
                  <CompletedOrders {...props}
                    token={this.state.token}
                    user={this.state.user}
                  />
                }
              </Stack.Screen>
              <Stack.Screen name="View Order">
                {props =>
                  <ViewOrder {...props}
                    token={this.state.token}
                    user={this.state.user}
                  />
                }
              </Stack.Screen>
              <Stack.Screen name="Edit Installment">
                {props =>
                  <EditInstallment {...props}
                    token={this.state.token}
                    user={this.state.user}
                  />
                }
              </Stack.Screen>









              {/* Chat */}
              <Stack.Screen name="CustomerChat">
                {props =>
                  <CustomerChatScreen {...props}
                    token={this.state.token}
                    user={this.state.user}
                  />
                }
              </Stack.Screen>
              <Stack.Screen name="SellerChat">
                {props =>
                  <SellerChatScreen {...props}
                    token={this.state.token}
                    user={this.state.user}
                  />
                }
              </Stack.Screen>

            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </I18Provider>
    );
    // }
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.body_color,
    // marginTop: Constants.statusBarHeight,
  },
});
