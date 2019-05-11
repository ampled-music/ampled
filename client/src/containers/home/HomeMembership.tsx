import * as React from 'react';


export const HomeMembership = () => (
    <div className="home-membership">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1 className="home-membership__title">Membership</h1>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="home-membership__info">
                        <ul>
                            <li>Artists become member-owners of Ampled by creating a free artist page.</li>
                            <li>Supporters of an artist can become member-owners by contributing a one-time membership fee.</li>
                        </ul>
                        <p>All members get one share of Ampled, one vote in how we do business, receive dividends based on Ampled’s profits, and get a bunch of perks and discounts through our partners. </p>                        
                    </div>
                    <button className="home-membership__button btn">Create an Artist Page</button>
                </div>
            </div>
        </div>
    </div>
);
