import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';





class UserInfo extends Component {
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    componentDidMount(){
        
    }


    componentDidUpdate(prevProps,prevState){
        
    }
    


    render() {
        return(
            <>
                hello
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

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
