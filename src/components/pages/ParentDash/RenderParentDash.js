import React, { useEffect, useState, useRef } from 'react';
import { Switch } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import { Layout } from 'antd';
import { ParentNav, DashHome, ChildSignup, Help } from './components';
import { getParentDash } from '../../../api';

// ParentDash component that contains a nav bar and routes to the various components
const RenderParentDash = props => {
  // sets state held in <App />
  const { setHeaderTitle } = props;

  // Keeps track of the state for ParentNav

  const [userInfo, setUserInfo] = useState(null);

  const loggedUser = JSON.parse(
    window.localStorage.getItem('okta-token-storage')
  );
  const token = JSON.parse(window.localStorage.getItem('curUserToken'));
  const tokenRef = useRef(token);
  const id = loggedUser.idToken.claims.sub;

  // Whenever this component mounts update the <Header /> title
  useEffect(() => {
    // The parent dashboard shouldn't have the header displayed
    // setting title to null will cause the <Header /> to not be rendered
    setHeaderTitle(null);
  }, [setHeaderTitle]);

  useEffect(() => {
    if (token) {
      getParentDash(tokenRef.current, id)
        .then(res => {
          console.log(res);
          setUserInfo(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  // Keeps track of state for Nav Bar

  return (
    <>
      <Layout style={{ background: '#fafafa', height: '100vh' }}>
        <ParentNav />
        <Switch>
          <>
            <SecureRoute
              exact
              path={'/dashboard'}
              component={() => <DashHome userInfo={userInfo} />}
            />
            <SecureRoute
              exact
              path={`/dashboard/add`}
              component={ChildSignup}
            />
            <SecureRoute exact path={'/dashboard/help'} component={Help} />
          </>
        </Switch>
      </Layout>
    </>
  );
};

export default RenderParentDash;
