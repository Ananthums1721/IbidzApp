import React, {useEffect, useState, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import colours from '../globals/colours';
import {getFontontSize} from '../globals/functions';
import {LoaderContext} from '../Context/loaderContext';
import {AppContext} from '../Context/appContext';
import {razorPayInfo, updPackageOrder} from '../api';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import AuthButton from './AuthButton';
import {CommonActions} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Packagecard = ({
  navigation,
  packageName,
  packageAuction,
  packageValidity,
  packageAmount,
  packageId,
  onpress,
}) => {
  const [razorpayRes, setRazorpayRes] = useState('');
  const {showLoader} = React.useContext(LoaderContext);

  const {profile} = useContext(AppContext);

  const getRazorpayInfo = async () => {
    try {
      // showLoader(true)
      let res = await razorPayInfo({
        sp: 'razorPayInfo',
        custId: profile[0].customerId,
        packId: packageId,
      });
      setRazorpayRes(res[0]);
      showLoader(false);
      if (res != '') {
        var options = {
          currency: 'INR',
          key: 'rzp_test_cWQhGghXCxe6cO', // Your api key
          name: 'Ibidz',
          order_id: res[0]?.rp_token,
          amount: res[0]?.amount,
          prefill: {
            email: res[0]?.cust_email,
            contact: res[0]?.cust_phone,
            name: res[0]?.cust_name,
          },
          theme: {color: colours.primaryBlue},
        };
        RazorpayCheckout.open(options)
          .then(async data => {
            try {
              let res1 = await updPackageOrder({
                sp: 'updPackageOrder',
                razorpaySignature: data?.razorpay_signature,
                razorpayIaymentId: data?.razorpay_payment_id,
                razorpayOrderId: data?.razorpay_order_id,
                orderStatus: 1,
              });
              if ((res1.Message = 'Success')) {
                navigation.goBack();
              }
            } catch (e) {
              showLoader(false);
            }
          })
          .catch(error => {
            showLoader(false);
            navigation.goBack();
          });
      } else {
        Toast.show(
          'Sorry! Paymet is unable to initiate at this time. Please contact our support.',
        );
      }
    } catch (error) {
      showLoader(false);
    }
  };
  return (
    <ImageBackground
      style={styles.PackageBack}
      imageStyle={styles.PackageBack}
      source={require('../asset/images/PackageBack.png')}>
      <View style={styles.priceCon}>
        <Text style={[styles.fontText1, {color: colours.blue}]}>
          ₹{packageAmount}
          <Text style={styles.fontText6}> +GST</Text>
        </Text>
      </View>
      <View style={styles.nameCon}>
        <Text style={styles.fontText3}>
          {packageName}{' '}
          <Text style={[styles.fontText4, {color: colours.primaryWhite}]}>
            ({packageAuction} BID tickets)
          </Text>
        </Text>
      </View>
      <View style={styles.detailsCon}>
        <View style={styles.detailsInCon}>
          <Text style={styles.fontText4}>
            The {packageName} plan includes {packageAuction} auctions up to{' '}
            {packageValidity} Day(s)
          </Text>
        </View>
        <View style={styles.detailsInCon}>
          <Text style={styles.fontText4}>{packageAuction} Auctions</Text>
        </View>
        <View style={[styles.detailsInCon, {borderBottomWidth: 0}]}>
          <Text style={[styles.fontText4]}>
            {packageValidity} day(s) Pack validity
          </Text>
        </View>
      </View>
      <View style={styles.buttonCon}>
        <AuthButton
          OnPress={() => getRazorpayInfo()}
          ButtonText={'BUY NOW'}
          ButtonHeight={4}
          ButtonWidth={80}
          FirstColor={colours.blue}
          SecondColor={colours.primaryBlue}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  PackageBack: {
    width: windowWidth * (90 / 100),
    height: windowWidth * (60 / 100),
    backgroundColor: colours.primaryWhite,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: colours.blue,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.26,
    shadowRadius: 6.68,
    elevation: 7,
    resizeMode: 'stretch',
  },
  priceCon: {
    width: windowWidth * (90 / 100),
    height: windowWidth * (12 / 100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameCon: {
    width: windowWidth * (49 / 100),
    height: windowWidth * (9 / 100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCon: {
    width: windowWidth * (90 / 100),
    height: windowWidth * (25 / 100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsInCon: {
    width: windowWidth * (75 / 100),
    // height: windowWidth * (8 / 100),
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCon: {
    width: windowWidth * (90 / 100),
    height: windowWidth * (15 / 100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  box1: {
    width: windowWidth * (85 / 100),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  linerBox: {
    width: windowWidth * (30 / 100),
    height: windowHeight * (10 / 100),
    backgroundColor: 'red',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontText1: {
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(20),
    color: colours.primaryWhite,
  },
  fontText3: {
    fontFamily: 'Poppins-Bold',
    fontSize: getFontontSize(14),
    color: colours.primaryWhite,
    paddingBottom: 0,
  },
  fontText4: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(13),
    color: colours.lightBlue,
  },
  fontText5: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(14),
    color: colours.lightGrey,
  },
  fontText6: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryWhite,
  },
});

export default Packagecard;
