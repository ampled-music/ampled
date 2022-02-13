import * as React from 'react';
import { Route } from 'react-router-dom';
import { CloudinaryContext } from 'cloudinary-react';
import { Nav } from './shared/nav/Nav';
import { Footer } from './shared/footer/Footer';
import { config } from '../config';

export const PublicRoute = ({ component: Component, ...rest }) => {
  const randomColor = () => {
    const bgColor = ['#e9c7c6', '#eddfbd', '#baddac', '#cae4e7'];
    return bgColor[Math.floor(Math.random() * bgColor.length)];
  };
  const [color] = React.useState(randomColor());

  const renderComponent = (props) => {
    if (/^\/artist/i.test(props.location?.pathname)) {
      document.body.style.background = 'white';
    } else {
      document.body.style.background = color;
    }

    return (
      <div className="public-routes">
        <div>
          <CloudinaryContext cloudName={config.cloudinary.cloud_name}>
            <Nav match={props.match} history={props.history} />
            <main>
              <Component {...props} />
            </main>
            <Footer match={props.match} />
          </CloudinaryContext>
        </div>
      </div>
    );
  };

  return <Route {...rest} element={renderComponent} />;
};
