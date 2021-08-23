import { useContext, useEffect } from "react";
import AppBar from "../../components/AppBar";
import { AuthContext } from "../../context/auth";

const TOU = ({ setOpenModal}) => {

    const { setPathname } = useContext(AuthContext)
    useEffect(() => {
        setPathname("/settings")
    }, [])

    return (<div className="legal">
        {!setOpenModal && <AppBar title={"Term Of Use"} />}
        <div>
        <h1>About Us <br /> 
        Welcome to Curious!
        </h1>
        <p>
        These Terms of Use govern your use of Curious and provide information about the
        Curious Service, outlined below. When user creates an Curious account or use Curious, user agree to these terms
        </p>
        <h1>The Curious Service</h1>

        <p>
        The Service includes all of the Curious products, features, applications, services,
        technologies, and software that we provide to advance Curious's mission:
        </p>

        <ul>
            <li>
            User privacy is of utmost priority.
            </li>
            <li>
            User Privacy is how we build product services, so Users can fully trust and focus
             on building meaningful connections.
            </li>
            <li>
            The Curious community has a team to maintain the security of user data, so that
            users feel safe after providing their personal data.
            </li>
            <li>
            The Curious community really appreciates when users provide personal
            information, and we do not consider this to be minor.
            </li>
            <li>
            When registering to use the Curious Community Service, the User must provide 
            right personal information and upon request from the Curious Community, the 
            User must enter the verification code that has been provided via email / 
            message after registering to verify the accuracy of the information provided.
            </li>
            <li>
            The user agrees that the Curious Community has the right, when providing the 
            Service, to place any kind of commercial advertisement in any form or other type 
            of commercial information. Users also agree to receive promotions or other 
            relevant commercial information from the Curious Community via email or other methods.
            </li>
        </ul>
        <h1>User Commitments</h1>
        <p>
        We require you to make the below commitments to us.
        </p>
        <p>
        Who Can Use Curious. We want our Service to be as open and inclusive as possible, 
        but we also want it to be safe, secure, and in accordance with the law. So, we need you to 
        commit to a few restrictions in order to be part of the Curious community.
        </p>
        <ul>
            <li>
            User must be at least 17 years old.
            </li>
            <li>
            User must not be a convicted sex offender.
            </li>
            <li>
            User must obey applicable law.  
            </li>
        </ul>
        
        <h1>User Permissions to the Curious Community!</h1>
        <ul>
            <li>
            The Curious Community has the right to review and monitor the use of the 
            Curious Community Service. If the User violates any of the conditions mentioned 
            when using the Service, the Curious Community will remove the content posted by the 
            User, or suspend or terminate the User's right to use the Curious Service to reduce the impact of the User's inappropriate behavior without requiring the consent of the User.
            </li>
            <li>
            Any disclaimer, notification or warning regarding the use of certain Curious Community Services, 
            issued via various methods (including, announcement via email or SMS) will be deemed part of this Agreement. 
            Use of such Web Services will be deemed as confirmation of User acceptance of the content 
            of the disclaimers, notifications and warnings.
            </li>
            <li>
            The Curious Community does not claim ownership of User content, but the User 
            grants the Curious Community a license to use it.
            </li>
            <li>
            Nothing has changed in User rights to their content. The Curious Community does not 
            claim ownership of the content that Users Post. When sharing, posting, or uploading content 
            related to Curious Community Services
            </li>
            <li>
            User hereby grants a license to the Curious Community which is non-exclusive, royalty free and 
            applies to hosting, using, distributing, changing and running. This license will expire when User 
            content is removed from our system. Users can delete content individually or delete accounts.
            </li>
        </ul>
        <h1>Disclaimers / User Statements</h1>
        <ul>
            <li>
            The user expressly agrees that the user will be fully responsible for all risks 
            involved in using the Curious Community Service.
            </li>
            <li>
            Users will also be responsible for any and all consequences arising from the use of 
            the Curious Community Services, and the Curious Community will not be responsible for it.
            </li>
            <li>
            The Curious Community is not responsible for the content of any linked sites or any links contained in linked sites.    
            </li>
            <li>
            The Curious Community will not be responsible or liable, directly or indirectly, 
            for loss or damage in compliance to how user is using the service.
            </li>
            <li>
            The Curious Community is not responsible for the content of any pages directed by Users 
            via external links which are not under the control of the Curious Community.
            </li>
            <li>
            The Curious Community is not responsible for interruptions or other deficiencies in the Service 
            caused by force majeure, or which are beyond the control of the Curious Community. However, 
            as far as possible, the Curious Community will make reasonable efforts to minimize losses and impacts caused to Users.
            </li>
            <li>
            The Curious Community is not responsible for interruptions or other deficiencies in the 
            Service caused by force majeure, or which are beyond the control of the Curious Community. 
            However, as far as possible, the Curious Community will make reasonable efforts to minimize losses and impacts caused to Users.
            </li>
            <li>
            The user agrees that the Curious Community will not be responsible for any losses arising 
            from the inadequacy of the quality of the product or service.
            </li>
            <li>
            Services are provided to Users free of charge;
            </li>
            <li>
            Any product or service is not all free offered to Users
            </li>
        </ul>
        <h1>Compensation</h1>
        <p>
        The user agrees to protect the interests of other users. If the User violates the relevant 
        laws and regulations, or any of the provisions of this Agreement, and thereby causes damage to the 
        Curious Community or other third parties, the User agrees to be fully responsible for compensation for any damage.
        </p>
        <h1>Termination of Web Services Use</h1>
        <ul>
            <li>
            Users have the right to discontinue use of the Web Service if they do not agree to changes 
            made by the Curious Community to the relevant terms of this Agreement. Continued use of the 
            Service will be deemed acceptance of such changes
            </li>
            <li>
            Under the terms of this Agreement, all notifications sent to users by the Curious Community can be sent via email page 
            announcements, text messages or posting such notifications will be deemed to have been received by the recipient on the delivery date.
            </li>
        </ul>
        <h1>Other Provisions</h1>
        <ul>
            <li>
            What is included in this provision is the Rights and Obligations between the User and the Curious Community.
            </li>
            <li>
            Users will not transfer their rights and obligations under these terms to other people and / or 
            third parties without consent of the Curious Community.
            </li>
            <li>
            User can appoint someone (Heir) to manage User Accounts with the consent of the Curious Community.
            </li>
            <li>
            These terms and conditions constitute the entire agreement of the agreed items and other relevant 
            matters between the two parties. Apart from those specified by this Agreement, no other rights are granted 
            to either of the Parties to this Agreement.
            </li>
            <li>
            If any of the terms and Conditions in this Agreement are canceled or cannot be implemented, 
            in whole or in part, for any reason, the other provisions in this Agreement will remain valid and 
            binding between the User and the Curious Community. 
            </li>
        </ul>
        </div>
        
    </div>);
}
 
export default TOU;