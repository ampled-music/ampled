import * as React from 'react';

interface Props {
    //   location: string;
}

class HomeHeader extends React.Component<Props, any> {
    render() {
        return (
            <div className="home-header container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="home-header__info">
                            Ampled is a space where music artists post unreleased, unique, or exclusive content and are directly supported on a monthly basis by their audience.
                        </div>
                        <button className="home-header__button btn">
                            Create an Artist Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export { HomeHeader };
