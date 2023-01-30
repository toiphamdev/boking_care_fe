import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Tippy from '@tippyjs/react/headless';

import { languages } from '../../utils';
import { changeLaguageApp } from '../../store/actions';
import { path } from '../../utils';
import SearchResult from '../Patients/Search/SearchResult';
import "./HomeHeader.scss"
import { getSearchResult } from '../../services/userService';
import { toast } from 'react-toastify';


class HomeHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchResultClinic:[],
            searchResultSpecialty:[],
            searchValue:'',
            isLoading:false,
            isShowSearchBox:false,
        }
    }
    changeLaguage = (lang) => {
        this.props.changeLaguageAppRedux(lang)
    }

    returnToHome = ()=>{
        if(this.props.history){
            this.props.history.push('/home');
        }
    }
    
    handleOnChangeSearchInput = (e)=>{
        this.setState({
            searchValue: e.target.value
        })

    }

    handleKeyEnter = (e)=>{
        if(e.key === 'Enter'){
            this.setState({
                isLoading: true,
                isShowSearchBox: true
            })
            this.getSearch()
        }
    }

    getSearch = async ()=>{
       let res = await getSearchResult(this.state.searchValue,'less');
       if(res && res.errCode === 0){

            if(!res.dataClinic &&!res.dataSpecialty){
                return;
            }else{
                this.setState({
               searchResultClinic:res.dataClinic,
               searchResultSpecialty: res.dataSpecialty,
               isLoading:false
           })
            }
       }
    }

    handleClearSearch = ()=>{
        this.setState({
            searchValue: ''
        })
    }

    handleCloseSearchBox = ()=>{
        this.setState({
            isShowSearchBox: false
        })
    }

    handleOpenSearchBox = ()=>{
        this.setState({
            isShowSearchBox: true
        })
    }


    render() {
        let {language,isLoggedIn} = this.props;
        let {searchResultClinic,searchResultSpecialty,isShowSearchBox,searchValue,isLoading} = this.state;
        return (
            <Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fas fa-bars list-icon"></i>
                            <span 
                                className='header-logo'
                                onClick={()=>this.returnToHome()}
                            >
                            </span>
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div className='child-content-title'><b><FormattedMessage id="home-header.speciality" /></b></div>
                                <div className='child-content-text'><FormattedMessage id="home-header.search-doctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div className='child-content-title'><b><FormattedMessage id="home-header.facility" /></b></div>
                                <div className='child-content-text'><FormattedMessage id="home-header.clinic" /></div>
                            </div>
                            <div className='child-content'>
                                <div className='child-content-title'><b><FormattedMessage id="home-header.doctor" /></b></div>
                                <div className='child-content-text'><FormattedMessage id="home-header.choose-doctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div className='child-content-title'><b><FormattedMessage id="home-header.package" /></b></div>
                                <div className='child-content-text'><FormattedMessage id="home-header.general" /></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='flat'>
                                <Tippy
                                    delay={500}
                                    hideOnClick={false}
                                    onClickOutside={this.handleCloseSearchBox}
                                    interactive={true}
                                    placement={'bottom'}
                                    render={attrs => (
                                    <div className="box" tabIndex="-1" {...attrs}>
                                        {
                                            isLoggedIn ?
                                            <>
                                                <button className='box-btn'><Link to={path.SYSTEM}><FormattedMessage id="home-header.service" /></Link></button>
                                                <button className='box-btn' onClick={()=>{language === languages.EN ? this.changeLaguage(languages.VI):this.changeLaguage(languages.EN)}}>{language === languages.EN ? 'English':'Vietnamese'}</button>
                                                <button className='support box-btn'>
                                                    <i className="fas fa-question-circle support-icon"></i>
                                                    <FormattedMessage id="home-header.support" />
                                                </button>
                                            </>:
                                            <>
                                                <button className='box-btn'><Link to={path.LOGIN}><FormattedMessage id="home-header.sign-in" /></Link></button>
                                                <button className='box-btn'><Link to={path.REGISTER}><FormattedMessage id="home-header.register" /></Link></button>
                                                <button className='box-btn' onClick={()=>{language === languages.EN ? this.changeLaguage(languages.VI):this.changeLaguage(languages.EN)}}>{language === languages.EN ? 'English':'Vietnamese'}</button>
                                            </>
                                        }
                                    </div>
                                    )}
                                >
                                    {
                                        isLoggedIn ?
                                            <div className='user-name'>{language === languages.VI ? `Xin chào, ${this.props.userInfo.firstName} ${this.props.userInfo.lastName} !`:`Hi, ${this.props.userInfo.lastName} ${this.props.userInfo.firstName} !`}</div>:
                                            <div className='user-name'><FormattedMessage id="home-header.sign-in" /></div>
                                    }
                                </Tippy>
                        
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.props.isShowBanner === true &&
                <div className='home-header-banner'>
                    <div className='title'>
                        <h1>
                            <FormattedMessage id="home-header.title1" />
                            <br />
                            <FormattedMessage id="home-header.title2" />
                        </h1>
                    </div>
                     <Tippy
                        visible = {isShowSearchBox && searchResultClinic.length>0 || isShowSearchBox && searchResultSpecialty.length>0 }
                        onClickOutside = {()=>this.handleCloseSearchBox()}
                        hideOnClick={false}
                        interactive={true}
                        placement={'bottom'}
                        render={attrs => (
                        <div className="search-box" tabIndex="-1" {...attrs}>
                            <h4 className='search-box-title'><FormattedMessage id="menu.admin.clinic"/></h4>
                            {
                                searchResultClinic.length > 0 ?
                                searchResultClinic.map((item,index)=>{
                                    return <SearchResult key={index} image={item.image} clinic id={item.id} name={item.name}/>
                                }):
                                <span><FormattedMessage id="patient.search.not-found"/></span>
                            }
                            <h4 className='search-box-title'><FormattedMessage id="menu.admin.specialty"/></h4>
                            {
                                searchResultSpecialty.length > 0 ?
                                searchResultSpecialty.map((item,index)=>{
                                    return <SearchResult key={index} image={item.image} specialty id={item.id} name={item.name}/>
                                }):
                                <span><FormattedMessage id="patient.search.not-found"/></span>
                            }
                        </div>
                        )}
                    >

                        <div className='search'>
                            <i className="fas fa-search" ></i>
                            <input onFocus={()=> this.handleOpenSearchBox()} onKeyPress={(e)=>this.handleKeyEnter(e)}
                             value={searchValue} onChange={(e)=>this.handleOnChangeSearchInput(e)} placeholder={language === languages.VI ? "Tìm chuyên khoa, phòng khám":"Find specialties and clinics"} />
                            {
                                !isLoading && searchValue && <span className='clear-search-btn' onClick={()=> this.handleClearSearch()} ><i className="fas fa-times-circle"></i></span>
                            }
                            {
                                isLoading && <span className='load-search-btn' ><i class="fas fa-spinner"></i></span>
                            }
                        </div>
                    </Tippy>
                    <div className='options'>
                        <div className='option-child'>
                            <div className='option-icon'>
                                <i className="fas fa-hospital"></i>
                            </div>
                            <div className='option-title'>
                                <FormattedMessage id="home-header.option-child1_1" /><br />
                                <FormattedMessage id="home-header.option-child1_2" />
                            </div>
                        </div>
                        <div className='option-child'>
                            <div className='option-icon'>
                                <i className="fas fa-mobile-alt"></i>
                            </div>
                            <div className='option-title'>
                                <FormattedMessage id="home-header.option-child2_1" /><br />
                                <FormattedMessage id="home-header.option-child2_2" />
                            </div>
                        </div>
                        <div className='option-child'>
                            <div className='option-icon'>
                                <i class="fas fa-heartbeat"></i>
                            </div>
                            <div className='option-title'>
                                <FormattedMessage id="home-header.option-child3_1" /><br />
                                <FormattedMessage id="home-header.option-child3_2" />
                            </div>
                        </div>
                        <div className='option-child'>
                            <div className='option-icon'>
                                <i className="fas fa-flask"></i>
                            </div>
                            <div className='option-title'>
                                <FormattedMessage id="home-header.option-child4_1" /><br />
                                <FormattedMessage id="home-header.option-child4_2" />
                            </div>
                        </div>
                        <div className='option-child'>
                            <div className='option-icon'>
                                <i class="fas fa-brain"></i>
                            </div>
                            <div className='option-title'>
                                <FormattedMessage id="home-header.option-child5_1" /><br />
                                <FormattedMessage id="home-header.option-child5_2" />
                            </div>
                        </div>
                        <div className='option-child'>
                            <div className='option-icon'>
                                <i className="fas fa-notes-medical"></i>
                            </div>
                            <div className='option-title'>
                                <FormattedMessage id="home-header.option-child6_1" /><br />
                                <FormattedMessage id="home-header.option-child6_2" />
                            </div>
                        </div>
                        <div className='option-child'>
                            <div className='option-icon'>
                                <i className="fas fa-hospital"></i>
                            </div>
                            <div className='option-title'>
                                <FormattedMessage id="home-header.option-child7" />

                            </div>

                        </div>
                        <div className='option-child'>
                            <div className='option-icon'>
                                <i className="fas fa-ambulance"></i>
                            </div>
                            <div className='option-title'>
                                <FormattedMessage id="home-header.option-child8" />
                            </div>
                        </div>

                    </div>
                </div>
                }
            </Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLaguageAppRedux: (lang) => dispatch(changeLaguageApp(lang))
    };
};

export default withRouter( connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
