import * as React from 'react';

interface Props {
    // location: string;
}

class HomeHow extends React.Component<Props, any> {
    render() {
        return (
            <div className="home-how container">

                <div className="row">
                    <div className="col-md-12">
                        <h1 className="home-how__title">
                            How it Works
                        </h1>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-7">
                        <div className="home-for__list">
                            <div className="row home-for__list-item">
                                <div className="col-2">
                                    <div className="home-for__list-item_number">01</div>
                                </div>
                                <div className="col-10">
                                    <div className="home-for__list-item_title">Create a page on ampled and post unique or unreleased content</div>
                                    <div className="home-for__list-item_copy">Free for artists to join. Fans subscribe directly to a particular artist, not the platform. </div>
                                </div>
                            </div>
                            <div className="row home-for__list-item">
                                <div className="col-2">
                                    <div className="home-for__list-item_number">02</div>
                                </div>
                                <div className="col-10">
                                    <div className="home-for__list-item_title">Artists are supported directly by their audience </div>
                                    <div className="home-for__list-item_copy">may also choose to be a 2X or even 10x supporter. Minimum monthly support per fan is $3. An audience member </div>
                                </div>
                            </div>
                            <div className="row home-for__list-item">
                                <div className="col-2">
                                    <div className="home-for__list-item_number">03</div>
                                </div>
                                <div className="col-10">
                                    <div className="home-for__list-item_title">Artists collect monthly recurring revenue</div>
                                    <div className="home-for__list-item_copy">Supporters get a notification when an artist they support  posts something new.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <img className="home-for__list-image" src="" />
                    </div>
                </div>

            </div>
        );
    }
}

export { HomeHow };
