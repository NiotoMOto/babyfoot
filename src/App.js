import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect
} from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { DefaultLayout } from "./DefaultLayout";
import { auth, db } from "./firebaseConfig";
import { Loader } from "./components/Loader";
import "semantic-ui-css/semantic.min.css";
import { MatchsPage } from "./pages/Matchs";

export const UserContext = React.createContext();

const withAuth = user => Component => props =>
  user ? <Component {...props} /> : <Redirect to="/login" />;

function useMe() {
  const [me, setMe] = useState();
  const [noUser, setNoUser] = useState(false);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        db.collection("users")
          .doc(user.uid)
          .get()
          .then(doc => doc.data())
          .then(userDb => {
            if (!userDb) {
              const [name, lastname] =
                user.displayName && user.displayName.split(" ");
              const userData = {
                uid: user.uid,
                name,
                lastname,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL
              };
              setMe(userData);
              db.collection("users")
                .doc(user.uid)
                .set(userData);
            } else {
              setMe(user);
            }
          });
      } else {
        setNoUser(true);
      }
    });
  }, []);

  return [me, noUser];
}

function Routes({ me, noUser }) {
  const withAuthUser = withAuth(me);

  return (
    <Router>
      <Fragment>
        {noUser && <Redirect to="/login" />}
        <Switch>
          <Route path="/login" component={Login} />
          {!me && !noUser ? (
            <Loader />
          ) : (
            <>
              <DefaultLayout exact path="/" component={withAuthUser(Home)} />
              <DefaultLayout
                exact
                path="/matchs/:week"
                component={withAuthUser(MatchsPage)}
              />
            </>
          )}
        </Switch>
      </Fragment>
    </Router>
  );
}

export function App() {
  const [me, noUser] = useMe();
  return (
    <UserContext.Provider value={me}>
      <Routes me={me} noUser={noUser} />
    </UserContext.Provider>
  );
}
export default App;
