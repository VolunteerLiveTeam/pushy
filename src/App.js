import React, { Component } from "react";
import logo from "./logo.svg";
import { keys, values, zipObject } from "lodash";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supported: null,
      enabled: null,
      categories: {
        breaking: true,
        event: false,
        misc: false
      }
    };
  }

  componentDidMount() {
    this.updateNotifState();
  }

  sendTags = () => {
    window.OneSignal.sendTags(
      zipObject(
        keys(this.state.categories),
        values(this.state.categories).map(x => (x ? "yes" : "no"))
      )
    );
  };

  updateNotifState() {
    console.log("uNS");
    window.OneSignal.push(() => {
      console.log("inside uNS");
      this.setState({
        supported: window.OneSignal.isPushNotificationsSupported()
      });
      window.OneSignal.isPushNotificationsEnabled(enabled => {
        this.setState({
          enabled: enabled
        });
      });
      window.OneSignal.on("subscriptionChange", isSubscribed => {
        this.setState({
          enabled: isSubscribed
        });
        // Have to send tags here to avoid weirdness
        if (isSubscribed) {
          this.sendTags();
        }
      });
    });
  }

  allChecked = (categories = null) => {
    const cats = categories || this.state.categories;
    return values(cats).every(x => x);
  };

  check = which => () => {
    if (which === "all") {
      this.setState(state => {
        if (this.allChecked(state.categories)) {
          return {
            ...state,
            categories: zipObject(
              keys(state.categories),
              keys(state.categories).map(x => false)
            )
          };
        } else {
          return {
            ...state,
            categories: zipObject(
              keys(state.categories),
              keys(state.categories).map(x => true)
            )
          };
        }
      });
    } else {
      this.setState(state => ({
        ...state,
        categories: {
          ...state.categories,
          [which]: !state.categories[which]
        }
      }));
    }
  };

  subscribe = () => {
    window.OneSignal.push(() => {
      window.OneSignal.registerForPushNotifications();
      window.OneSignal.setSubscription(true);
      this.updateNotifState();
    });
  };

  unsubscribe = () => {
    window.OneSignal.push(() => {
      window.OneSignal.setSubscription(false);
    });
  };

  renderCheckboxes = () => {
    return (
      <div>
        <input
          type="checkbox"
          checked={this.allChecked()}
          onChange={this.check("all")}
        />
        All Notifications<br />
        <input
          type="checkbox"
          checked={this.state.categories.breaking}
          onChange={this.check("breaking")}
        />
        Breaking News<br />
        <input
          type="checkbox"
          checked={this.state.categories.event}
          onChange={this.check("event")}
        />
        International Events<br />
        <input
          type="checkbox"
          checked={this.state.categories.misc}
          onChange={this.check("misc")}
        />
        Miscellaneous<br />
      </div>
    );
  };

  renderContent = () => {
    if (this.state.supported === null) {
      return <div>Please wait...</div>;
    }
    if (!this.state.supported) {
      return (
        <div>
          <b>We're sorry, your browser doesn't support push notifications</b>
          <br />
          Notifications are supported on Chrome and Firefox on Android, macOS,
          and Windows
        </div>
      );
    }
    if (this.state.enabled) {
      return (
        <div>
          <b>Subscribed!</b>
          <br />
          {this.renderCheckboxes()}
          <button onClick={this.sendTags}>Update Notification Preferences</button>
          <button onClick={this.unsubscribe}>Unsubscribe</button>
        </div>
      );
    } else {
      return (
        <div>
          <p>
            <b>Subscribe to push notifications</b>
          </p>
          <p>Select the categories of notifications you want to receive</p>
          {this.renderCheckboxes()}
          <button onClick={this.subscribe}>Subscribe</button>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="logo.png" className="App-logo" alt="logo" />
          <h1 className="App-title">VLT Push Notifications</h1>
        </header>
        <div className="App-main">{this.renderContent()}</div>
      </div>
    );
  }
}

export default App;
