import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


class HandBook extends Component {


    render() {
        return (
            <div className='section-share'>
                <div className='section-title'>
                    <h3>Cẩm nang</h3>
                    <button>Xem thêm</button>
                </div>
                <div className='section-content'>
                    <Slider {...this.props.settings}>
                        <div className='section-body'>
                            <div className='section-img section-hand-book'></div>
                        </div>
                        <div className='section-body section-hand-book'>
                            <h3>Bệnh tiểu đường là gì? Nguyên nhân, dấu hiệu nhận biết và hướng điều trị</h3>
                        </div>
                        <div className='section-body'>
                            <div className='section-img section-hand-book'></div>
                        </div>
                        <div className='section-body section-hand-book'>
                            <h3>Bệnh tiểu đường là gì? Nguyên nhân, dấu hiệu nhận biết và hướng điều trị</h3>
                        </div>
                        <div className='section-body'>
                            <div className='section-img section-hand-book'></div>
                        </div>
                        <div className='section-body section-hand-book'>
                            <h3>Bệnh tiểu đường là gì? Nguyên nhân, dấu hiệu nhận biết và hướng điều trị</h3>
                        </div>
                        <div className='section-body'>
                            <div className='section-img section-hand-book'></div>
                        </div>
                        <div className='section-body section-hand-book'>
                            <h3>Bệnh tiểu đường là gì? Nguyên nhân, dấu hiệu nhận biết và hướng điều trị</h3>
                        </div>
                    </Slider>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
