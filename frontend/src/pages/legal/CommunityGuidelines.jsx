import { Link } from "react-router-dom/cjs/react-router-dom.min";
import AppBar from "../../components/AppBar";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth";
const CG = () => {
    const { setPathname } = useContext(AuthContext)
    useEffect(() => {
        setPathname("/settings")
    }, [])
    return (
        <div className="legal">
            <AppBar title="Community Guidelines" />
            <p>
            We want Curious to continue to be an authentic and safe place for 
            inspiration and expression. Help us foster this community. Post only your 
            own photos and videos and always follow the law. Respect everyone on Curious, don’t spam people or post nudity.
            </p>
            <p>
            We created the Community Guidelines so you can help us foster and protect 
            this amazing community. By using Curious, you agree to these guidelines and our 
            <Link to="/TermOfUse">Terms of Use.</Link> We’re committed to these guidelines and we hope you are too. Overstepping 
            these boundaries may result in deleted content even <p style={{textDecoration: 'uderline'}}>disabled accounts.</p>
            </p>
            <ul>
                <li>
                Share only photos and videos that you’ve taken or have the right to share. As 
                always, you own the content you post on Curious. Remember to post authentic content, 
                and don’t post anything you’ve copied that you don’t have the right to post.
                </li>
                <li>
                Post photos and videos that are appropriate<br /> 
                We know that there are times when people might want to share nude images that are artistic or 
                creative in nature, but for a variety of reasons, we don’t allow nudity on Curious. This includes 
                photos, videos, and some digitally-created content that show sexual intercourse, genitals, and close-ups 
                of fully-nude buttocks. It also includes some photos of female nipples,
                </li>
                <li>
                Foster meaningful interactions.<br />
                Help us stay spam-free by not artificially collecting likes, followers, or shares, posting repetitive 
                comments or content, or repeatedly contacting people for commercial purposes without their consent.
                </li>
                <li>
                Follow the law.<br />
                Curious is not a place to support or praise terrorism, organized crime, or hate groups. 
                Offering sexual services, buying or selling firearms, alcohol, and tobacco products between 
                private individuals, and buying or selling illegal or prescription drugs (even if legal in your region) 
                are also not allowed. Curious also prohibits the sale of live animals between private individuals or selling of 
                endangered species or their parts.
                </li>
                <li>
                Respect other members of the Curious community.<br />
                We want to foster a positive, diverse community. We remove content that contains credible threats or hate speech, 
                content that targets private individuals to degrade or shame them, personal information meant to blackmail or
                harass someone, and repeated unwanted messages. It's never OK to encourage violence or attack anyone based on their race, 
                ethnicity, national origin, sex, gender, gender identity, sexual orientation, religious affiliation, disabilities, or diseases.
                When hate speech is being shared to challenge it or to raise awareness, we may allow it. In those instances, we ask that you 
                express your intent clearly.
                </li>
                <li>
                Respect other members of the Curious community.<br />
                We want to foster a positive, diverse community. We remove content that contains credible 
                threats or hate speech, content that targets private individuals to degrade or shame them, 
                personal information meant to blackmail or harass someone, and repeated unwanted messages. 
                It's never OK to encourage violence or attack anyone based on their race, ethnicity, national origin, 
                sex, gender, gender identity, sexual orientation, religious affiliation, disabilities, or diseases. 
                When hate speech is being shared to challenge it or to raise awareness, we may allow it. In those instances, 
                we ask that you express your intent clearly.
                Maintain our conducive environment.
                </li>
                <li>
                Maintain our conducive environment.<br />
                The curious community is often a place where people facing difficult issues come together to 
                create awareness or find support. We try to do our part by providing education in the app and adding 
                information in the Help Center so people can get the help they need.
                </li>
            </ul>
            <p>
            Because so many different people and age groups use Curious, we may remove videos of intense, 
            graphic HYPERLINK <a target="_blank" href="https://www.facebook.com/communitystandards/graphic_violence">
                "https://www.facebook.com/communitystandards/graphic_violence"</a> violence to make sure 
            Curious stays appropriate for everyone. We understand that people often share this kind of content to condemn, 
            raise awareness or educate. If you do share content for these reasons, we encourage you to caption your photo 
            with a warning about graphic violence. 
            </p>
            <h1>General Terms and Conditions</h1>
            <p>
            This guideline is the agreement between user and Curious. The discussion here replaces all previous 
            written or oral agreements or at the same time written and oral statements between the user and Curious. 
            Curious is not responsible for failure to carry out its obligations under the terms. Curious can change 
            the terms of Community at any time, and we will post them on this page when we provide an update notification. 
            If you do not agree with any changes to these terms, one of the things you can do is to stop using the app, services and website.
            </p>
            <h1>Contact Us</h1>
            <p>If you need help, please contact us via email to dev@curious.me</p>
        </div>
    );
}
 
export default CG;