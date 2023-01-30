import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import * as actions from '../../../store/actions';
import { languages } from '../../../utils';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';
import './DetailDoctor.scss';
import LikeAndShare from '../SocialPlugin/LikeAndShare';
import Comment from '../SocialPlugin/Comment';





class DetailDoctor extends Component {
    constructor(props){
        super(props);
        this.state={
            detailDoctor:{}
        }
    }
    async componentDidMount(){
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            await this.props.getDetailDoctor(this.props.match.params.id)
        }
    }
    componentDidUpdate(prevProps,prevState){
        if(prevProps.doctorSelected !==  this.props.doctorSelected){
            this.setState({
                detailDoctor: this.props.doctorSelected
            })
        }
    }
    render() {
        let {detailDoctor} = this.state;
        let nameVi = '';
        let nameEn = '';
        if(detailDoctor && detailDoctor.positionData){
            nameVi = `${detailDoctor.firstName} ${detailDoctor.lastName}`;
            nameEn = `${detailDoctor.lastName} ${detailDoctor.firstName}`;
        }
        let currentURL = process.env.REACT_APP_IS_LOCALHOST == 1?
        "https://swolf-bot-tv.herokuapp.com/": window.location.href;
        return (
            <Fragment>
                <HomeHeader isShowBanner={false}/>
                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div 
                            className='content-left'
                            style={{ backgroundImage: `url(${detailDoctor.image? detailDoctor.image:''})`, color: '#fff' }}
                        >
                        </div>
                        <div className='content-right'>
                            {
                                detailDoctor.Markdown && 
                                <>
                                <h3 className='content-right-title'>
                                    {
                                        this.props.language === languages.VI?`${detailDoctor.positionData.valueVi} ${nameVi}`:`${detailDoctor.positionData.valueEn} ${nameEn}`
                                    }
                                </h3> 
                                <p className='content-right-content'>{detailDoctor.Markdown.description}</p>
                                </>
                            }
                            <div className='like-share-plugin'>
                                <LikeAndShare dataHref={currentURL}/>

                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                            <div className='content-left'>
                                <DoctorSchedule
                                    detailDoctorId={this.state.detailDoctor && this.state.detailDoctor.id ? this.state.detailDoctor.id : -1}
                                />
                            </div>
                            <div className='content-right'>
                                <DoctorExtraInfor
                                    detailDoctorId={this.state.detailDoctor && this.state.detailDoctor.id ? this.state.detailDoctor.id : -1}
                                />
                            </div>
                    </div>
                    <div className='detail-doctor'>
                            {
                                detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML &&
                                <div dangerouslySetInnerHTML={{__html: detailDoctor.Markdown.contentHTML}}></div>
                            }
                    </div>
                    <div className='comment-doctor'>
                        <Comment dataHref={currentURL} width="100%"/>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
       doctorSelected : state.admin.doctorSelected,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDetailDoctor:(id)=>dispatch(actions.getDetailDoctor(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
