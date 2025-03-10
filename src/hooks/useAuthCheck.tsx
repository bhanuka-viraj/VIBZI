import React from 'react';
import {useSelector} from 'react-redux';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootState} from '../redux/store';
import {RootStackParamList} from '../navigation/AppNavigator';

export const useAuthCheck = (screenName: string) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('MainTabs');
      navigation.navigate('Login', {redirectTo: screenName});
    }
  }, [isAuthenticated, navigation, screenName]);

  return isAuthenticated;
};
