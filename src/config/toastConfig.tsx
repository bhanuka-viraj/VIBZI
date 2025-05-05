import { View, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../constants/theme';

const toastConfig = {
  success: (props: any) => (
    <View style={{
      height: 60,
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 500,
      padding: 15,
      marginHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    }}>
      <View style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      }}>
        <MaterialIcons name="check" size={20} color="white" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#333', fontSize: 16 }}>{props.text1}</Text>
        {props.text2 && <Text style={{ color: '#666', fontSize: 14, marginTop: 2 }}>{props.text2}</Text>}
      </View>
    </View>
  ),
  error: (props: any) => (
    <View style={{
      height: 60,
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 30,
      padding: 15,
      marginHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    }}>
      <View style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F44336',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      }}>
        <MaterialIcons name="error-outline" size={20} color="white" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#333', fontSize: 16 }}>{props.text1}</Text>
        {props.text2 && <Text style={{ color: '#666', fontSize: 14, marginTop: 2 }}>{props.text2}</Text>}
      </View>
    </View>
  ),
  delete: (props: any) => (
    <View style={{
      height: 60,
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 30,
      padding: 15,
      marginHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    }}>
      <View style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: theme.colors.error,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      }}>
        <MaterialIcons name="delete" size={20} color="white" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#333', fontSize: 16 }}>{props.text1}</Text>
        {props.text2 && <Text style={{ color: '#666', fontSize: 14, marginTop: 2 }}>{props.text2}</Text>}
      </View>
    </View>
  ),
};

export default toastConfig;