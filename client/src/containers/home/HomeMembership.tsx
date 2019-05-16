import * as React from 'react';


export const HomeMembership = () => (
    <div className="home-membership">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1 className="home-membership__title">We own it</h1>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="home-membership__info">
                        <p>We’re a co-op, which means we are 100% owned by the artists, workers, and community that rely on Ampled. Become a member-owner of Ampled by creating an artist page and inviting your community to support you.</p>

                        <p>Artists on Ampled receive one share, one vote in how we do business, dividends based on Ampled’s profits, and get a bunch of perks and discounts through our partners. </p>                        
                    </div>
                    <a href="http://ampled.com/create-an-artist-page"><button className="home-membership__button btn">Create an Artist Page</button></a>
                </div>
            </div>
        </div>
    </div>
);
