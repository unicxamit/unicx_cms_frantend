import processLogin from "../../form-processing/login";
import { formType } from "../../../globals/constants";
import { useNavigate } from "react-router-dom";
import { canRoute, candidate, empRoute, employer } from "../../../globals/route-names";
import { useState } from "react";
import ActionButton from "../ui/action-button";

function SignInPopup() {

    const navigate = useNavigate();
    const [canusername, setCanUsername] = useState('guest');
    const [empusername, setEmpUsername] = useState('admin');
    const [password, setPassword] = useState('12345');

    const handleCandidateLogin = (event) => {
        event.preventDefault();
        loginCandidate();
    }

    const handleEmployerLogin = (event) => {
        event.preventDefault();
        loginEmployer();
    }

    const loginCandidate = () => {
        processLogin(
            {
                type: formType.LOGIN_CANDIDATE,
                username: canusername,
                password: password
            },
            (valid) => {
                if (valid) {
                    moveToCandidate();
                } else {
                    // show error
                    console.log('error');
                }
            }
        );
    }

    const loginEmployer = () => {
        processLogin(
            {
                type: formType.LOGIN_EMPLOYER,
                username: empusername,
                password: password
            },
            (valid) => {
                if (valid) {
                    moveToEmployer();
                } else {
                    // show error
                    console.log('error');
                }
            }
        );
    }

    const moveToCandidate = () => {
        navigate(canRoute(candidate.DASHBOARD));
    }

    const moveToEmployer = () => {
        navigate(empRoute(employer.DASHBOARD));
    }

    return (
        <>
            <div className="modal fade twm-sign-up" id="sign_up_popup2" aria-hidden="true" aria-labelledby="sign_up_popupLabel2" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        {/* <form> */}
                        <div className="modal-header">
                            <h2 className="modal-title" id="sign_up_popupLabel2">Login</h2>
                            <p>Login and get access to all the features of Jobzilla</p>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="twm-tabs-style-2">
                                <ul className="nav nav-tabs" id="myTab2" role="tablist">
                                    {/*Login Candidate*/}
                                    <li className="nav-item">
                                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#login-candidate" type="button"><i className="fas fa-user-tie" />Candidate</button>
                                    </li>
                                    {/*Login Employer*/}
                                    <li className="nav-item">
                                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#login-Employer" type="button"><i className="fas fa-building" />Employer</button>
                                    </li>
                                </ul>
                                <div className="tab-content" id="myTab2Content">
                                    {/*Login Candidate Content*/}
                                    <form onSubmit={handleCandidateLogin} className="tab-pane fade show active" id="login-candidate">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="form-group mb-3">
                                                    <input name="username"
                                                        type="text"
                                                        required
                                                        className="form-control"
                                                        placeholder="Usearname*"
                                                        value={canusername}
                                                        onChange={(event) => {
                                                            setCanUsername(event.target.value);
                                                        }} />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="form-group mb-3">
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        className="form-control"
                                                        required
                                                        placeholder="Password*"
                                                        value={password}
                                                        onChange={(event) => {
                                                            setPassword(event.target.value);
                                                        }} />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="form-group mb-3">
                                                    <div className=" form-check">
                                                        <input type="checkbox" className="form-check-input" id="Password3" />
                                                        <label className="form-check-label rem-forgot" htmlFor="Password3">Remember me <a href="#">Forgot Password</a></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">

                                                <button type="submit"
                                                    className="site-button"
                                                    data-bs-dismiss="modal"
                                                >
                                                    Log in
                                                </button>

                                                <div className="mt-3 mb-3">Don't have an account ?
                                                    <ActionButton
                                                        as="button"
                                                        type="button"
                                                        variant="liquid-glass"
                                                        className="twm-backto-login"
                                                        data-bs-target="#sign_up_popup"
                                                        data-bs-toggle="modal"
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Sign Up
                                                    </ActionButton>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {/*Login Employer Content*/}
                                    <form onSubmit={handleEmployerLogin} className="tab-pane fade" id="login-Employer">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="form-group mb-3">
                                                    <input
                                                        name="username"
                                                        type="text"
                                                        required
                                                        className="form-control"
                                                        placeholder="Usearname*"
                                                        value={empusername}
                                                        onChange={(event) => {
                                                            setEmpUsername(event.target.value);
                                                        }} />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="form-group mb-3">
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        className="form-control"
                                                        required
                                                        placeholder="Password*"
                                                        value={password}
                                                        onChange={(event) => {
                                                            setPassword(event.target.value);
                                                        }} />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="form-group mb-3">
                                                    <div className=" form-check">
                                                        <input type="checkbox" className="form-check-input" id="Password4" />
                                                        <label className="form-check-label rem-forgot" htmlFor="Password4">Remember me <a href="#">Forgot Password</a></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">

                                                <button
                                                    type="submit"
                                                    className="site-button"
                                                    data-bs-dismiss="modal"
                                                >
                                                    Log in
                                                </button>

                                                <div className="mt-3 mb-3">Don't have an account ?
                                                    <ActionButton
                                                        as="button"
                                                        type="button"
                                                        variant="liquid-glass"
                                                        className="twm-backto-login"
                                                        data-bs-target="#sign_up_popup"
                                                        data-bs-toggle="modal"
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Sign Up
                                                    </ActionButton>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <span className="modal-f-title">Login or Sign up with</span>
                            <ul className="twm-modal-social">
                                <li><a href="https://www.facebook.com/" className="facebook-clr"><i className="fab fa-facebook-f" /></a></li>
                                <li><a href="https://www.twitter.com/" className="twitter-clr"><i className="fab fa-twitter" /></a></li>
                                <li><a href="https://in.linkedin.com/" className="linkedin-clr"><i className="fab fa-linkedin-in" /></a></li>
                                <li><a href="https://www.google.com/" className="google-clr"><i className="fab fa-google" /></a></li>
                            </ul>
                        </div>
                        {/* </form> */}
                    </div>
                </div>
            </div >
        </>
    )
}

export default SignInPopup;
