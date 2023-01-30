import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import './SearchResult.scss'





class SearchResult extends Component {
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
        let {image,name,id,clinic,specialty} = this.props
        return(
            <>
                {
                    image && name && clinic &&
                    <Link className='search-item' to={`/detail-clinic/${id}`}>
                        <img src={image} className='search-item-image'></img>
                        <span className='search-item-title'>{name}</span>
                    </Link>
                }
                {
                     image && name && specialty &&
                    <Link className='search-item' to={`/detail-specialty/${id}`}>
                        <img src={image} className='search-item-image'></img>
                        <span className='search-item-title'>{name}</span>
                    </Link>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
