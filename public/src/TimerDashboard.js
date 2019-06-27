import React, { Component } from 'react';
import EditableTimerList from './EditableTimerList';
import ToggleableTimerForm from './ToggleableTimerForm';
import { client } from './client';
import { helpers } from './helpers';

class TimerDashboard extends Component {
  state = {
    timers: []
  };

  componentDidMount() {
    this.loadTimersFromServer();
    setInterval(this.loadTimersFromServer, 5000);
  }

  loadTimersFromServer = () => {
    client.getTimers(serverTimers => this.setState({ timers: serverTimers }));
  };

  handleCreateFormSubmit = timer => {
    this.createTimer(timer);
  };

  handleEditFormSubmit = attrs => {
    this.updateTimer(attrs);
  };

  handleTrashFormSubmit = timerId => {
    this.deleteTimer(timerId);
  };

  handleStartClick = timerId => {
    this.startTimer(timerId);
  };

  handletStopClick = timerId => {
    this.stopTimer(timerId);
  };

  createTimer = timer => {
    const t = helpers.newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(t)
    });

    client.createTimer(t);
  };

  updateTimer = attrs => {
    this.setState({
      timers: this.state.timers.map(timer => {
        if (timer.id === attrs.id) {
          return Object.assign({}, timer, {
            title: attrs.title,
            project: attrs.project
          });
        } else {
          return timer;
        }
      })
    });

    client.updateTimer(attrs);
  };

  deleteTimer = timerId => {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId)
    });

    client.deleteTimer({ id: timerId });
  };

  startTimer = timerId => {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map(timer => {
        if (timerId === timer.id) {
          return Object.assign({}, timer, {
            runningSince: now
          });
        } else {
          return timer;
        }
      })
    });

    client.startTimer({ id: timerId, start: now });
  };

  stopTimer = timerId => {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map(timer => {
        if (timerId === timer.id) {
          const lastElapsed = now - timer.runningSince;
          return Object.assign({}, timer, {
            elapsed: timer.elapsed + lastElapsed,
            runningSince: null
          });
        } else {
          return timer;
        }
      })
    });

    client.stopTimer({
      id: timerId,
      stop: now
    });
  };

  render() {
    return (
      <div className="ui three column centered grid">
        <div className="column">
          <EditableTimerList
            timers={this.state.timers}
            onFormSubmit={this.handleEditFormSubmit}
            onTrashClick={this.handleTrashFormSubmit}
            onStartClick={this.handleStartClick}
            onStopClick={this.handletStopClick}
          />
          <ToggleableTimerForm onFormSubmit={this.handleCreateFormSubmit} />
        </div>
      </div>
    );
  }
}

export default TimerDashboard;
