import {useState, useEffect} from 'react';
import {
  useGetUserConsentQuery,
  useSubmitUserConsentMutation,
} from '../redux/slices/userConsentSlice';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../redux/store';
import {signOut} from '../redux/slices/authSlice';
import {AppDispatch} from '../redux/store';

export const useConsentCheck = () => {
  const [showConsentModal, setShowConsentModal] = useState(false);
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [submitConsent, {isLoading: isSubmitting}] =
    useSubmitUserConsentMutation();

  const {
    data: consentData,
    isLoading: isConsentLoading,
    error: consentError,
  } = useGetUserConsentQuery(user?.userId || '', {
    skip: !user?.userId,
  });

  useEffect(() => {
    console.log('Consent Data:', consentData);
    console.log('User ID:', user?.userId);
    console.log('Consent Error:', consentError);

    if (!isConsentLoading && user?.userId) {
      const is404Error = consentError && (consentError as any).status === 404;

      console.log('Is 404 error:', is404Error);

      if (is404Error) {
        console.log('Showing consent modal - New user (404 error)');
        setShowConsentModal(true);
        return;
      }

      if (consentData?.consent === 'AGREED') {
        console.log('User has agreed to terms according to API');
        setShowConsentModal(false);
        return;
      }
      console.log('Showing consent modal - User has not agreed to terms');
      setShowConsentModal(true);
    }
  }, [consentData, isConsentLoading, user?.userId, consentError]);

  const handleAcceptConsent = async () => {
    if (!user?.userId || !user?.firstName || !user?.lastName || !user?.email) {
      console.log('Missing user data for consent submission');
      return;
    }

    try {
      console.log('Submitting consent...');
      const result = await submitConsent({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        consent: 'AGREED',
      }).unwrap();

      console.log('Consent submitted successfully:', result);
      setShowConsentModal(false);
    } catch (error) {
      console.error('Error submitting consent:', error);
    }
  };

  const handleDeclineConsent = async () => {
    console.log('Consent declined - logging out user');
    setShowConsentModal(false);
    dispatch(signOut());
  };

  return {
    showConsentModal,
    handleAcceptConsent,
    handleDeclineConsent,
    isSubmitting,
  };
};
