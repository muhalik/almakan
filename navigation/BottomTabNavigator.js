import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/Account/AccountScreen';

import { AntDesign, Feather } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import SellerDashboard from '../screens/Seller/SellerDashboard';
import AdminDashboard from '../screens/Admin/AdminDashboard';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator(props) {
  props.navigation.setOptions({ headerTitle: getHeaderTitle(props.route) });
  return (
    <BottomTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{
        activeTintColor: Colors.primary_text_color,
        tabStyle: { paddingVertical: 5 },
        labelStyle: { fontSize: 12 },
        activeBackgroundColor: Colors.primary_color
      }}
    >
      {/* Home */}
      <BottomTab.Screen name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <AntDesign style={{}} name="home" size={21} color={focused ? Colors.primary_text_color : Colors.secondary_color} />,
        }}
      >
        {prop => <HomeScreen {...props} />}
      </BottomTab.Screen>
      {props.user.role != '' && props.user.role != 'customer' &&
        <BottomTab.Screen name="Dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ focused }) => <Foundation name="thumbnails" size={26} color={focused ? Colors.primary_text_color : Colors.secondary_color} />,
          }}
        >
          {() => props.user.role == 'vendor' ? <SellerDashboard {...props} /> : <AdminDashboard {...props} />}
        </BottomTab.Screen>
      }
      {/* Account */}
      <BottomTab.Screen name="Account"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => <SimpleLineIcons name="user" size={18} color={focused ? Colors.primary_text_color : Colors.secondary_color} />,
        }}
      >
        {prop => <AccountScreen {...props} />}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'How to get started';
    case 'Links':
      return 'Links to learn more';
  }
}
