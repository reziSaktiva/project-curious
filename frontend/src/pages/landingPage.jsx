import React from 'react'
import '../App.css'
import { Col, Row, Button } from 'antd'
import { Grid } from 'semantic-ui-react'

import LoginFacebook from '../components/LoginFacebookButton'
import { signInWithGoogle } from '../util/signInWithGoogle';
import { Link } from 'react-router-dom'

function LandingPage(props) {
    return (
        <div>
            <>
                <Row>
                    <Col span={12}>
                        <div className="landingimage" />
                        <div className="curiouslanding" />

                    </Col>
                    <Col span={12}>
                        <div>
                            <div style={{ marginLeft: 260, marginTop: 240 }}>
                                <h1 style={{ width: 160 }}>Welcome to Curious!</h1>
                                <LoginFacebook props={props} />

                                <Button onClick={signInWithGoogle} className="ui black basic button" style={{ width: 343, height: 45, marginTop: 15, borderRadius: 5 }}>
                                    <i className="google icon"></i>
                                    Continue with Google
                                </Button>

                                <Grid container justify="center" style={{ marginTop: 15 }}>
                                    <Button className="ui secondary basic button" style={{ width: 164, height: 45, marginRight: 15, color: 'black' }}>
                                        <Link to='/register'>
                                            Sign Up
                                        </Link>
                                    </Button>
                                    <Button className="ui secondary basic button" style={{ width: 164, height: 45, color: 'black' }}>
                                        <Link to='login'>
                                            Login
                                        </Link>
                                    </Button>
                                </Grid>
                            </div>

                            <p style={{ marginLeft: 265, marginTop: 30, fontSize: 14 }}>By signing up, you agree to our <span className="terms">Terms & Privacy Policy</span></p>
                            <p style={{ marginLeft: 380, marginTop: 220 }}>&copy; 2020 Curious</p>
                            <Grid style={{ marginLeft: 270, marginTop: 10 }}>


                                <Button type="text" style={{ fontSize: 8 }}>
                                    Terms of Service
                            </Button>
                                <Button type="text" style={{ fontSize: 8 }}>
                                    Privacy Policy
                            </Button>
                                <Button type="text" style={{ fontSize: 8 }}>
                                    Cookie Policy
                            </Button>
                                <Button type="text" style={{ fontSize: 8 }}>
                                    Ads Info
                            </Button>


                            </Grid>
                        </div>
                    </Col>
                </Row>
            </>


        </div>

    )
}

export default LandingPage