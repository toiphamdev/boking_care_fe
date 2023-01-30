import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { languages } from '../../../utils';
import 'dotenv/config'






class Comment extends Component {
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    componentDidMount(){
        this.initFacebookSDK();
    }


    componentDidUpdate(prevProps,prevState){
        if(prevProps.language !== this.props.language){
            this.initFacebookSDK();
        }
    }
    
    initFacebookSDK() {
        if (window.FB) {
            window.FB.XFBML.parse();
        }

        let { language } = this.props;
        let locale = language === languages.VI ? 'vi_VN' : 'en_US'
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: process.env.REACT_APP_FACEBOOK_APP_ID,
                cookie: true,  // enable cookies to allow the server to access
                // the session
                xfbml: true,  // parse social plugins on this page
                version: 'v2.5' // use version 2.1
            });
        };
        // Load the SDK asynchronously
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = `//connect.facebook.net/${locale}/sdk.js`;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }


    render() {
        return(
            <>
                <div 
                    className='fb-comments'
                    data-href = {this.props.dataHref}
                    data-width = {this.props.width?this.props.width:''}
                    data-numposts={this.props.numPost?this.props.numPost:5}
                >
                </div>
            </>
        )
        
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);