import { useContext, useEffect } from "react";
import AppBar from "../../components/AppBar";
import { AuthContext } from "../../context/auth";

const PrivacyPolicy = () => {
  const { setPathname } = useContext(AuthContext)
    useEffect(() => {
        setPathname("/settings")
    }, [])
    return (
        <div className="legal" style={{padding:10}}>
            <AppBar title="Privacy Policy" />
            <h1>Data Policy</h1>
            <p>
            Anyone around the world can see Curious. You can also use Curious safely 
            because Curious is an Anonymous application, where you can feel safe telling 
            stories or expressing any anxiety you feel. When you’re using Curious, we receive 
            some personal information from you such as the type of device you use and your IP address. 
            You can choose to share additional information with us such as your email address, phone number, 
            gender, place and date of birth. We use this information for things like maintaining account security.
            </p>
            <h1>Privacy Policy</h1>
            <p>
            This privacy policy applies to how the Curious Community handles personally identifiable 
            information when users log in to websites and servers, as well as other personally identifiable 
            information that is shared with our business partners. This privacy policy does not apply to 
            organizations that do not belong to the Curious Community or non-Curious employees.
            </p>
            <h1>Collection and Use of Information</h1>
            <p>
            The Curious Party will collect your personal information when you register for a Curious account, 
            use other Curious community products or services, or participate in promotions. The Curious Community 
            also collects personally identifiable information from our business partners. When you register a 
            Curious community account, we will ask for your name, email address, mobile number, username, password, 
            place of birth date and gender. Once you have successfully registered with the Curious community, we will 
            be able to identify you when you log into the server.
            </p>
            <h1>Disclosure and Information Sharing</h1>
            <p>
            When you submit information, it will be considered as your consent to the Curious Community regarding the collection, 
            storage, use and disclosure of your personal. The Curious Community will never display, rent or sell your personal 
            information to others.
            </p>
            <h1>The following circumstances are excluded:</h1>
            <ul>
                <li>
                When we are asked to comply with subpoenas, court orders, or to comply with legal process;
                </li>
                <li>
                When we find that you have violated the terms of use of the Curious community or other services
                </li>
                <li>
                The Curious Community is not responsible for the collection, disclosure and / or use of your personal 
                information that you provide to any third party website.
                </li>
            </ul>
            <h1>Data security</h1>
            <p>
            We take appropriate administrative, technical and physical security measures to protect your Personal Information.
             For example, only authorized employees are permitted to access Personal Information, and they can do so only 
             for authorized business functions. In addition, we use encryption in the transmission of certain Personal Information 
             between your system and ours, and we use firewalls to help prevent unauthorized people from gaining access to your 
             Personal Information. Please note however, that we cannot completely eliminate the security risks associated with the 
             storage and transmission of your Personal Information. And be careful in deciding which information you provide to us. 
             You are responsible for maintaining the confidentiality of your password and account information at all times.
            </p>
            <h1>Security Protection</h1>
            <p>
            Your Curious Community account is password protected to ensure the security of your privacy and information. 
            Under certain conditions, the Curious Community uses a universally accepted SSL encryption system to ensure information security.
            </p>
            <h1>Amendment</h1>
            <p>
            We may update this policy from time to time by publishing new versions on our website.
            You should check this page every now and then to make sure you are satisfied with any changes to this policy.
            </p>
            <h1>Contacts</h1>
            <p>
            If you have any questions about this policy, please contact us via <a href="mailto:dev@curious.me">dev@curious.me</a> 
            </p>
        </div>
    );
}
 
export default PrivacyPolicy;