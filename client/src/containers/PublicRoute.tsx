import * as React from 'react';
import { Route } from 'react-router-dom';
import { CloudinaryContext } from 'cloudinary-react';
import { Nav } from './shared/nav/Nav';

export const PublicRoute = ({ component: Component, ...rest }) => {
  const randomColor = () => {
    const bgColor = ['#e9c7c6', '#eddfbd', '#baddac', '#cae4e7'];
    return bgColor[Math.floor(Math.random() * bgColor.length)];
  };
  const [color] = React.useState(randomColor());

  const renderComponent = (props) => {
    if (props.location?.pathname?.startsWith('/artist/')) {
      document.body.style.background = 'white';
    } else {
      document.body.style.background = color;
    }

    return (
      <div className="public-routes">
        <div>
          <CloudinaryContext cloudName="ampled-web">
            <Nav match={props.match} history={props.history} />
            <main>
              <Component {...props} />
            </main>
          </CloudinaryContext>
        </div>
      </div>
    );
  };

  return <Route {...rest} render={renderComponent} />;
};
