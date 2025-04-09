import { theme } from '@/constants/theme';
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

interface TermsAndConditionsModalProps {
    visible: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
    visible,
    onAccept,
    onDecline,
}) => {
    const [isChecked, setIsChecked] = useState(false);
    const theme = useTheme();

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const handleAccept = () => {
        if (isChecked) {
            onAccept();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onDecline}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Terms and Conditions</Text>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.sectionTitle}>1. OUR SERVICES</Text>
                        <Text style={styles.content}>
                            The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.
                        </Text>
                        <Text style={styles.content}>
                            The Services are not tailored to comply with industry-specific regulations (Health Insurance Portability and Accountability Act (HIPAA), Federal Information Security Management Act (FISMA), etc.), so if your interactions would be subjected to such laws, you may not use the Services. You may not use the Services in a way that would violate the Gramm-Leach-Bliley Act (GLBA).
                        </Text>

                        <Text style={styles.sectionTitle}>2. INTELLECTUAL PROPERTY RIGHTS</Text>
                        <Text style={styles.subTitle}>Our intellectual property</Text>
                        <Text style={styles.content}>
                            We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
                        </Text>
                        <Text style={styles.subTitle}>Your use of our Services</Text>
                        <Text style={styles.content}>
                            Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to:
                        </Text>
                        <Text style={styles.content}>
                            • access the Services; and{'\n'}
                            • download or print a copy of any portion of the Content to which you have properly gained access{'\n'}
                            solely for your personal, non-commercial use.
                        </Text>

                        <Text style={styles.sectionTitle}>3. USER REPRESENTATIONS</Text>
                        <Text style={styles.content}>
                            By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not under the age of 13; (5) you are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Services; (6) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (7) you will not use the Services for any illegal or unauthorized purpose; and (8) your use of the Services will not violate any applicable law or regulation.
                        </Text>

                        <Text style={styles.sectionTitle}>4. USER REGISTRATION</Text>
                        <Text style={styles.content}>
                            You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                        </Text>

                        <Text style={styles.sectionTitle}>5. PROHIBITED ACTIVITIES</Text>
                        <Text style={styles.content}>
                            You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                        </Text>
                        <Text style={styles.content}>
                            As a user of the Services, you agree not to:
                        </Text>
                        <Text style={styles.content}>
                            • Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.{'\n'}
                            • Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.
                        </Text>

                        <Text style={styles.sectionTitle}>6. USER GENERATED CONTRIBUTIONS</Text>
                        <Text style={styles.content}>
                            The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions").
                        </Text>
                        <Text style={styles.content}>
                            Contributions may be viewable by other users of the Services and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary.
                        </Text>

                        <Text style={styles.sectionTitle}>7. CONTRIBUTION LICENSE</Text>
                        <Text style={styles.content}>
                            By posting your Contributions to any part of the Services or making Contributions accessible to the Services by linking your account from the Services to any of your social networking accounts, you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such Contributions.
                        </Text>

                        <Text style={styles.sectionTitle}>8. GUIDELINES FOR REVIEWS</Text>
                        <Text style={styles.content}>
                            We may provide you areas on the Services to leave reviews or ratings. When posting a review, you must comply with the following criteria:
                        </Text>
                        <Text style={styles.content}>
                            • You should have firsthand experience with the person/entity being reviewed{'\n'}
                            • Your reviews should not contain offensive profanity, or abusive, racist, offensive, or hateful language{'\n'}
                            • Your reviews should not contain discriminatory references based on religion, race, gender, national origin, age, marital status, sexual orientation, or disability{'\n'}
                            • Your reviews should not contain references to illegal activity{'\n'}
                            • You should not be affiliated with competitors if posting negative reviews{'\n'}
                            • You should not make any conclusions as to the legality of conduct{'\n'}
                            • You may not post any false or misleading statements{'\n'}
                            • You may not organize a campaign encouraging others to post reviews, whether positive or negative
                        </Text>

                        <Text style={styles.sectionTitle}>9. MOBILE APPLICATION LICENSE</Text>
                        <Text style={styles.subTitle}>Use License</Text>
                        <Text style={styles.content}>
                            If you access the Services via the App, then we grant you a revocable, non-exclusive, non-transferable, limited right to install and use the App on wireless electronic devices owned or controlled by you, and to access and use the App on such devices strictly in accordance with the terms and conditions of this mobile application license contained in these Legal Terms.
                        </Text>
                        <Text style={styles.subTitle}>Apple and Android Devices</Text>
                        <Text style={styles.content}>
                            The following terms apply when you use the App obtained from either the Apple Store or Google Play (each an "App Distributor") to access the Services:
                        </Text>
                        <Text style={styles.content}>
                            • The license granted to you for our App is limited to a non-transferable license to use the application on a device that utilizes the Apple iOS or Android operating systems{'\n'}
                            • We are responsible for providing any maintenance and support services with respect to the App{'\n'}
                            • App Distributors have no warranty obligation whatsoever with respect to the App
                        </Text>

                        <Text style={styles.sectionTitle}>10. SOCIAL MEDIA</Text>
                        <Text style={styles.content}>
                            As part of the functionality of the Services, you may link your account with online accounts you have with third-party service providers (each such account, a "Third-Party Account") by either: (1) providing your Third-Party Account login information through the Services; or (2) allowing us to access your Third-Party Account, as is permitted under the applicable terms and conditions that govern your use of each Third-Party Account.
                        </Text>
                        <Text style={styles.content}>
                            You represent and warrant that you are entitled to disclose your Third-Party Account login information to us and/or grant us access to your Third-Party Account, without breach by you of any of the terms and conditions that govern your use of the applicable Third-Party Account.
                        </Text>

                        <Text style={styles.sectionTitle}>11. THIRD-PARTY WEBSITES AND CONTENT</Text>
                        <Text style={styles.content}>
                            The Services may contain (or you may be sent via the Site or App) links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ("Third-Party Content").
                        </Text>
                        <Text style={styles.content}>
                            Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Services or any Third-Party Content posted on, available through, or installed from the Services.
                        </Text>

                        <Text style={styles.sectionTitle}>12. SERVICES MANAGEMENT</Text>
                        <Text style={styles.content}>
                            We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.
                        </Text>

                        <Text style={styles.sectionTitle}>13. PRIVACY POLICY</Text>
                        <Text style={styles.content}>
                            We care about data privacy and security. Please review our Privacy Policy: https://vibzi.co/privacy. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms.
                        </Text>
                        <Text style={styles.content}>
                            Please be advised the Services are hosted in Singapore. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in Singapore, then through your continued use of the Services, you are transferring your data to Singapore, and you expressly consent to have your data transferred to and processed in Singapore.
                        </Text>

                        <Text style={styles.sectionTitle}>14. TERM AND TERMINATION</Text>
                        <Text style={styles.content}>
                            These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION.
                        </Text>
                        <Text style={styles.content}>
                            If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party.
                        </Text>

                        <Text style={styles.sectionTitle}>15. MODIFICATIONS AND INTERRUPTIONS</Text>
                        <Text style={styles.content}>
                            We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.
                        </Text>
                        <Text style={styles.content}>
                            We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors.
                        </Text>

                        <Text style={styles.sectionTitle}>16. GOVERNING LAW</Text>
                        <Text style={styles.content}>
                            These Legal Terms shall be governed by and defined following the laws of Sri Lanka. Voyage Vibes (PVT) LTD and yourself irrevocably consent that the courts of Sri Lanka shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.
                        </Text>

                        <Text style={styles.sectionTitle}>17. DISPUTE RESOLUTION</Text>
                        <Text style={styles.subTitle}>Informal Negotiations</Text>
                        <Text style={styles.content}>
                            To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a "Dispute" and collectively, the "Disputes"), the Parties agree to first attempt to negotiate any Dispute informally for at least thirty (30) days before initiating arbitration.
                        </Text>
                        <Text style={styles.subTitle}>Binding Arbitration</Text>
                        <Text style={styles.content}>
                            Any dispute arising out of or in connection with these Legal Terms shall be referred to and finally resolved by the International Commercial Arbitration Court under the European Arbitration Chamber according to the Rules of this ICAC.
                        </Text>

                        <Text style={styles.sectionTitle}>18. CORRECTIONS</Text>
                        <Text style={styles.content}>
                            There may be information on the Services that contains typographical errors, inaccuracies, or omissions. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.
                        </Text>

                        <Text style={styles.sectionTitle}>19. DISCLAIMER</Text>
                        <Text style={styles.content}>
                            THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF.
                        </Text>

                        <Text style={styles.sectionTitle}>20. LIMITATIONS OF LIABILITY</Text>
                        <Text style={styles.content}>
                            IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES.
                        </Text>

                        <Text style={styles.sectionTitle}>21. INDEMNIFICATION</Text>
                        <Text style={styles.content}>
                            You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of: (1) your Contributions; (2) use of the Services; (3) breach of these Legal Terms; (4) any breach of your representations and warranties set forth in these Legal Terms; (5) your violation of the rights of a third party.
                        </Text>

                        <Text style={styles.sectionTitle}>22. USER DATA</Text>
                        <Text style={styles.content}>
                            We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services.
                        </Text>

                        <Text style={styles.sectionTitle}>23. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</Text>
                        <Text style={styles.content}>
                            Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing.
                        </Text>

                        <Text style={styles.sectionTitle}>24. MISCELLANEOUS</Text>
                        <Text style={styles.content}>
                            These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision.
                        </Text>
                        <Text style={styles.content}>
                            These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control.
                        </Text>

                        <Text style={styles.sectionTitle}>25. CONTACT US</Text>
                        <Text style={styles.content}>
                            In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at: info@voyagevibes.life
                        </Text>
                        <Text style={styles.content}>
                            You can also reach us by phone at: (+94) 719181154
                        </Text>
                    </ScrollView>
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            status={isChecked ? 'checked' : 'unchecked'}
                            onPress={handleCheckboxChange}
                            color={theme.colors.primary}
                        />
                        <Text style={styles.checkboxLabel}>
                            I have read and agree to the Terms and Conditions
                        </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.declineButton]}
                            onPress={onDecline}>
                            <Text style={styles.declineButtonText}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.acceptButton,
                                !isChecked && styles.disabledButton,
                            ]}
                            onPress={handleAccept}
                            disabled={!isChecked}>
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8,
        color: '#333',
    },
    subTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 5,
        color: '#444',
    },
    scrollView: {
        maxHeight: 400,
        marginBottom: 15,
    },
    content: {
        fontSize: 14,
        marginBottom: 10,
        lineHeight: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        padding: 12,
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: theme.colors.primary,
    },
    declineButton: {
        backgroundColor: 'white',
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    declineButtonText: {
        color: theme.colors.onSurface
    }
});

export default TermsAndConditionsModal; 